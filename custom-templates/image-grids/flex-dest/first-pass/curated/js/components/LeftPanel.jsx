import React, { useState, useCallback, useEffect } from 'react';

export default function LeftPanel({
  listingId,
  photoId,
  labeledPhotoId,
  labeledPhotoQualityTier,
  onSubmitOrSkip,
  setShouldAllowImageSelection,
}) {
  const [photoQualityTier, setPhotoQualityTier] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [showSecondaryQuestions, setShowSecondaryQuestions] = useState(false);
  const [listingFitsCategory, setListingFitsCategory] = useState();

  const handlePhotoQualityChange = useCallback(
    (e) => {
      setPhotoQualityTier(e.target.value);
    },
    [setPhotoQualityTier]
  );

  const handleSkip = (e) => {
    setIsSkipping(true);
    onSubmitOrSkip();

    e.preventDefault();
    Labelbox.skip().then(() => {
      setPhotoQualityTier('');
      e.target.blur();
      Labelbox.fetchNextAssetToLabel();
      setIsSkipping(false);
    });
  };

  const handleSubmit = (e) => {
    if (photoQualityTier === '') {
      e.preventDefault();
      return;
    }

    setIsSaving(true);
    onSubmitOrSkip();

    e.preventDefault();
    const formattedData = {
      id_listing: listingId,
      photo_id: photoId,
      photo_quality: photoQualityTier,
    };

    Labelbox.setLabelForAsset(JSON.stringify(formattedData)).then(() => {
      setPhotoQualityTier('');
      if (!labeledPhotoId) {
        Labelbox.fetchNextAssetToLabel();
      }
      setIsSaving(false);
    });
  };

  const handleKeyupEvent = (e) => {
    if (!isSaving && !isSkipping) {
      const key = e.key.toLowerCase();
      switch (key) {
        case '1':
          e.preventDefault();
          setPhotoQualityTier('Most Inspiring');
          break;

        case '2':
          e.preventDefault();
          setPhotoQualityTier('High');
          break;

        case '3':
          e.preventDefault();
          setPhotoQualityTier('Acceptable');
          break;

        case '4':
          e.preventDefault();
          setPhotoQualityTier('Low Quality');
          break;

        case '5':
          e.preventDefault();
          setPhotoQualityTier('Unacceptable');
          break;

        case 's':
          e.preventDefault();
          handleSkip(e);
          break;

        case 'enter':
          e.preventDefault();
          handleSubmit(e);
          break;
        default:
          return;
      }
    }
  };

  const handlePrimaryAnswerChange = (e) => {
    const val = e.target.value;
    if (val === 'yes') {
      setShouldAllowImageSelection(true);
      setListingFitsCategory(true);
      setShowSecondaryQuestions(true);
    } 
    if (val === 'no') {
      setShouldAllowImageSelection(false);
      setListingFitsCategory(false);
      setShowSecondaryQuestions(false);
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', handleKeyupEvent);
    return () => document.removeEventListener('keyup', handleKeyupEvent);
  }, [listingId, photoId, photoQualityTier, handleKeyupEvent]);

  useEffect(() => {
    setPhotoQualityTier('');
  }, [listingId]);

  const SecondaryQuestions = (
    <>
      <label>
        Listing ID:
        <input type="text" name="listing-id" readOnly value={listingId} />
      </label>
      <label>
        Photo ID:
        <input type="text" name="photo-id" readOnly value={photoId} />
      </label>
      <label>
        <div className="label">Photo Quality:</div>
        <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
          <option disabled value="">
            -- Select a tier --
          </option>
          <option value="Most Inspiring">Most Inspiring</option>
          <option value="High">High</option>
          <option value="Acceptable">Acceptable</option>
          <option value="Low Quality">Low Quality</option>
          <option value="Unacceptable">Unacceptable</option>
        </select>
      </label>
    </>
  )

  const showSubmitBtnDisabled = () => {
    if (isSkipping || isSaving) return true;
    if (listingFitsCategory) {
      return !photoQualityTier || !photoId;
    }
    if (listingFitsCategory === false) {
      return false;
    }
  }

  return (
    <form>
        <p>Does the listing fit the category?</p>
        <label htmlFor="yes">
          <input 
            type="radio" 
            id="yes" 
            name="category" 
            value="yes" 
            onChange={handlePrimaryAnswerChange} 
            checked={listingFitsCategory}
          />
        Yes
        </label>
        <label htmlFor="no">
        <input 
          type="radio" 
          id="no" 
          name="category" 
          value="no" 
          onChange={handlePrimaryAnswerChange} 
          checked={listingFitsCategory === false} 
        />
        No
        </label>
        {showSecondaryQuestions && SecondaryQuestions}
      <div className="left-panel-ctas-wrapper">
        <button
          disabled={isSkipping || isSaving}
          className="cta skip-cta"
          onClick={handleSkip}
          type="button"
        >
          {isSkipping ? 'Skipping...' : 'Skip Listing'}
        </button>
        <button
          disabled={showSubmitBtnDisabled()}
          className="cta save-cta"
          type="submit"
          onClick={handleSubmit}
        >
          {isSaving ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {labeledPhotoId && (
        <div className="existing-label-container">
          <span>
            <span className="bold-text">Labeled Photo ID:</span>{' '}
            {labeledPhotoId}
          </span>
          <span>
            <span className="bold-text">Labeled Photo Quality:</span>{' '}
            {labeledPhotoQualityTier}
          </span>
        </div>
      )}
    </form>
  );
}
