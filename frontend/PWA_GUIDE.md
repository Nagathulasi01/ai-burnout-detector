# BurnoutAI - Mobile-Friendly Responsive PWA Platform

## Overview

BurnoutAI has been converted into a fully-featured, mobile-friendly Progressive Web Application (PWA) designed for optimal wellness tracking and support across all devices.

## 🎯 Key Features

### Progressive Web App (PWA)
- **Installable**: Install directly from browser to home screen
- **Offline-Ready**: Full offline support with service worker caching
- **App-Like Experience**: Standalone mode removes browser UI
- **Fast Loading**: Optimized asset caching and lazy loading
- **Automatic Updates**: Background sync with notification prompts

### Mobile Responsive
- **Mobile-First Design**: Optimized for screens as small as 360px
- **Touch-Optimized**: 44x44px minimum touch targets
- **Safe Area Support**: Notch and island handling for modern phones
- **Adaptive Layouts**: Responsive grid and flexbox layouts
- **Performance**: Lightweight and fast on all devices

### Cross-Platform Support
- **iOS**: Full PWA support with Apple-specific optimizations
- **Android**: Chrome PWA installation and Android shortcuts
- **Desktop**: Responsive design with full feature support
- **Browsers**: Chrome, Edge, Firefox, Safari

### Accessibility
- **WCAG Compliant**: Color contrast and semantic HTML
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Motion Reduction**: Respects prefers-reduced-motion
- **High Contrast**: High contrast mode support

## 📱 Installation

### On Android
1. Open BurnoutAI in Chrome browser
2. Look for "Install" prompt at bottom of screen
3. Tap "Install" to add to home screen
4. App opens in fullscreen mode

### On iOS (Safari)
1. Open BurnoutAI in Safari
2. Tap share button (box with arrow)
3. Select "Add to Home Screen"
4. Name your app and tap "Add"
5. App opens in fullscreen PWA mode

### On Desktop
1. Open BurnoutAI in compatible browser
2. Look for install icon in address bar
3. Click to install
4. Opens as standalone window

## 🔐 Offline Support

### What Works Offline
- ✅ View cached pages and assessments
- ✅ Read previous dashboard insights
- ✅ Access reminder settings
- ✅ Use chat with locally stored responses
- ✅ Full UI navigation

### Data Syncing
- Documents: Stale-while-revalidate (cache with background update)
- API Calls: Network-first (try online, fallback to cache)
- Assets: Cache-first (use cached, check for updates)
- Images: Long-term caching (30 days)

### Offline Indicator
- Orange banner shows when offline
- Automatic reconnection detection
- Data syncs when connection restored

## 🎨 Responsive Breakpoints

```
Mobile:    < 640px   (sm)
Tablet:    640px+    (md)
Desktop:   1024px+   (lg)
Wide:      1280px+   (xl)
Ultra:     1536px+   (2xl)
```

All components use Tailwind's responsive classes for optimal display at each breakpoint.

## 📐 Mobile Navigation

### Bottom Navigation (Mobile Only)
Persistent navigation bar at bottom provides quick access to:
- 🏠 Home - Dashboard and main features
- ⚡ Assessment - Burnout assessment tool
- 📊 Dashboard - Analytics and insights
- 🔔 Reminders - Wellness notifications

### Desktop Menu
Floating menu button (desktop only) provides same navigation options in dropdown.

## 🔄 Service Worker Caching Strategy

### Network-First (API Routes)
- `/api/*` - Try network, fallback to cache
- Cache expires: 5 minutes
- Best for: Real-time data, ML predictions

### Cache-First (Assets)
- `.js`, `.css`, `.woff2`, `/assets/` - Use cache, update background
- Cache expires: 30 days for images, 7 days for fonts
- Best for: Static assets, performance

### Stale-While-Revalidate (Documents)
- HTML pages, manifests - Return cache, update in background
- Cache expires: 7 days
- Best for: Core pages, balance speed and freshness

## 🍎 iOS-Specific Features

### Safe Area Support
- Notch/Island automatic handling via `env(safe-area-inset-*)`
- Safe padding on bottom navigation
- Proper viewport handling

### Viewport Optimization
- `viewport-fit=cover` for full-screen use
- `maximum-scale=5` prevents unwanted zoom
- `user-scalable=yes` for accessibility

### Web App Properties
- `apple-mobile-web-app-capable: yes` - Full screen mode
- `apple-mobile-web-app-status-bar-style: black-translucent` - Status bar style
- `apple-mobile-web-app-title` - App name in home screen

## 🛠 Build & Deployment

### Development
```bash
cd frontend
npm install
npm run dev
```

Service Worker works in development with `devOptions.enabled: true`

### Production Build
```bash
npm run build
```

Output in `dist/` includes:
- Optimized JavaScript (gzipped)
- Service worker with auto-update
- Manifest with all PWA properties
- Icons in multiple sizes

### Deployment
- Static files: Deploy `dist/` folder
- HTTPS required for service workers
- Enable gzip compression on server
- Set proper cache headers

## 📦 File Structure

```
frontend/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service worker
│   ├── offline.html            # Offline fallback
│   ├── browserconfig.xml       # Windows tiles
│   └── icons/
│       ├── icon-*.png          # App icons (need to be created)
│       ├── favicon-*.png       # Favicon
│       └── *-maskable.png      # Adaptive icons for Android
├── src/
│   ├── components/
│   │   ├── InstallPrompt.jsx    # Install banner
│   │   ├── UpdatePrompt.jsx     # Update notification
│   │   ├── MobileNavigation.jsx # Mobile nav bar
│   │   └── ...
│   ├── styles/
│   │   └── mobile.css           # Mobile & safe area styles
│   ├── utils/
│   │   ├── pwaUtils.js          # PWA utilities
│   │   └── ...
│   └── pages/
│       └── ...
├── vite.config.js               # PWA plugin config
└── index.html                   # PWA meta tags
```

## 🎨 Required Assets

To make the PWA fully functional, create these icons and save in `frontend/public/icons/`:

### Required Icons
- `icon-64.png` - 64x64px (favicon)
- `icon-192.png` - 192x192px (Android, iOS)
- `icon-192-maskable.png` - 192x192px (Adaptive Android)
- `icon-512.png` - 512x512px (Splash screen)
- `icon-512-maskable.png` - 512x512px (Adaptive splash)
- `favicon-16.png` - 16x16px
- `favicon-32.png` - 32x32px

### Tips for Icons
- Use solid background (currently using #0f172a - dark blue)
- Add theme color accents (#3b82f6 - blue, #06b6d4 - cyan)
- Maskable icons should have 40% padding from edges
- PNG format recommended
- SVG favicon supported in index.html

### Optional
- `assessment-icon.png` - Shortcut icon for assessments
- `dashboard-icon.png` - Shortcut icon for dashboard
- `chat-icon.png` - Shortcut icon for chat
- `mobile-1.png`, `mobile-2.png` - App store screenshots

## 🔍 Testing the PWA

### Test Offline Mode
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline" checkbox
4. Navigate pages - should work without internet

### Test Install Prompt
1. Open DevTools
2. Run in Console: `window.__DEVTOOLS__.handleSWInstallPrompt()`
3. Should see install banner

### Test Caching
1. Open DevTools → Network
2. Take note of Response Size
3. Go offline, reload page
4. Sizes should show same (from cache)

### Check Manifest
1. DevTools → Application → Manifest
2. Verify all properties are correct
3. Test each icon loads

### Desktop Install
1. Chrome: Look for install icon in address bar (🔧 icon)
2. Click and confirm installation
3. Opens in standalone window

### Mobile Install
- Android Chrome: Bottom banner "Install"
- iOS Safari: Share → Add to Home Screen

## 📊 Performance Metrics

Target performance:
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **Offline FCP**: < 500ms (from cache)

## 🔐 Data Privacy

All data stored:
- ✅ Locally in browser (`localStorage`)
- ✅ Not sent to analytics services
- ✅ Not shared with third parties
- ✅ Cleared when browser data cleared

## ⚙️ Configuration

### Manifest Customization
Edit `frontend/public/manifest.json`:
- Colors: `theme_color`, `background_color`
- Display: Change `display` (standalone/fullscreen/minimal-ui)
- Shortcuts: Add custom app shortcuts
- Categories: Add to app stores

### Service Worker Strategy
Edit `frontend/vite.config.js` PWA options:
- `runtimeCaching`: Customize cache strategies
- `globPatterns`: Change what gets cached
- `maxAgeSeconds`: Cache expiration times

### App Name & Description
Update multiple files:
- `public/manifest.json` - App name, description
- `index.html` - Browser tab title, meta tags
- Component titles and labels

## 🐛 Troubleshooting

### Install Prompt Not Showing
- Check criteria: HTTPS, Service Worker registered, manifest valid
- Open DevTools: Application → Manifest
- Verify all required fields present
- Try incognito mode (fresh install state)

### Offline Mode Not Working
- Service Worker must be registered
- Check DevTools → Application → Service Workers
- Verify status is "activated"
- Check Network tab caching

### Updates Not Showing
- Service Worker updates auto-check every minute
- Manual check: DevTools → Application → Service Workers → "Check for updates"
- Browser restart may be needed
- Hard refresh (Ctrl+Shift+R) to force update

### Icons Not Showing
- Check icon files exist in `public/icons/`
- Verify paths in manifest match files
- Icons must be valid PNG or WebP
- Try different sizes if one not showing

### Mobile Issues
- Clear browser cache/storage if persistent
- Uninstall and reinstall the app
- Try different browser (Chrome vs Safari)
- Check iOS version (PWA support better on iOS 15+)

## 🚀 Next Steps

1. **Add Icons**: Create or generate app icons (see "Required Assets")
2. **Add Screenshots**: Create mobile screenshots for app stores
3. **Deploy**: Push to HTTPS server
4. **Promote**: Show install banner to users
5. **Monitor**: Track PWA installs and engagement
6. **Update**: Regularly update ML model and features

## 📚 Resources

- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 📝 License

BurnoutAI - A wellness-focused AI platform for burnout assessment and recovery tracking.

---

**Last Updated**: May 31, 2026  
**Version**: 1.0.0 (PWA Ready)
