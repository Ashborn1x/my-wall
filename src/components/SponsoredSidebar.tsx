import React from 'react';
import { SponsoredAdItem } from '../types/wall';
import { SafeImage } from './SafeImage';

interface SponsoredSidebarProps {
  ads: SponsoredAdItem[];
}

export const SponsoredSidebar: React.FC<SponsoredSidebarProps> = ({ ads }) => {
  return (
    <aside
      className="w-full lg:w-[190px] flex-shrink-0 text-xs border-t lg:border-t-0 lg:border-l border-[#eeeeee] pt-4 lg:pt-0 lg:pl-3"
      data-purpose="retro-advertisements"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-500 uppercase text-[10px] tracking-wide">
          Sponsored
        </span>
        <a
          href="#create-ad"
          onClick={(e) => e.preventDefault()}
          className="text-[10px] text-[#3b5998] hover:underline"
        >
          Create an Ad
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-0">
        {ads.map((ad, idx) => (
          <div
            key={ad.id}
            className={`${
              idx < ads.length - 1 ? 'lg:mb-4 lg:pb-3 lg:border-b lg:border-[#ececec]' : 'lg:mb-4 lg:pb-3'
            }`}
          >
            <a
              href={`#ad-${ad.id}`}
              onClick={(e) => e.preventDefault()}
              className="font-bold text-[#3b5998] hover:underline block text-xs mb-1"
            >
              {ad.title}
            </a>
            <a
              href={`#ad-${ad.id}`}
              onClick={(e) => e.preventDefault()}
              className="block mb-1"
            >
              <SafeImage
                src={ad.image}
                alt={ad.title}
                className="w-full h-auto border border-[#cccccc]"
              />
            </a>
            <p className="text-[11px] text-gray-600 leading-tight">
              {ad.description}
            </p>
            {ad.ctaText && (
              <a
                href={`#ad-${ad.id}`}
                onClick={(e) => e.preventDefault()}
                className="text-[10px] text-[#3b5998] hover:underline block mt-0.5"
              >
                {ad.ctaText}
              </a>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
