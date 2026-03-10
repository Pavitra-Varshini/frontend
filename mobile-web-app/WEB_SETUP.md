# React Native Web Configuration

This document describes the React Native Web setup for the Notes App.

## Overview

The app uses React Native with Expo and React Native Web to support iOS, Android, and Web platforms from a single codebase.

## Configuration Files

### webpack.config.js
Custom webpack configuration that:
- Configures platform-specific file resolution (.web.tsx, .web.ts, etc.)
- Transpiles necessary modules for web compatibility
- Extends the default Expo webpack config

### app.json
Expo configuration with web-specific settings:
- Uses webpack bundler for web builds
- Configures web favicon and other web-specific options

### Platform-Specific Files

The app supports platform-specific file extensions:
- `.web.tsx` / `.web.ts` - Web-specific implementations
- `.ios.tsx` / `.ios.ts` - iOS-specific implementations
- `.android.tsx` / `.android.ts` - Android-specific implementations
- `.tsx` / `.ts` - Default implementation for all platforms

When importing a module, React Native will automatically use the platform-specific version if available.

Example:
```typescript
// Import will use platform.web.ts on web, platform.ts on mobile
import platformConfig from './config/platform';
```

## Running the Web App

```bash
# Start the web development server
npm run web

# Or with Expo CLI
expo start --web
```

## Building for Web

```bash
# Build for production
expo build:web
```

## Platform Detection

Use the `Platform` API from React Native to detect the current platform:

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
} else if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}
```

## Responsive Design

The app uses the `useResponsive` hook for responsive layouts:

```typescript
import { useResponsive } from './hooks/useResponsive';

const { isSmallScreen, isMediumScreen, isLargeScreen, width, height } = useResponsive();
```

Screen size breakpoints:
- Small: < 768px (mobile)
- Medium: 768px - 1023px (tablet)
- Large: >= 1024px (desktop)

## Requirements

- Requirements 13.2: React Native Web for web browser platform
- Requirements 13.3: Shared common components across all platforms
- Requirements 13.6: Responsive UI appropriate for each screen size
