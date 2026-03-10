# Notes App Frontend

Cross-platform mobile and web application built with React Native, Expo, and React Native Web.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual API URL
```

## Environment Variables

The frontend uses the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_BASE_URL` | Backend API base URL | http://localhost:3000 | Yes |

### Configuration Methods

There are two ways to configure the API base URL:

#### Method 1: Using app.json (Recommended for Expo)

Edit `app.json` and update the `extra.apiBaseUrl` field:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"
    }
  }
}
```

This method works for both native (iOS/Android) and web builds.

#### Method 2: Using Environment Variables (Web only)

For web builds, you can also set the `API_BASE_URL` environment variable:

```bash
export API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
npm run web
```

Or create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
# Edit .env with your actual API URL
```

**Note**: Environment variables in `.env` files only work for web builds. For native builds, use the app.json method.

After deploying the backend, update the `apiBaseUrl` in `app.json` with the API Gateway URL from the CDK deployment output.

Example:
```
apiBaseUrl: "https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod"
```

## Project Structure

```
frontend/mobile-web-app/
├── src/
│   ├── components/   # Reusable UI components
│   ├── screens/      # Screen components
│   ├── services/     # Business logic services
│   └── api/          # API client functions
├── App.tsx           # Root component
└── package.json
```

## Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Building

Build for production:
```bash
expo build:ios      # iOS
expo build:android  # Android
expo build:web      # Web
```
