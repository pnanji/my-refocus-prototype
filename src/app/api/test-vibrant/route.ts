import { NextResponse } from 'next/server';
import { extractLogoColors } from '@/lib/colorUtils';

export async function GET() {
  try {
    // Test URL - this would be replaced with a real logo URL in production
    const testImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png';
    
    const colors = await extractLogoColors(testImageUrl);
    
    return NextResponse.json({ success: true, colors });
  } catch (error) {
    console.error('Error in test-vibrant route:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 