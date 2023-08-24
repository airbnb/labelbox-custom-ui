import React, { useEffect, useState } from 'react';
import DefaultImage from './DefaultImage';
import { Lightbox } from 'react-modal-image';

function getElement(id) {
  const el = document.getElementById(id);
  const rect = el.getBoundingClientRect();
  const x = rect.left + window.scrollX;
  const y = rect.top + window.scrollY;
  const top = rect.top;
  const bottom = rect.bottom;
  return { el, x, y, top, bottom };
}

export default function ImageGrid({ images, onClickImage, selectedImageIdx }) {
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);

  const handleKeydownEvent = (e) => {
    if (images.length === 0) {
      return;
    }

    const key = e.key.toLowerCase();

    if (selectedImageIdx === undefined) {
      if (key === ' ') {
        return;
      }
      if (
        key === 'arrowright' ||
        key === 'arrowleft' ||
        key === 'arrowup' ||
        key === 'arrowdown'
      ) {
        onClickImage(0);
      }
    }
    const currentId = `image-container-${images[selectedImageIdx].photoId}`;
    if (key === 'arrowright') {
      e.preventDefault();

      const { el, y: currentY } = getElement(currentId);

      // at the last item in the grid/list
      if (!el.nextSibling) {
        return;
      }

      // if the next item is in the next row and off screen, scroll to it
      const { y: nextSiblingY, bottom } = getElement(el.nextSibling.id);
      if (currentY < nextSiblingY && bottom > window.innerHeight) {
        el.nextSibling.scrollIntoView(false);
      }

      onClickImage(selectedImageIdx + 1);
    } else if (key === 'arrowleft') {
      e.preventDefault();
      const { el, y: currentY } = getElement(currentId);

      // at the first item in the grid/list
      if (!el.previousSibling) {
        return;
      }

      // if the prev item is in the prev row and off screen, scroll to it
      const { y: prevSiblingY, top } = getElement(el.previousSibling.id);
      // 87 because of the headers
      if (currentY > prevSiblingY && top < 87) {
        el.previousSibling.scrollIntoView();
      }

      onClickImage(selectedImageIdx - 1);
    } else if (key === 'arrowup') {
      e.preventDefault();
      const { x: currentX, y: currentY } = getElement(currentId);

      let lastInPrevRow;

      // loop backwards until we find the first item above in the same column
      for (let i = selectedImageIdx - 1; i >= 0; i--) {
        const {
          el,
          x: prevX,
          y: prevY,
          top,
        } = getElement(`image-container-${images[i].photoId}`);

        if (currentY > prevY) {
          if (lastInPrevRow === undefined) {
            lastInPrevRow = i;
          }
          if (currentX === prevX) {
            onClickImage(i);
            // 87 because of the headers
            if (top < 87) {
              el.scrollIntoView();
            }
            break;
          }
        }

        // if we've reached this, then there are grid items in the last row that don't perfectly align
        // so we take the reference to the last item in the prev row and use that to go to
        if (i === 0 && lastInPrevRow !== undefined) {
          const { el: newEl, top: newTop } = getElement(
            `image-container-${images[lastInPrevRow].photoId}`
          );

          onClickImage(lastInPrevRow);
          // 87 because of the headers
          if (newTop < 87) {
            newEl.scrollIntoView();
          }
        }
      }
    } else if (key === 'arrowdown') {
      e.preventDefault();
      const { x: currentX, y: currentY } = getElement(currentId);

      let firstInNextRow;

      // loop forward until we find the first item below in the same column
      for (let i = selectedImageIdx + 1; i < images.length; i++) {
        const {
          el,
          x: nextX,
          y: nextY,
          bottom,
        } = getElement(`image-container-${images[i].photoId}`);

        if (currentY < nextY) {
          if (firstInNextRow === undefined) {
            firstInNextRow = i;
          }
          if (currentX === nextX) {
            onClickImage(i);
            if (bottom > window.innerHeight) {
              el.scrollIntoView(false);
            }
            break;
          }
        }

        // if we've reached this, then there are grid items in the last row that don't perfectly align
        // so we take the reference to the first item in the next row and use that to go to
        if (i === images.length - 1 && firstInNextRow !== undefined) {
          const { el: newEl, bottom: newBottom } = getElement(
            `image-container-${images[firstInNextRow].photoId}`
          );

          onClickImage(firstInNextRow);
          if (newBottom > window.innerHeight) {
            newEl.scrollIntoView(false);
          }
        }
      }
    } else if (key === ' ') {
      e.preventDefault();
      setIsPhotoViewerOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydownEvent);
    return () => document.removeEventListener('keydown', handleKeydownEvent);
  }, [images, selectedImageIdx, handleKeydownEvent]);

  const closePhotoViewer = () => {
    setIsPhotoViewerOpen(false);
  };

  return (
    <>
      <div className="photo-grid">
        {images.map((imgObj, idx) => {
          return (
            <DefaultImage
              imgObj={imgObj}
              idx={idx}
              isSelected={selectedImageIdx === idx}
              key={imgObj.photoId}
              onClickImage={(photoIdx) => onClickImage(photoIdx)}
            />
          );
        })}
      </div>
      {isPhotoViewerOpen && !!images[selectedImageIdx] && (
        <Lightbox
          medium={images[selectedImageIdx].imageSrc}
          large={images[selectedImageIdx].imageSrc}
          onClose={closePhotoViewer}
          hideDownload
          showRotate
        />
      )}
    </>
  );
}
