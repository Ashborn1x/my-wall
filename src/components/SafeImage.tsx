import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackLabel || 'Image'}
        className={`bg-[#eceff5] border border-[#d8dfea] flex items-center justify-center text-[#3b5998] font-bold text-[10px] select-none overflow-hidden ${className}`}
      >
        <span className="px-1 text-center truncate">
          {fallbackLabel || (alt ? alt.slice(0, 2).toUpperCase() : 'IMG')}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
