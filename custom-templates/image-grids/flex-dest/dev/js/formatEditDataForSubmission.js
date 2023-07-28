function getUpdateReason(
  edit,
  originalDefaultPhotoId,
  originalPhotoQualityTier
) {
  const { defaultPhotoId, photoQualityTier } = edit;

  const defaultPhotoIdChanged =
    !!defaultPhotoId && defaultPhotoId !== originalDefaultPhotoId;

  const photoQualityTierChanged =
    !!photoQualityTier && photoQualityTier !== originalPhotoQualityTier;

  if (photoQualityTierChanged && photoQualityTier === 'Remove') {
    return 'remove category';
  }

  if (defaultPhotoIdChanged && photoQualityTierChanged) {
    return 'update photo + quality';
  }

  if (photoQualityTierChanged) {
    return 'update quality';
  }

  if (defaultPhotoIdChanged) {
    return 'update photo';
  }

  return '';
}

export default function formatEditDataForSubmission(
  photoEdits,
  attribute,
  originalPhotoQualityTier,
  gridImages
) {
  const formatted = photoEdits.map((edit) => {
    const { listingId, defaultPhotoId, photoQualityTier } = edit;
    const listingInfo = gridImages.find(
      (listing) => listing.listingId === listingId
    );
    const originalDefaultPhotoId = listingInfo?.photoId;

    const data = {
      id_listing: listingId,
      listing_category: attribute,
      photo_id: defaultPhotoId,
      photo_quality: photoQualityTier,
      update_reason: getUpdateReason(
        edit,
        originalDefaultPhotoId,
        originalPhotoQualityTier
      ),
    };
    return data;
  });

  return JSON.stringify(formatted);
}
