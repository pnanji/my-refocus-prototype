// Color extraction using Canvas API instead of node-vibrant

// Safely check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export type ColorPalette = {
  primary: string;
  light: string;
  dark: string;
};

// Default colors to use as fallback
const defaultPalette: ColorPalette = {
  primary: '#0f172a', // slate-900
  light: 'hsla(222, 47%, 11%, 0.1)',
  dark: 'hsl(222, 47%, 5%)'
};

// Map to store carrier color palettes
const carrierColorCache: Record<string, ColorPalette> = {};

// Function to save a color palette for a carrier
export function saveCarrierColorPalette(carrierId: string, palette: ColorPalette): void {
  carrierColorCache[carrierId] = palette;
  // In a real application, this would save to a database or localStorage
  try {
    if (typeof window !== 'undefined') {
      const savedPalettes = JSON.parse(localStorage.getItem('carrierColors') || '{}');
      savedPalettes[carrierId] = palette;
      localStorage.setItem('carrierColors', JSON.stringify(savedPalettes));
    }
  } catch (error) {
    console.error('Error saving carrier color palette to localStorage:', error);
  }
}

// Function to get a color palette for a carrier
export function getCarrierColorPalette(carrierId: string): ColorPalette | null {
  // First check the in-memory cache
  if (carrierColorCache[carrierId]) {
    return carrierColorCache[carrierId];
  }
  
  // Then check localStorage if available
  try {
    if (typeof window !== 'undefined') {
      const savedPalettes = JSON.parse(localStorage.getItem('carrierColors') || '{}');
      if (savedPalettes[carrierId]) {
        // Add to in-memory cache
        carrierColorCache[carrierId] = savedPalettes[carrierId];
        return savedPalettes[carrierId];
      }
    }
  } catch (error) {
    console.error('Error retrieving carrier color palette from localStorage:', error);
  }
  
  return null;
}

// Color utilities
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] 
    : [0, 0, 0];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h, s, l];
}

// Check if a color is grayscale (or close to it)
function isGrayscale(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // If the difference between max and min is small, it's close to grayscale
  return (max - min) < 30;
}

// Extract colors from an image using Canvas
export async function extractLogoColors(imageUrl: string): Promise<ColorPalette> {
  // Return default palette immediately if not in browser
  if (!isBrowser) {
    console.log('Color extraction unavailable: not in browser environment');
    return { ...defaultPalette };
  }
  
  try {
    // Load the image
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS for cross-origin images
    
    // Create a promise to wait for the image to load
    const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });

    // Wait for the image to load
    const loadedImg = await imageLoaded;
    
    // Create canvas and get context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Set canvas size - we can use a smaller size for performance
    const maxSize = 100; // Analyze at most 100x100 pixels for performance
    const scale = Math.min(1, maxSize / Math.max(loadedImg.width, loadedImg.height));
    canvas.width = loadedImg.width * scale;
    canvas.height = loadedImg.height * scale;
    
    // Draw image to canvas
    ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
    
    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    
    // Store frequency of colors
    const colorCounts: Record<string, number> = {};
    
    // Sample step - we don't need to analyze every pixel
    const sampleStep = Math.max(1, Math.floor((width * height) / 1000));
    
    // Count colors, ignoring transparent pixels and edges
    const borderIgnore = 2; // Ignore pixels near the edge
    for (let y = borderIgnore; y < height - borderIgnore; y++) {
      for (let x = borderIgnore; x < width - borderIgnore; x += sampleStep) {
        const i = (y * width + x) * 4;
        
        // Skip transparent or near-transparent pixels
        if (data[i + 3] < 200) continue;
        
        // Skip white, near-white, black, and near-black pixels
        if ((data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) || 
            (data[i] < 15 && data[i + 1] < 15 && data[i + 2] < 15)) {
          continue;
        }
        
        const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
    }
    
    // Convert to array and sort by frequency
    const sortedColors = Object.entries(colorCounts)
      .map(([color, count]) => ({ 
        color, 
        count, 
        rgb: hexToRgb(color),
        isGray: isGrayscale(...hexToRgb(color)) 
      }))
      .sort((a, b) => b.count - a.count);
    
    // Prioritize non-grayscale colors
    const nonGrayscaleColors = sortedColors.filter(c => !c.isGray);
    
    // Choose the primary color
    let primaryColor: string;
    if (nonGrayscaleColors.length > 0) {
      // Use the most frequent non-grayscale color
      primaryColor = nonGrayscaleColors[0].color;
    } else if (sortedColors.length > 0) {
      // Fall back to the most frequent color
      primaryColor = sortedColors[0].color;
    } else {
      // If no colors were found, use a default
      primaryColor = '#0f172a'; // slate-900
    }
    
    // Convert to HSL for creating variants
    const [r, g, b] = hexToRgb(primaryColor);
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Create a light version (same hue, much higher lightness, 10% opacity)
    const lightColor = `hsla(${h * 360}, ${Math.min(100, s * 100)}%, ${Math.min(95, l * 100 + 30)}%, 0.1)`;
    
    // Create a dark version for shadows - darker and more saturated based on Figma values
    // Moving towards bottom right of HSL color graph (high saturation, low lightness)
    const darkColor = `hsla(${h * 360}, ${Math.min(100, s * 100 + 30)}%, ${Math.max(13, l * 100 - 40)}%, 0.25)`;
    
    return {
      primary: primaryColor,
      light: lightColor,
      dark: darkColor
    };
  } catch (error) {
    console.error('Error extracting colors from logo:', error);
    // Fallback to a default color palette
    return { ...defaultPalette };
  }
} 