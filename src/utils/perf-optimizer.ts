/**
 * Performance Optimization Utilities
 * 
 * This file contains utility functions to help optimize performance
 * in the React application, particularly for animation-heavy components.
 */

/**
 * Detects if the browser is running on a low-end device
 * to potentially reduce animations and effects
 */
export const isLowEndDevice = (): boolean => {
  // Check for low memory (less than 4GB)
  const lowMemory = 'deviceMemory' in navigator && 
    // @ts-ignore: deviceMemory is not in the standard navigator type
    (navigator.deviceMemory as number) < 4;

  // Check for slow CPU (less than 4 cores)
  const slowCPU = navigator.hardwareConcurrency && 
    navigator.hardwareConcurrency < 4;

  // Check for battery saving mode if available
  const batterySaving = 'getBattery' in navigator && 
    // @ts-ignore: getBattery is not in the standard navigator type
    navigator.getBattery && 
    // @ts-ignore
    navigator.getBattery().then((battery: any) => battery.charging === false && battery.level < 0.2);

  return lowMemory || slowCPU || !!batterySaving;
};

/**
 * Throttles animations to optimize performance
 * @param callback Function to throttle
 * @param limit Time limit in ms
 */
export const throttle = (callback: Function, limit: number = 100): Function => {
  let waiting = false;
  return function(this: any, ...args: any[]) {
    if (!waiting) {
      callback.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

/**
 * Creates an optimized scroll listener using IntersectionObserver
 * @param options Configuration options
 */
export const createScrollObserver = ({
  elements = 'section',
  threshold = 0.1,
  rootMargin = '0px',
  visibleClass = 'section-visible',
  callback
}: {
  elements?: string;
  threshold?: number;
  rootMargin?: string;
  visibleClass?: string;
  callback?: (entry: IntersectionObserverEntry) => void;
}) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          if (callback) callback(entry);
        }
      });
    },
    { threshold, rootMargin }
  );

  const targets = document.querySelectorAll(elements);
  targets.forEach(target => {
    observer.observe(target);
  });

  return {
    disconnect: () => observer.disconnect(),
  };
};

/**
 * Reduces animation complexity based on device capabilities
 * @returns An object with animation settings
 */
export const getAnimationSettings = () => {
  const lowEnd = isLowEndDevice();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const shouldReduceAnimations = lowEnd || prefersReducedMotion;
  
  return {
    enableAnimations: !prefersReducedMotion,
    carouselSpeed: shouldReduceAnimations ? 60 : 30, // Slower on high-end devices for smoother effect
    useSimpleAnimations: shouldReduceAnimations,
    transitionDuration: shouldReduceAnimations ? '0.3s' : '0.5s',
    enableParallax: !shouldReduceAnimations,
    enableBackgroundEffects: !shouldReduceAnimations
  };
};

/**
 * Optimizes image loading by using the browser's Intersection Observer
 * @param imageSelector CSS selector for images to lazy load
 */
export const setupLazyImageLoading = (imageSelector: string = 'img[loading="lazy"]') => {
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute('data-src');
          }
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    const lazyImages = document.querySelectorAll(imageSelector);
    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const lazyImages = document.querySelectorAll(imageSelector);
    lazyImages.forEach((image) => {
      const img = image as HTMLImageElement;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }
};

/**
 * Applies optimized animation styles based on device capabilities
 */
export const applyOptimizedAnimations = () => {
  const settings = getAnimationSettings();
  
  // Apply CSS variables for animation settings
  document.documentElement.style.setProperty('--carousel-speed', `${settings.carouselSpeed}s`);
  document.documentElement.style.setProperty('--transition-duration', settings.transitionDuration);
  
  // Add class to body to control animations globally
  if (settings.useSimpleAnimations) {
    document.body.classList.add('reduce-animations');
  }
  
  if (!settings.enableBackgroundEffects) {
    document.body.classList.add('disable-background-effects');
  }
  
  // Return settings to be used in components
  return settings;
}; 