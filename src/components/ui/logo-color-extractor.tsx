'use client';

import { useState, useEffect } from 'react';
import { extractLogoColors, ColorPalette, saveCarrierColorPalette, getCarrierColorPalette } from '@/lib/colorUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleCarriers, Carrier } from '@/lib/carriers';
import { Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export function LogoColorExtractor() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorPalette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get all carriers for dropdown
  useEffect(() => {
    const allCarriers = [
      ...sampleCarriers.primary,
      ...sampleCarriers.secondary,
      ...sampleCarriers.tertiary
    ];
    setCarriers(allCarriers);
  }, []);
  
  const handleCarrierSelect = (carrierId: string) => {
    setSelectedCarrier(carrierId);
    setSaveSuccess(false);
    
    const carrier = carriers.find(c => c.id === carrierId);
    
    // Check if we already have colors for this carrier
    const existingPalette = getCarrierColorPalette(carrierId);
    if (existingPalette) {
      setColors(existingPalette);
    } else {
      setColors(null);
    }
    
    // If carrier has a logo, set it as the image URL
    if (carrier?.hasLogo && carrier.logo) {
      // Make sure we use the full URL if it's a relative path
      const fullLogoUrl = carrier.logo.startsWith('http') 
        ? carrier.logo 
        : `${window.location.origin}${carrier.logo}`;
      
      setImageUrl(fullLogoUrl);
      setUploadedImage(fullLogoUrl);
    } else {
      setImageUrl('');
      setUploadedImage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImage(dataUrl);
        setImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setUploadedImage(null);
  };

  const extractColors = async () => {
    if (!imageUrl) {
      setError('Please provide an image URL or upload an image');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const palette = await extractLogoColors(imageUrl);
      setColors(palette);
      
      // If a carrier is selected, save the palette
      if (selectedCarrier) {
        saveCarrierColorPalette(selectedCarrier, palette);
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error('Error extracting colors:', err);
      
      // Create a fallback palette with a default color
      const fallbackPalette: ColorPalette = {
        primary: '#0f172a', // slate-900
        light: 'hsla(222, 47%, 11%, 0.1)',
        dark: 'hsl(222, 47%, 5%)'
      };
      
      // Use the fallback palette but show an error message
      setColors(fallbackPalette);
      setError('Failed to extract colors: ' + (err instanceof Error ? err.message : String(err)) + 
               ' Using default colors instead.');
      
      // Still save the fallback palette if a carrier is selected
      if (selectedCarrier) {
        saveCarrierColorPalette(selectedCarrier, fallbackPalette);
        setSaveSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Logo Color Extractor</h3>
        
        {/* Carrier Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="carrier-select">
            Select a Carrier
          </label>
          <Select value={selectedCarrier} onValueChange={handleCarrierSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a carrier" />
            </SelectTrigger>
            <SelectContent>
              {carriers.map((carrier) => (
                <SelectItem key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium mb-2">Upload Custom Logo</h4>
          <div className="space-y-2">
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">or</p>
            <Input 
              type="url" 
              placeholder="Enter image URL" 
              value={imageUrl} 
              onChange={handleUrlChange}
            />
          </div>
        </div>

        {uploadedImage && (
          <div className="flex justify-center">
            <Image 
              src={uploadedImage} 
              alt="Logo" 
              width={160}
              height={160}
              className="max-h-40 object-contain border rounded p-2"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        )}

        <Button 
          onClick={extractColors} 
          disabled={isLoading || !imageUrl}
          className="w-full"
        >
          {isLoading ? 'Extracting...' : 'Extract Colors'}
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        )}
        
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check size={16} />
            <p>Colors saved successfully</p>
          </div>
        )}
      </div>

      {colors && (
        <div className="space-y-4">
          <h4 className="font-medium">Extracted Colors</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div 
                className="h-16 rounded-md border" 
                style={{ backgroundColor: colors.primary }}
              />
              <p className="text-xs text-center">Primary: {colors.primary}</p>
            </div>
            <div className="space-y-2">
              <div 
                className="h-16 rounded-md border" 
                style={{ backgroundColor: colors.light }}
              />
              <p className="text-xs text-center">Light: {colors.light}</p>
            </div>
            <div className="space-y-2">
              <div 
                className="h-16 rounded-md border" 
                style={{ backgroundColor: colors.dark }}
              />
              <p className="text-xs text-center">Shadow: {colors.dark}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Insurance Card Example</h4>
            <div className="flex justify-center">
              <div 
                className="w-[240px] rounded-2xl overflow-hidden"
                style={{ 
                  backgroundColor: "white",
                  backgroundImage: `linear-gradient(to bottom, ${colors.light}, ${colors.light})`,
                  border: '1px solid rgba(0, 0, 0, 0.09)',
                  boxShadow: `0px -2px 2px 0px rgba(0, 0, 0, 0.12) inset, 
                              0px 2px 2px 0px rgba(255, 255, 255, 0.7) inset, 
                              0px 25px 50px -12px ${colors.dark}`
                }}
              >
                {/* Carrier Header Section */}
                <div className="h-[64px] flex justify-center items-center border-b border-black/5 relative">
                  <div className="flex items-center justify-center">
                    {selectedCarrier && carriers.find(c => c.id === selectedCarrier)?.logo ? (
                      <Image 
                        src={carriers.find(c => c.id === selectedCarrier)?.logo || ''} 
                        alt="Carrier Logo" 
                        width={32}
                        height={32}
                        className="h-8 object-contain"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    ) : (
                      <div className="text-xl font-bold text-center" style={{ color: colors.primary }}>
                        {selectedCarrier ? 
                          carriers.find(c => c.id === selectedCarrier)?.name || "CARRIER" : 
                          "CARRIER"}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Annual Premium */}
                <div className="h-[48px] flex items-center justify-center border-b border-black/5">
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-foreground font-sans text-sm font-semibold leading-5">$2,426</span>
                    <span className="text-muted-foreground font-sans text-xs font-normal leading-none">/ yr</span>
                  </div>
                </div>
                
                {/* Coverage Details - no borders between them */}
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$267,389</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$26,738</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$199,231</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">-</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$300,000</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$1,000</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$1,500</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">1%</span>
                </div>
                
                <div className="h-[56px] flex items-center justify-center">
                  <span className="font-normal">$1,500</span>
                </div>
                
                {/* Footer - with border above */}
                <div className="h-[32px] flex items-center justify-center text-gray-500 border-t border-black/5">
                  <span>See Endorsements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 