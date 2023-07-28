import React from 'react';
import DefaultImage from './DefaultImage';

export default function ImageGrid({
  images,
  onClickImage,
  photoEdits,
  qualityTier,
  selectedImageIdx,
}) {
  return (
    <div className="photo-grid">
      {images.map((imgObj, idx) => {
        const listingEdit = photoEdits.find(
          (edit) => edit.listingId === imgObj.listingId
        );

        const hasQualiterTierChanged =
          !!listingEdit?.photoQualityTier &&
          listingEdit?.photoQualityTier !== qualityTier;

        return (
          <DefaultImage
            hasQualityTierChanged={hasQualiterTierChanged}
            imgObj={imgObj}
            idx={idx}
            isEdited={!!listingEdit}
            isSelected={selectedImageIdx === idx}
            key={imgObj.photoId}
            onClickImage={(photoIdx) => onClickImage(photoIdx)}
          />
        );
      })}
    </div>
  );
}
