'use client';

import { useCarrierColors } from '@/hooks/useCarrierColors';
import { Carrier } from '@/lib/carriers';
import Image from 'next/image';

interface CarrierBadgeProps {
  carrier: Carrier;
  size?: 'sm' | 'md' | 'lg';
}

export function CarrierBadge({ carrier, size = 'md' }: CarrierBadgeProps) {
  const { primaryColor, lightColor } = useCarrierColors(carrier.id);
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };
  
  const logoSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  return (
    <div 
      className={`flex items-center gap-2 px-3 rounded-md ${sizeClasses[size]}`}
      style={carrier.hasLogo && primaryColor ? {
        background: lightColor || 'transparent'
      } : {}}
    >
      {carrier.hasLogo && carrier.logo ? (
        <div 
          className="relative rounded-sm overflow-hidden"
          style={primaryColor ? { 
            boxShadow: `0 2px 4px -1px ${primaryColor ? primaryColor : 'rgba(0,0,0,0.1)'}` 
          } : {}}
        >
          <Image 
            src={carrier.logo} 
            alt={carrier.name} 
            width={logoSizes[size]} 
            height={logoSizes[size]} 
            className="object-contain"
          />
        </div>
      ) : (
        <div 
          className={`flex items-center justify-center rounded-sm bg-gray-100 ${
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
          }`}
        >
          <span className="text-xs font-semibold text-gray-500">
            {carrier.name.charAt(0)}
          </span>
        </div>
      )}
      <span 
        className="font-medium"
        style={primaryColor ? { color: primaryColor } : {}}
      >
        {carrier.name}
      </span>
    </div>
  );
} 