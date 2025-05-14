import { useState, useEffect } from 'react';
import { getAnimationSettings, createScrollObserver, applyOptimizedAnimations } from './perf-optimizer';

/**
 * Custom hook that handles animation optimizations for React components
 * @param options Configuration options
 * @returns Animation settings and utilities
 */
export function useOptimizedAnimations(options = {}) {
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [animationSettings, setAnimationSettings] = useState({
    enableAnimations: true,
    carouselSpeed: 30,
    useSimpleAnimations: false,
    transitionDuration: '0.5s',
    enableParallax: true,
    enableBackgroundEffects: true
  });
  
  useEffect(() => {
    // Delay animations until after initial render for better performance
    requestAnimationFrame(() => {
      const settings = applyOptimizedAnimations();
      setAnimationSettings(settings);
      
      // Use a small delay to allow the DOM to settle before enabling animations
      setTimeout(() => {
        setAnimationsLoaded(true);
      }, 100);
    });
    
    // Setup optimized scroll observers for section animations
    const observer = createScrollObserver({
      elements: 'section',
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    return () => {
      // Clean up observer on unmount
      observer.disconnect();
    };
  }, []);
  
  // Calculate CSS class based on animation state
  const getAnimationClass = (baseClass, delayClass = '') => {
    if (!animationsLoaded) return 'opacity-0';
    
    const classes = [baseClass];
    if (delayClass) classes.push(delayClass);
    if (animationSettings.useSimpleAnimations) classes.push('simple-animation');
    
    return classes.join(' ');
  };
  
  // Provides an easy way to add optimized animation classes
  const animateElement = (element, animationType = 'fade-in', delay = 0) => {
    if (!animationsLoaded || !animationSettings.enableAnimations) {
      return { opacity: 0 };
    }
    
    // Apply different animation styles based on settings
    const delayValue = animationSettings.useSimpleAnimations 
      ? delay / 2  // Faster delays for simple animations
      : delay;
    
    const animationClass = `animate-${animationType}`;
    const delayClass = delayValue > 0 ? `delay-${delayValue}` : '';
    
    return {
      className: `${animationClass} ${delayClass}`.trim()
    };
  };
  
  return {
    animationsLoaded,
    animationSettings,
    getAnimationClass,
    animateElement
  };
} 