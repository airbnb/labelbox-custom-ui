import React from 'react';
import getEffectiveImageUrl from './getEffectiveImageUrl';

export default function AdditionalImage({ isSelected, listingImage, onClick }) {
  const imageUrl = getEffectiveImageUrl(listingImage.photoLink);

  return (
    <div className="additional-image-wrapper">
      <div>Photo ID: {listingImage.photoId}</div>
      <button
        className={`additional-image ${isSelected ? 'image-selected' : ''}`}
        onClick={() => onClick(listingImage.photoId)}
      >
        <img src={imageUrl} width="100%" />
      </button>
    </div>
  );
}
