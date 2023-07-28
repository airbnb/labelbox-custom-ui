import React, { useCallback } from 'react';
import AdditionalPhotos from './AdditionalPhotos';

export default function RightPanel({
  selectedListing,
  newDefaultPhotoId,
  onClickImage,
}) {
  const scrollToTop = useCallback(
    (node) => {
      node?.scrollTo(0, 0);
    },
    [selectedListing]
  );

  if (!selectedListing) return null;

  const {
    listingTitle: title,
    listingDescription: description,
    listingLocation: location,
    listingNeighborhood: where,
    lat,
    lng,
  } = selectedListing;

  // https://www.google.com/maps/search/?api=1&query={lat}%2C{lng}
  // src="https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=14&amp;output=embed"
  // href="https://maps.google.com/maps?q=${lat},${lng};z=14&amp;output=embed"
  return (
    <div className="flex-column right-side-panel" ref={scrollToTop}>
      <h5>Listing Info</h5>
      <div className="listing-info-container">
        <div className="listing-info">
          <b>Title</b>: {title}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <b>Description</b>: {description}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <b>Location</b>: {location}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <b>Where You'll Be</b>: {where}
        </div>
      </div>

      <div className="listing-info-container">
        <div className="listing-info">
          <iframe
            width="450"
            height="450"
            frameBorder="0"
            scrolling="yes"
            marginHeight="0"
            marginWidth="0"
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
          ></iframe>
        </div>
      </div>
      <AdditionalPhotos
        selectedListing={selectedListing}
        onClickImage={onClickImage}
        newDefaultPhotoId={newDefaultPhotoId}
      />
    </div>
  );
}
