export default function getUpdatedDefaultPhotoInfo(photoEdits, listing) {
  return photoEdits.find((edit) => edit.listingId === listing.listingId);
}
