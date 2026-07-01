// Service Worker and PWA utilities for BurnoutAI

/**
 * Register service worker and handle updates
 */
export async function registerServiceWorker(onUpdate) {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('Service Worker registered successfully:', registration);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker ready
          console.log('New service worker available');
          if (onUpdate) {
            onUpdate();
          }
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('Service Worker unregistered');
      return true;
    }
  } catch (error) {
    console.error('Failed to unregister Service Worker:', error);
  }
  return false;
}

/**
 * Check if PWA is installed
 */
export function isAppInstalled() {
  return window.navigator.standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches;
}

/**
 * Check if PWA is installable
 */
export function isPWAInstallable() {
  return window.navigator.standalone === false && 
         !window.matchMedia('(display-mode: standalone)').matches &&
         'serviceWorker' in navigator;
}

/**
 * Force update service worker
 */
export async function updateServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker update checked');
    }
  } catch (error) {
    console.error('Failed to update Service Worker:', error);
  }
}

/**
 * Skip waiting on new service worker
 */
export async function skipWaitingServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  } catch (error) {
    console.error('Failed to skip waiting:', error);
  }
}

/**
 * Reload app after service worker update
 */
export function reloadApp() {
  if (navigator.serviceWorker.controller) {
    // Register for controller change event
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    // Tell service worker to skip waiting
    skipWaitingServiceWorker();
  }
}

/**
 * Check online status
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Listen to online/offline changes
 */
export function onOnlineStatusChange(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Check cache storage available space
 */
export async function getCacheStorageInfo() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentage: Math.round((estimate.usage / estimate.quota) * 100)
      };
    } catch (error) {
      console.error('Failed to get cache storage info:', error);
    }
  }
  return null;
}

/**
 * Clear cache
 */
export async function clearCache() {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Cache cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
  return false;
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersistent = await navigator.storage.persist();
      console.log(`Persistent storage: ${isPersistent ? 'granted' : 'denied'}`);
      return isPersistent;
    } catch (error) {
      console.error('Failed to request persistent storage:', error);
    }
  }
  return false;
}

/**
 * Share data (Web Share API)
 */
export async function shareData(data) {
  if (navigator.share) {
    try {
      await navigator.share(data);
      console.log('Data shared successfully');
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share:', error);
      }
    }
  }
  return false;
}

/**
 * Check if Web Share API is supported
 */
export function isShareSupported() {
  return !!navigator.share;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  }
  return false;
}

/**
 * Show notification
 */
export async function showNotification(title, options = {}) {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, {
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-64.png',
          ...options
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }
  return false;
}

/**
 * Request background sync (for future features)
 */
export async function registerBackgroundSync(tag) {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.sync.register(tag);
        console.log(`Background sync registered: ${tag}`);
        return true;
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }
  return false;
}

/**
 * Get device info
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    onLine: navigator.onLine,
    connection: navigator.connection?.effectiveType || 'unknown',
    cores: navigator.hardwareConcurrency || 'unknown',
    memory: navigator.deviceMemory || 'unknown',
    standalone: window.navigator.standalone === true
  };
}
