import React, { useEffect, useState } from 'react';
import getUpdatedDefaultPhotoInfo from './getUpdatedDefaultPhotoInfo';

export default function LeftPanel({
  assetData,
  newDefaultPhotoId,
  photoEdits,
  selectedListing,
  setNewDefaultPhotoId,
  setPhotoEdits,
}) {
  const originalPhotoQualityTier = assetData.qualityTier;
  const originalDefaultPhotoId = selectedListing.photoId;

  const updatedDefaultPhotoInfo = getUpdatedDefaultPhotoInfo(
    photoEdits,
    selectedListing
  );
  const updatedDefaultPhotoId = updatedDefaultPhotoInfo?.defaultPhotoId;
  const updatedDefaultPhotoQualityTier =
    updatedDefaultPhotoInfo?.photoQualityTier;

  const [photoQualityTier, setPhotoQualityTier] = useState(
    updatedDefaultPhotoQualityTier || originalPhotoQualityTier
  );

  useEffect(() => {
    setPhotoQualityTier(
      updatedDefaultPhotoQualityTier || originalPhotoQualityTier
    );
  }, [selectedListing]);

  function handlePhotoQualityChange(e) {
    setPhotoQualityTier(e.target.value);
  }

  function clearUnsavedChanges() {
    setNewDefaultPhotoId('');
    setPhotoQualityTier(assetData.qualityTier);
  }

  function handleResetChanges() {
    clearUnsavedChanges();

    // delete saved change entry from photoEdits
    setPhotoEdits((prevEdits) => {
      const prevChangeIndex = prevEdits.findIndex(
        (edit) => edit.listingId === selectedListing.listingId
      );

      if (prevChangeIndex !== -1) {
        return [
          ...prevEdits.slice(0, prevChangeIndex),
          ...prevEdits.slice(prevChangeIndex + 1),
        ];
      } else {
        return prevEdits;
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // photo id and quality tier both same as original data
    if (
      (!newDefaultPhotoId || newDefaultPhotoId === originalDefaultPhotoId) &&
      photoQualityTier === originalPhotoQualityTier
    ) {
      return setPhotoEdits((prevEdits) => {
        const prevChangeIndex = prevEdits.findIndex(
          (edit) => edit.listingId === selectedListing.listingId
        );

        if (prevChangeIndex !== -1) {
          // delete previous edit
          return [
            ...prevEdits.slice(0, prevChangeIndex),
            ...prevEdits.slice(prevChangeIndex + 1),
          ];
        }
        return prevEdits;
      });
    }

    // change in photo id
    if (!!newDefaultPhotoId) {
      if (newDefaultPhotoId !== originalDefaultPhotoId) {
        setPhotoEdits((prevEdits) => {
          const prevChangeIndex = prevEdits.findIndex(
            (edit) => edit.listingId === selectedListing.listingId
          );

          if (prevChangeIndex !== -1) {
            // override previous edit
            return [
              ...prevEdits.slice(0, prevChangeIndex),
              Object.assign({}, prevEdits[prevChangeIndex], {
                defaultPhotoId: newDefaultPhotoId,
              }),
              ...prevEdits.slice(prevChangeIndex + 1),
            ];
          } else {
            // add to photoEdits
            return [
              ...prevEdits,
              {
                listingId: selectedListing.listingId,
                defaultPhotoId: newDefaultPhotoId,
                photoQualityTier,
              },
            ];
          }
        });
      } else {
        setPhotoEdits((prevEdits) => {
          const prevChangeIndex = prevEdits.findIndex(
            (edit) => edit.listingId === selectedListing.listingId
          );

          if (prevChangeIndex !== -1) {
            const copy = Object.assign({}, prevEdits[prevChangeIndex], {
              defaultPhotoId: newDefaultPhotoId,
            });

            return [
              ...prevEdits.slice(0, prevChangeIndex),
              copy,
              ...prevEdits.slice(prevChangeIndex + 1),
            ];
          }
          return prevEdits;
        });
      }
    }

    // change photo quality tier
    if (photoQualityTier !== originalPhotoQualityTier) {
      setPhotoEdits((prevEdits) => {
        const prevChangeIndex = prevEdits.findIndex(
          (edit) => edit.listingId === selectedListing.listingId
        );

        if (prevChangeIndex !== -1) {
          return [
            ...prevEdits.slice(0, prevChangeIndex),
            Object.assign({}, prevEdits[prevChangeIndex], {
              photoQualityTier,
            }),
            ...prevEdits.slice(prevChangeIndex + 1),
          ];
        } else {
          return [
            ...prevEdits,
            {
              listingId: selectedListing.listingId,
              defaultPhotoId:
                originalDefaultPhotoId ||
                updatedDefaultPhotoId ||
                originalDefaultPhotoId,
              photoQualityTier,
            },
          ];
        }
      });
    } else {
      // if photo edit exists for the listing, update the photoQualityTier
      setPhotoEdits((prevEdits) => {
        const prevChangeIndex = prevEdits.findIndex(
          (edit) => edit.listingId === selectedListing.listingId
        );

        if (prevChangeIndex !== -1) {
          return [
            ...prevEdits.slice(0, prevChangeIndex),
            Object.assign({}, prevEdits[prevChangeIndex], {
              photoQualityTier,
            }),
            ...prevEdits.slice(prevChangeIndex + 1),
          ];
        }
        return prevEdits;
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Photo id:
        <input
          type="text"
          name="photo-id"
          readOnly
          value={
            newDefaultPhotoId || updatedDefaultPhotoId || originalDefaultPhotoId
          }
        />
      </label>
      <label>
        <div className="label">Photo quality:</div>
        <select value={photoQualityTier} onChange={handlePhotoQualityChange}>
          <option value="Most Inspiring">Most Inspiring</option>
          <option value="High">High</option>
          <option value="Acceptable">Acceptable</option>
          <option value="Low Quality">Low Quality</option>
          <option value="Unacceptable">Unacceptable</option>
          <option value="Remove">Remove</option>
        </select>
      </label>
      <div className="left-panel-ctas-wrapper">
        <button onClick={handleResetChanges} className="cta clear-cta">
          Reset
        </button>
        <input className="cta save-cta" type="submit" value="Save" />
      </div>
    </form>
  );
}
