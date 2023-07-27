import React, { useState, useEffect, useCallback, useRef } from 'react';
import { get, parseHtmlInput, parseHtmlAssetData, parseHtmlLinks } from './utils';
import ImageGrid from './components/ImageGrid';
import LeftPanel from './components/LeftPanel';
import Header from './components/Header';

const EMPTY_ARR = [];

export default function App() {
  const projectId = new URL(window.location.href).searchParams.get('project');
  const [listingId, setListingId] = useState();
  const [currentAsset, setCurrentAsset] = useState();
  const [imageObjs, setImageObjs] = useState([]);
  const [listingInfo, setListingInfo] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState();
  const [selectedPhotoId, setSelectedPhotoId] = useState();
  const [labeledPhotoId, setLabeledPhotoId] = useState();
  const [labeledPhotoQualityTier, setLabeledPhotoQualityTier] = useState();
  const assetNext = useRef();
  const assetPrev = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldAllowImageSelection, setShouldAllowImageSelection] =
    useState(true);

  const resetState = () => {
    setLabeledPhotoId();
    setLabeledPhotoQualityTier();
  };

  useEffect(() => {
    document.querySelector('.content').scrollTo(0, 0);
    if (labeledPhotoId) {
      setSelectedImageIdx(
        imageObjs.findIndex((image) => labeledPhotoId === image.photoId)
      );
    }
  }, [imageObjs, labeledPhotoId, setSelectedImageIdx]);

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
          setIsLoading(true);
          resetState();

          assetNext.current = asset.next;
          assetPrev.current = asset.previous;
          const assetDataStr = get(asset.data);
          const parsedAssetData = parseHtmlAssetData(assetDataStr);
          const assetImagesStr = get(asset.metadata[0].metaValue);
          const pdpAndGMaplinks = parseHtmlLinks(assetImagesStr);
          const parsedAssetImages = parseHtmlInput(assetImagesStr);

          // Full match will be first element, listing ID will be second
          setListingId(
            assetImagesStr.match(
              /href="https:\/\/www.airbnb.com\/rooms\/(.*?)"/
            )[1]
          );

          // default to first image
          setSelectedImageIdx(0);
          setSelectedPhotoId(parsedAssetImages[0].photoId);
          setLinks(pdpAndGMapLinks);
          setCurrentAsset(asset);
          setImageObjs(parsedAssetImages);
          setListingInfo(parsedAssetData);

          setIsLoading(false);
          setShouldAllowImageSelection(true);
        }

        if (asset.label) {
          if (asset.label === 'Skip') {
            setLabeledPhotoId('Skipped');
            setLabeledPhotoQualityTier('Skipped');
            setSelectedImageIdx(undefined);
            return;
          }
          let label = {};
          try {
            label = JSON.parse(asset.label);
          } catch (e) {
            console.error(e);
          }

          setSelectedPhotoId(label.photo_id);
          setLabeledPhotoId(label.photo_id);
          setLabeledPhotoQualityTier(label.photo_quality);
        }
      }
    },
    [currentAsset]
  );

  const handleClickImage = useCallback(
    (imageIdx) => {
      if (shouldAllowImageSelection) {
        setSelectedImageIdx(imageIdx);
        setSelectedPhotoId(imageObjs[imageIdx].photoId);
      }
    },
    [
      imageObjs,
      setSelectedImageIdx,
      setSelectedPhotoId,
      shouldAllowImageSelection,
    ]
  );

  const onSubmitOrSkip = () => {
    setShouldAllowImageSelection(false);
  };

  useEffect(() => {
    Labelbox.currentAsset().subscribe((asset) => {
      handleAssetChange(asset);
    });
  }, [handleAssetChange]);

  return (
    <>
      <div className="flex-column left-side-panel">
        {
          <LeftPanel
            listingId={listingId}
            photoId={selectedPhotoId}
            labeledPhotoId={labeledPhotoId}
            labeledPhotoQualityTier={labeledPhotoQualityTier}
            onSubmitOrSkip={onSubmitOrSkip}
          />
        }
      </div>
      <div className="flex-grow flex-column">
        <Header
          currentAsset={currentAsset}
          listingInfo={listingInfo}
          pdpAndGMaplinks={links}
          hasNext={!!currentAsset?.next}
          hasPrev={!!currentAsset?.previous}
          projectId={projectId}
          hasLabel={!!labeledPhotoId}
        />
        <div className="content">
          {!isLoading && (
            <ImageGrid
              images={imageObjs}
              onClickImage={handleClickImage}
              selectedImageIdx={selectedImageIdx}
            />
          )}
          {isLoading && <p>Loading...</p>}
        </div>
      </div>
    </>
  );
}
