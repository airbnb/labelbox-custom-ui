// photoEdits data structure
// [{
//   listingId: 123,
//   defaultPhotoId: 345,
//   photoQualityTier: 'High',
// }]

export default function convertLabelToPhotoEditFormat(labels) {
  if (!Array.isArray(labels)) return [];

  return labels.map((label) => {
    const { id_listing, photo_id, photo_quality } = label;

    return {
      listingId: id_listing,
      ...(photo_id ? { defaultPhotoId: photo_id } : undefined),
      ...(photo_quality ? { photoQualityTier: photo_quality } : undefined),
    };
  });
}
