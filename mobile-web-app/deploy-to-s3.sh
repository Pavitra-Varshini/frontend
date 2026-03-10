#!/bin/bash

# Deployment script for Notes App to AWS S3
# Usage: ./deploy-to-s3.sh <bucket-name>

set -e

# Check if bucket name is provided
if [ -z "$1" ]; then
  echo "Error: Bucket name is required"
  echo "Usage: ./deploy-to-s3.sh <bucket-name>"
  exit 1
fi

BUCKET_NAME=$1
REGION=${2:-us-east-1}

echo "🚀 Deploying Notes App to S3..."
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"
echo ""

# Check if web-build directory exists
if [ ! -d "web-build" ]; then
  echo "❌ Error: web-build directory not found"
  echo "Please run 'npm run build:web' first"
  exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "❌ Error: AWS CLI is not installed"
  echo "Please install AWS CLI: https://aws.amazon.com/cli/"
  exit 1
fi

# Check if bucket exists
echo "📦 Checking if bucket exists..."
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 > /dev/null; then
  echo "⚠️  Bucket does not exist. Creating bucket..."
  aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
  echo "✅ Bucket created"
else
  echo "✅ Bucket exists"
fi

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website "s3://$BUCKET_NAME" \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public access
echo "🔓 Setting bucket policy for public access..."
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy file:///tmp/bucket-policy.json

# Disable block public access
echo "🔓 Disabling block public access..."
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Upload files
echo "📤 Uploading files to S3..."

# Upload static assets with long cache
aws s3 sync web-build/ "s3://$BUCKET_NAME/" \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "manifest.json" \
  --exclude "serve.json" \
  --exclude "asset-manifest.json"

# Upload index.html with no-cache
aws s3 cp web-build/index.html "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# Upload manifest files with no-cache
aws s3 cp web-build/manifest.json "s3://$BUCKET_NAME/manifest.json" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "application/json"

if [ -f "web-build/asset-manifest.json" ]; then
  aws s3 cp web-build/asset-manifest.json "s3://$BUCKET_NAME/asset-manifest.json" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "application/json"
fi

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Website URL: $WEBSITE_URL"
echo ""
echo "📝 Next steps:"
echo "  1. Visit $WEBSITE_URL to test your app"
echo "  2. (Optional) Set up CloudFront for HTTPS and better performance"
echo "  3. (Optional) Configure a custom domain"
echo ""
