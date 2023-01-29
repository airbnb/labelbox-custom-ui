export default function getResizedImageUrl(photoLink) {
  return photoLink?.includes('?') ? `${photoLink}` : `${photoLink}?img_w=480`;
}
