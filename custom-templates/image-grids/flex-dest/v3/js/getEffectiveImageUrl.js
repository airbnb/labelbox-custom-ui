export default function getEffectiveImageUrl(photoLink) {
  let effectiveImgUrl = photoLink;
  // if (!photoLink.includes('/im/')) {
  //   const originalUrl = new URL(photoLink);
  //   effectiveImgUrl = `${originalUrl.origin}/im${originalUrl.pathname}${originalUrl.search}`;
  // }
  return effectiveImgUrl?.includes('?') ? `${effectiveImgUrl}` : `${effectiveImgUrl}?im_w=480`;
}
