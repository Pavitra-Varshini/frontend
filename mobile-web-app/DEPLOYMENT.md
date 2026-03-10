# Web App Deployment Guide

## Build for Production

The web app has been built and is ready for deployment. The production build is located in the `web-build/` directory.

### Build Command

```bash
npm run build:web
```

This creates an optimized production build in the `web-build/` directory.

## Deploy to AWS S3 Static Website Hosting

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. An S3 bucket created for static website hosting

### Option 1: Manual Deployment via AWS Console

1. Go to AWS S3 Console
2. Create a new bucket (or use existing one)
3. Enable "Static website hosting" in bucket properties
4. Set index document to `index.html`
5. Set error document to `index.html` (for client-side routing)
6. Upload all files from `web-build/` directory to the bucket
7. Make the bucket publicly accessible (or use CloudFront)

### Option 2: Deploy via AWS CLI

#### Step 1: Create S3 Bucket (if not exists)

```bash
aws s3 mb s3://your-notes-app-bucket-name
```

#### Step 2: Configure Bucket for Static Website Hosting

```bash
aws s3 website s3://your-notes-app-bucket-name \
  --index-document index.html \
  --error-document index.html
```

#### Step 3: Set Bucket Policy for Public Access

Create a file `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-notes-app-bucket-name/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket your-notes-app-bucket-name \
  --policy file://bucket-policy.json
```

#### Step 4: Upload Build Files

```bash
cd frontend/mobile-web-app
aws s3 sync web-build/ s3://your-notes-app-bucket-name/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "manifest.json" \
  --exclude "serve.json"

# Upload index.html with no-cache to ensure updates are seen immediately
aws s3 cp web-build/index.html s3://your-notes-app-bucket-name/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

aws s3 cp web-build/manifest.json s3://your-notes-app-bucket-name/manifest.json \
  --cache-control "no-cache, no-store, must-revalidate"
```

#### Step 5: Get Website URL

```bash
echo "http://your-notes-app-bucket-name.s3-website-us-east-1.amazonaws.com"
```

Replace `us-east-1` with your bucket's region.

### Option 3: Deploy with CloudFront (Recommended for Production)

For better performance and HTTPS support, use CloudFront:

1. Create a CloudFront distribution
2. Set origin to your S3 bucket
3. Configure custom error responses:
   - Error code: 403, Response page: /index.html, Response code: 200
   - Error code: 404, Response page: /index.html, Response code: 200
4. Enable HTTPS
5. Optionally add a custom domain

## Environment Variables

The production build uses the API URL from `.env`:

```
API_BASE_URL=https://wp4l0jdfga.execute-api.us-east-1.amazonaws.com/prod
```

If you need to change the API URL, update `.env` and rebuild:

```bash
npm run build:web
```

## Testing the Production Build Locally

You can test the production build locally before deploying:

```bash
npx serve web-build
```

Then open http://localhost:3000 in your browser.

## Deployment Checklist

- [ ] Build completed successfully (`npm run build:web`)
- [ ] `.env` file has correct production API URL
- [ ] S3 bucket created and configured for static website hosting
- [ ] Bucket policy allows public read access
- [ ] Files uploaded to S3
- [ ] Website accessible via S3 URL
- [ ] (Optional) CloudFront distribution configured
- [ ] (Optional) Custom domain configured

## Troubleshooting

### Issue: Blank page after deployment

- Check browser console for errors
- Verify API URL in `.env` is correct
- Ensure bucket policy allows public access

### Issue: 404 errors on page refresh

- Ensure error document is set to `index.html` in S3 static website hosting settings
- If using CloudFront, configure custom error responses

### Issue: API calls failing

- Check CORS configuration on API Gateway
- Verify API URL is correct
- Check browser network tab for error details

## Current Deployment

- **API URL**: https://wp4l0jdfga.execute-api.us-east-1.amazonaws.com/prod
- **Build Directory**: `web-build/`
- **Build Size**: ~829 KiB (main bundle)

## Next Steps

1. Deploy to S3 using one of the methods above
2. Test the deployed application
3. (Optional) Set up CloudFront for better performance
4. (Optional) Configure custom domain
5. (Optional) Set up CI/CD pipeline for automatic deployments
