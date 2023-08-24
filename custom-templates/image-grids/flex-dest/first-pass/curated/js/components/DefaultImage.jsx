import React from 'react';
import { getEffectiveImageUrl } from '../utils';

export default function DefaultImage({
  imgObj,
  idx,
  isSelected,
  onClickImage,
}) {
  const imageUrl = getEffectiveImageUrl(imgObj.imageSrc);

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
