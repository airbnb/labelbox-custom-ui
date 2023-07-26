import React from 'react';
import { getResizedImageUrl } from '../utils';

export default function DefaultImage({
  imgObj,
  idx,
  isSelected,
  onClickImage,
}) {
  let effectiveImgUrl = imgObj.imageSrc;
  if (imgObj.imageSrc && !imgObj.imageSrc.includes('/im/')) {
    const originalUrl = new URL(imgObj.imageSrc);
    effectiveImgUrl = `${originalUrl.origin}/im${originalUrl.pathname}${originalUrl.search}`;
  }
  const imageUrl = getResizedImageUrl(effectiveImgUrl);

  return (
    <div
      className="image-container"
      onClick={() => onClickImage(idx)}
      id={`image-container-${imgObj.photoId}`}
    >
      <img
        src={imageUrl}
        className={`default-image ${isSelected ? 'image-selected' : ''}`}
      />
      <span>{imgObj.caption}</span>
    </div>
  );
}
