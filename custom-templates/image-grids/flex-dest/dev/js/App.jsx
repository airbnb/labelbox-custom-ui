import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import Content from './Content';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { get } from './utils';
import getEffectiveGridImages from './getEffectiveGridImages';
import convertLabelToPhotoEditFormat from './convertLabelToPhotoEditFormat';

const EMPTY_ARR = [];

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get('project');
  const [currentAsset, setCurrentAsset] = useState();
  const [assetData, setAssetData] = useState();
  const [selectedListing, setSelectedListing] = useState();
  const [selectedImageIdx, setSelectedImageIdx] = useState();
  const [newDefaultPhotoId, setNewDefaultPhotoId] = useState('');
  const assetNext = useRef();
  const assetPrev = useRef();

  // photoEdits data structure
  // [{
  //   listingId: 123,
  //   defaultPhotoId: 345,
  //   photoQualityTier: 'High',
  // }]
  const [photoEdits, setPhotoEdits] = useState(EMPTY_ARR);

  const effectiveGridImages = getEffectiveGridImages(
    assetData,
    photoEdits,
    selectedImageIdx,
    newDefaultPhotoId
  );

  const handleAssetChange = useCallback(
    (asset) => {
      if (asset) {
        // subscription to Labelbox makes increasing network calls as label history gets longer
        // to reduce jank from network calls, check the refs to ensure call is only made when relevant
        // data has changed
        if (
          currentAsset?.id !== asset.id &&
          currentAsset?.data !== asset.data &&
          (assetNext.current !== asset.next ||
            assetPrev.current !== asset.previous)
        ) {
          assetNext.current = asset.next;
          assetPrev.current = asset.previous;
          const assetDataStr = get(asset.data).replace(/NaN/g, 'null');
          const parsedAssetData = JSON.parse(assetDataStr);

          setCurrentAsset(asset);
          setAssetData(parsedAssetData);
        }

        if (asset.label) {
          if (asset.label === 'Skip') return;
          let labels = [];
          try {
            labels = JSON.parse(asset.label);
          } catch (e) {
            console.error(e);
          }
          const formattedLabels = convertLabelToPhotoEditFormat(labels);

          // store labels in photoEdits mutable data structure
          setPhotoEdits(formattedLabels);
        }
      }
    },
    [currentAsset, setCurrentAsset, setAssetData]
  );

  const handleClickDefaultImage = useCallback(
    (imageIdx) => {
      setSelectedImageIdx(imageIdx);
      setSelectedListing(assetData.gridImages[imageIdx]);
      setNewDefaultPhotoId('');
    },
    [assetData, setSelectedImageIdx, setSelectedListing, setNewDefaultPhotoId]
  );

  useEffect(() => {
    Labelbox.currentAsset().subscribe((asset) => {
      handleAssetChange(asset);
    });
  }, [handleAssetChange]);

  return (
    <>
      <div className="flex-column left-side-panel">
        {selectedListing ? (
          <LeftPanel
            assetData={assetData}
            newDefaultPhotoId={newDefaultPhotoId}
            photoEdits={photoEdits}
            selectedListing={selectedListing}
            setNewDefaultPhotoId={setNewDefaultPhotoId}
            setPhotoEdits={setPhotoEdits}
          />
        ) : null}
      </div>
      <div className="flex-grow flex-column">
        <Header
          currentAsset={currentAsset}
          hasNext={!!currentAsset?.next}
          hasPrev={!!currentAsset?.previous}
          projectId={projectId}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
        />
        <Content
          assetData={assetData}
          gridImages={effectiveGridImages}
          onClickImage={handleClickDefaultImage}
          photoEdits={photoEdits}
          selectedListing={selectedListing}
          selectedImageIdx={selectedImageIdx}
          setSelectedListing={setSelectedListing}
          setSelectedImageIdx={setSelectedImageIdx}
          setPhotoEdits={setPhotoEdits}
        />
      </div>
      <RightPanel
        selectedListing={selectedListing}
        onClickImage={setNewDefaultPhotoId}
        newDefaultPhotoId={newDefaultPhotoId}
      />
    </>
  );
}
