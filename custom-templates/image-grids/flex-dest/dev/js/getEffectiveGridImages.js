function overrideGridImages(changes, gridImages) {
  const listingIdsWithUpdatedDefaultPhoto = changes.map(
    (e) => !!e.defaultPhotoId && e.listingId
  );
  const updatedGridImages = gridImages.map((imgObj) => {
    if (listingIdsWithUpdatedDefaultPhoto.includes(imgObj.listingId)) {
      const updatedPhotoId = changes.find(
        (edit) => edit.listingId === imgObj.listingId
      ).defaultPhotoId;
      const updatedPhotoLink = imgObj.listingImages.find(
        (photo) => photo.photoId === updatedPhotoId
      )?.photoLink;

      return Object.assign({}, imgObj, {
        photoLink: updatedPhotoLink,
      });
    }
    return imgObj;
  });
  return updatedGridImages;
}

export default function getEffectiveGridImages(
  assetData,
  photoEdits,
  selectedImageIdx,
  newDefaultPhotoId
) {
  if (!assetData) return [];
  let gridImagesCopy = [...assetData.gridImages];

  if (photoEdits.length) {
    gridImagesCopy = overrideGridImages(photoEdits, gridImagesCopy);
  }

  if (typeof selectedImageIdx === 'number' && !!newDefaultPhotoId) {
    return [
      ...gridImagesCopy.slice(0, selectedImageIdx),
      Object.assign({}, gridImagesCopy[selectedImageIdx], {
        photoLink: gridImagesCopy[selectedImageIdx].listingImages.find(
          (photo) => photo.photoId === newDefaultPhotoId
        )?.photoLink,
      }),
      ...gridImagesCopy.slice(selectedImageIdx + 1),
    ];
  }

  return gridImagesCopy;
}
