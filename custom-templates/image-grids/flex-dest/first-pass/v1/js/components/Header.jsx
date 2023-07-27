import React, { useCallback } from 'react';

export default function Header({
  currentAsset,
  hasPrev,
  hasNext,
  listingInfo,
  pdpAndGMapLinkNodes,
  projectId,
  hasLabel,
}) {
  const handleGoHome = useCallback(() => {
    window.location.href = 'https://app.labelbox.com/projects/' + projectId;
  }, [projectId]);

  const handleGoBack = useCallback(() => {
    if (hasPrev) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.previous);
    }
  }, [currentAsset, hasPrev]);

  const handleGoNext = useCallback(() => {
    if (hasNext) {
      Labelbox.setLabelAsCurrentAsset(currentAsset.next);
    } else if (!hasNext && hasLabel) {
      Labelbox.fetchNextAssetToLabel();
    }
  }, [currentAsset, hasNext, hasLabel]);

  return (
    <>
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
            hasNext || (!hasNext && hasLabel) ? 'button-default' : ''
          }`}
          onClick={hasNext || (!hasNext && hasLabel) ? handleGoNext : undefined}
        >
          keyboard_arrow_right
        </i>
      </div>
      <div className="inline-list">
        <span className="bold-text">Select Photo:</span> Arrows |{' '}
        <span className="bold-text">View Photo:</span> Space |{' '}
        <span className="bold-text">Close Photo:</span> Esc |{' '}
        <span className="bold-text">Set Quality:</span> 1-5 |{' '}
        <span className="bold-text">Submit:</span> Enter |{' '}
        <span className="bold-text">Skip:</span> s
      </div>
      <div className="inline-list">
          {listingInfo.map((info, idx) => {
            const [metadataKey, metadataValue] = info.split(':');
            return (<>
              <span key={metadataKey} className="bold-text">{metadataKey}:</span><span key={metadataValue}>{' '}{metadataValue}{' '}</span>
            </>
              )
            }
          )}
          {pdpAndGMapLinkNodes.map(link => <React.Fragment key={link.href}>{link}{' '}</React.Fragment>)}
      </div>
    </>
  );
}
