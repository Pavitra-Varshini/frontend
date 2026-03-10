import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type ScreenSize = 'small' | 'medium' | 'large';

interface ResponsiveValues {
  width: number;
  height: number;
  screenSize: ScreenSize;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}

/**
 * Hook for responsive screen size detection
 * Requirements: 13.6
 */
export const useResponsive = (): ResponsiveValues => {
  const [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const getScreenSize = (width: number): ScreenSize => {
    if (width < 768) return 'small';
    if (width < 1024) return 'medium';
    return 'large';
  };

  const screenSize = getScreenSize(dimensions.width);

  return {
    width: dimensions.width,
    height: dimensions.height,
    screenSize,
    isSmallScreen: screenSize === 'small',
    isMediumScreen: screenSize === 'medium',
    isLargeScreen: screenSize === 'large',
  };
};
