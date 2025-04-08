'use client';

import { useState, useEffect } from 'react';
import { getCarrierColorPalette, ColorPalette } from '@/lib/colorUtils';

export function useCarrierColors(carrierId: string) {
  const [colors, setColors] = useState<ColorPalette | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!carrierId) {
      setColors(null);
      setLoading(false);
      return;
    }

    // Get colors from cache or localStorage
    const palette = getCarrierColorPalette(carrierId);
    setColors(palette);
    setLoading(false);
  }, [carrierId]);

  return {
    colors,
    loading,
    // Convenience getters
    primaryColor: colors?.primary || null,
    lightColor: colors?.light || null,
    darkColor: colors?.dark || null,
    // Helper functions for styling
    getBackgroundStyle: (variant: 'primary' | 'light' | 'dark' = 'primary') => {
      if (!colors) return {};
      return { backgroundColor: colors[variant] };
    },
    getShadowStyle: () => {
      if (!colors) return {};
      return { 
        boxShadow: `0px -2px 2px 0px rgba(0, 0, 0, 0.16) inset, 
                    0px 2px 2px 0px rgba(255, 255, 255, 0.83) inset, 
                    0px 25px 50px -12px ${colors.dark}` 
      };
    },
    getBorderStyle: (variant: 'primary' | 'light' | 'dark' = 'primary') => {
      if (!colors) return {};
      return { borderColor: colors[variant] };
    }
  };
} 