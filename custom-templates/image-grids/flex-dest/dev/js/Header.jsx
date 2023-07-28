import React, { useCallback } from 'react';

export default function Header({
  currentAsset,
  hasPrev,
  hasNext,
  projectId,
  setSelectedListing,
  setSelectedImageIdx,
}) {
  const handleGoHome = useCallback(() => {
    window.location.href = 'https://app.labelbox.com/projects/' + projectId;
  }, [projectId]);

  const handleGoBack = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();

    if (hasPrev) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.previous);
    }
  }, [currentAsset]);

  const handleGoNext = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();

    if (hasNext) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.next);
    }
  }, [currentAsset]);

  return (
    <div className="header-container">
      <i className="material-icons home-icon" onClick={handleGoHome}>
        home
      </i>
      <i
        className={`material-icons back-icon ${
          hasPrev ? 'button-default' : ''
        }`}
        onClick={handleGoBack}
      >
        keyboard_arrow_left
      </i>
      <div className="header-title" id="externalid">
        Label this asset
      </div>
      <i
        className={`material-icons next-icon ${
          hasNext ? 'button-default' : ''
        }`}
        onClick={hasNext ? handleGoNext : undefined}
      >
        keyboard_arrow_right
      </i>
    </div>
  );
}
