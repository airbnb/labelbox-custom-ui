import React from 'react';
import { getEffectiveImageUrl } from '../utils';

export default function DefaultImage({
  imgObj,
  idx,
  isSelected,
  onClickImage,
  shouldAllowImageSelection,
}) {
  const imageUrl = getEffectiveImageUrl(imgObj.imageSrc);

  return (
    <div
      className={`image-container ${shouldAllowImageSelection ? 'image-container-disabled' : ''}`}
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
