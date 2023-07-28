import React, { useCallback, useEffect } from 'react';
import ListingDetailsHeader from './ListingDetailsHeader';
import ImageGrid from './ImageGrid';
import formatEditDataForSubmission from './formatEditDataForSubmission';

export default function Content({
  assetData,
  gridImages,
  onClickImage,
  photoEdits,
  selectedListing,
  selectedImageIdx,
  setSelectedListing,
  setSelectedImageIdx,
  setPhotoEdits,
}) {
  useEffect(() => {
    document.querySelector('.content').scrollTo(0, 0);
  }, [assetData]);

  const handleSkip = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();
    setPhotoEdits([]);
    Labelbox.skip().then(() => {
      Labelbox.fetchNextAssetToLabel();
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setSelectedListing();
    setSelectedImageIdx();

    const formattedData = formatEditDataForSubmission(
      photoEdits,
      assetData?.attribute,
      assetData?.qualityTier,
      assetData?.gridImages
    );

    Labelbox.setLabelForAsset(formattedData, 'ANY').then(() => {
      setPhotoEdits([]);
      Labelbox.fetchNextAssetToLabel();
    });
  }, [photoEdits, assetData]);

  return (
    <div className="content">
      <ListingDetailsHeader
        attribute={assetData?.attribute}
        qualityTier={assetData?.qualityTier}
        selectedListing={selectedListing}
      />
      <ImageGrid
        images={gridImages}
        onClickImage={onClickImage}
        photoEdits={photoEdits}
        qualityTier={assetData?.qualityTier}
        selectedImageIdx={selectedImageIdx}
      />
      <div className="cta-container">
        <a className="cta skip-cta" onClick={handleSkip}>
          Skip
        </a>
        <a className="cta submit-cta" onClick={handleSubmit}>
          Submit
        </a>
      </div>
    </div>
  );
}
