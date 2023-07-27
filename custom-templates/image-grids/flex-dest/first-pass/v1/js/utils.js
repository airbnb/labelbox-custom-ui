export function get(url) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open('GET', url, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

/**
 * Input is a string containing an HTML document. Caption text can either be non-existent or span multiple lines
 *
 *   Example (\n replaced with actual newlines for readability):
 *     "<!DOCTYPE html>
 *     <html>
 *       <a href="https://www.airbnb.com/rooms/750469869902849247">Listing PDP</a>
 *       <br><a href="https://www.google.com/maps/search/?api=1&query=50.97%2C-3.58">Google Map</a>
 *       <br><br><br><br>1518815987
 *       <br><img src="https://a0.muscache.com/pictures/45639af2-64c0-43fc-a64f-83bbb71dccc4.jpg?im_w=480" style="width:450px;" loading="lazy" alt="Image failed to load.">
 *       <br>The Hoot has gorgeous lake views - guests can explore the grounds of the farm; sit by the lake, read a book, have a picnic or drink in the surroundings!
 *
 *       <br><br><br><br>1518815988
 *       <br><img src="https://a0.muscache.com/pictures/3d747c6d-4af6-46dc-9738-675ce8ae76d6.jpg?im_w=480" style="width:450px;" loading="lazy" alt="Image failed to load.">
 *       <br>Freshly painted bedroom - prefect for lie ins in this secluded location.
 *
 *     </html>"
 *
 *   Result:
 *     [
 *       {
 *         "photoId": "1518815987",
 *         "imageSrc": "https://a0.muscache.com/pictures/45639af2-64c0-43fc-a64f-83bbb71dccc4.jpg?im_w=480",
 *         "caption": "The Hoot has gorgeous lake views - guests can explore the grounds of the farm; sit by the lake, read a book, have a picnic or drink in the surroundings!"
 *       },
 *       {
 *         "photoId": "1518815988",
 *         "imageSrc": "https://a0.muscache.com/pictures/3d747c6d-4af6-46dc-9738-675ce8ae76d6.jpg?im_w=480",
 *         "caption": "Freshly painted bedroom - prefect for lie ins in this secluded location."
 *       },
 *     ]
 */
export function parseHtmlInput(input) {
  // first, split the string by lines
  const htmlSplit = input.split('\n');
  return (
    htmlSplit
      // remove <br> tags
      .map((str) => str.replace(/<br>/g, ' '))

      // remove whitespace at the ends of the lines
      .map((str) => str.trim())

      // remove first two html tags and listing/map elements (first 4 elements and last element)
      .slice(4, htmlSplit.length - 1)

      // items are grouped in the array by empty strings, with a line each for the photo id and img tag,
      // and 0+ lines for the caption. here, actually turn the big array into an array of chunks accordingly.
      .reduce(
        (groups, item) => {
          if (item === '') {
            groups.push([]);
            return groups;
          }

          const currentGroup = groups[groups.length - 1];
          groups[groups.length - 1] = [...currentGroup, item];

          return groups;
        },
        [[]]
      )

      // remove any empty arrays (sometimes there are multiple, empty lines in a row)
      .filter((group) => group.length > 0)

      // finally, turn the array chunks into objects. while doing this, strip out the src url from the image tag
      // and join the caption strings together
      .map((group) => {
        const imgContainer = document.createElement('div');
        imgContainer.innerHTML = group[1];
        const img = imgContainer.querySelector('img');
        const src = img.src;
        return {
          photoId: group[0],
          imageSrc: src,
          caption: group.slice(2).join(' '),
        };
      })
  );
}

export function parseHtmlAssetData(assetDataStr) {
    // first, split the string by lines
    return assetDataStr.split('\n')
    // filter empty strings
    .filter(i => i.length)
    // return first 7 metadata
    .slice(0, 7);
}

export function parseHtmlLinks(inputStr) {
    // first, split the string by lines
    const htmlSplit = inputStr.split('\n');
    // remove <br> tags
   const linkStr = htmlSplit.map((str) => str.replace(/<br>/g, ' '))

    // remove whitespace at the ends of the lines
    .map((str) => str.trim())

    // retrieve pdp + google map links
    .slice(2, 4)
  
    return linkStr.map(linkStr => {
      const linkNode = document.createElement('span');
      linkNode.innerHTML = linkStr;
      linkNode.firstChild.target = "_blank";
      return linkNode;
    })

}

export function getEffectiveImageUrl(photoLink) {
  let effectiveImgUrl = photoLink;
  if (!photoLink.includes('/im/')) {
    const originalUrl = new URL(photoLink);
    effectiveImgUrl = `${originalUrl.origin}/im${originalUrl.pathname}${originalUrl.search}`;
  }
  return effectiveImgUrl?.includes('?') ? `${effectiveImgUrl}` : `${effectiveImgUrl}?im_w=480`;
}
