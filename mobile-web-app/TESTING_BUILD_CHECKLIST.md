# Testing Build Checklist

## Pre-Build Setup

- [ ] Node.js installed (v16+)
- [ ] Project dependencies installed: `npm install`
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into Expo: `eas login`
- [ ] `.env` file created with API_BASE_URL
- [ ] Updated `app.json` with correct bundle identifiers

## Android Build (Recommended for Quick Testing)

- [ ] Run: `eas build:configure` (first time only)
- [ ] Run: `eas build --platform android --profile preview`
- [ ] Wait for build to complete (15-20 minutes)
- [ ] Download APK from build completion email
- [ ] Test APK installation on Android device
- [ ] Share APK with testers

## iOS Build (Requires Apple Developer Account)

- [ ] Apple Developer account active ($99/year)
- [ ] Run: `eas build:configure` (first time only)
- [ ] Run: `eas build --platform ios --profile production`
- [ ] Wait for build to complete (15-30 minutes)
- [ ] Run: `eas submit --platform ios`
- [ ] Configure TestFlight in App Store Connect
- [ ] Add testers to TestFlight
- [ ] Send TestFlight invitations

## Testing Verification

- [ ] App installs without errors
- [ ] App launches successfully
- [ ] Sign up flow works
- [ ] OTP email received
- [ ] OTP verification works
- [ ] Login flow works
- [ ] Create note works
- [ ] View notes list works
- [ ] Edit note works
- [ ] Delete note works
- [ ] Logout works

## Deliverables

- [ ] Android APK file or download link
- [ ] iOS TestFlight invitation (if applicable)
- [ ] Installation instructions for testers
- [ ] Known issues list (if any)
- [ ] Build logs (if issues occurred)

## Common Issues & Solutions

### Build Fails
- Check `eas build:list` for error logs
- Verify `app.json` is valid JSON
- Ensure bundle identifiers are unique
- Try: `eas build --platform [android|ios] --clear-cache`

### App Crashes on Launch
- Verify API_BASE_URL in `.env`
- Check backend API is accessible
- Test API endpoint: `curl https://wp4l0jdfga.execute-api.us-east-1.amazonaws.com/prod/auth/signup`

### iOS Signing Issues
- Run: `eas credentials` to manage certificates
- Ensure Apple Developer account is active
- Verify bundle identifier matches Apple Developer portal

### Android Installation Blocked
- Enable "Install from Unknown Sources" on device
- Check APK is not corrupted (re-download if needed)

## Build Commands Reference

```bash
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]

# Cancel running build
eas build:cancel

# Manage credentials
eas credentials

# View project info
eas project:info
```

## Support Resources

- Expo Docs: https://docs.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- Troubleshooting: https://docs.expo.dev/build-reference/troubleshooting/
- Community: https://forums.expo.dev/

---

**API Endpoint**: https://wp4l0jdfga.execute-api.us-east-1.amazonaws.com/prod
**Test Email**: mandyjoshi@hotmail.com
**Expected Build Time**: 15-30 minutes per platform
