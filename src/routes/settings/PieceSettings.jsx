import { useState } from 'react';
import { useGameConfig } from '../../core/GameConfig.jsx';

export default function PieceSettings() {
  const {
    pieceType,
    setPieceType,
    pieceConfig,
    setPieceConfig,
    getAvailablePieceTypes,
  } = useGameConfig();

  const [imageError, setImageError] = useState(null);
  const availablePieceTypes = getAvailablePieceTypes();

  const handlePieceImageUpload = (symbol, file) => {
    if (!file) return;

    setImageError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file size must be less than 5MB.');
      return;
    }

    // Read file as data URL and delegate persistence to GameConfig
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setPieceConfig((prev) => ({
        ...prev,
        imageMap: {
          ...prev.imageMap,
          [symbol]: imageDataUrl,
        },
      }));
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePieceImage = (symbol) => {
    setPieceConfig((prev) => {
      const newImageMap = { ...prev.imageMap };
      delete newImageMap[symbol];
      return {
        ...prev,
        imageMap:
          Object.keys(newImageMap).length > 0 ? newImageMap : undefined,
      };
    });
  };

  return (
    <section className="settings-section">
      <h2>Board Pieces</h2>

      <div className="settings-field">
        <label htmlFor="piece-type-select">Piece Type</label>
        <select
          id="piece-type-select"
          value={pieceType}
          onChange={(e) => setPieceType(e.target.value)}
        >
          {availablePieceTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <p className="help-text">
          Choose how board pieces (X, O) are displayed.
        </p>
      </div>

      {imageError && <div className="error-message">{imageError}</div>}

      {/* Custom Image Upload for Icon Piece Type */}
      {pieceType === 'icon' && (
        <>
          <div className="settings-field">
            <label htmlFor="piece-x-image">Custom Image for X</label>
            <div className="image-upload-group">
              <input
                id="piece-x-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handlePieceImageUpload('X', e.target.files?.[0])
                }
              />
              {pieceConfig.imageMap?.X && (
                <div className="image-preview-group">
                  <img
                    src={pieceConfig.imageMap.X}
                    alt="X preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePieceImage('X')}
                    className="remove-image-button"
                    title="Remove X image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className="help-text">
              Upload a custom image to use for X pieces. Recommended: square
              images (e.g., 200x200px).
            </p>
          </div>

          <div className="settings-field">
            <label htmlFor="piece-o-image">Custom Image for O</label>
            <div className="image-upload-group">
              <input
                id="piece-o-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handlePieceImageUpload('O', e.target.files?.[0])
                }
              />
              {pieceConfig.imageMap?.O && (
                <div className="image-preview-group">
                  <img
                    src={pieceConfig.imageMap.O}
                    alt="O preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePieceImage('O')}
                    className="remove-image-button"
                    title="Remove O image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className="help-text">
              Upload a custom image to use for O pieces. Recommended: square
              images (e.g., 200x200px).
            </p>
          </div>
        </>
      )}
    </section>
  );
}


