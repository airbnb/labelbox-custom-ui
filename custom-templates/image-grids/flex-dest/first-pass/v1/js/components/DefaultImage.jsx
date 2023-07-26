import React from 'react';
import { getResizedImageUrl } from '../utils';

export default function DefaultImage({
  imgObj,
  idx,
  isSelected,
  onClickImage,
}) {
  let effectiveImgUrl = imgObj.imgSrc;
  if (imgObj.imageSrc && !imgObj.imageSrc.includes('/im/')) {
    const originalUrl = encodeURIComponent(imgObj.imgSrc);
    effectiveImgUrl = `${originalUrl.hostname}/im/${originalUrl.pathname}`;
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
