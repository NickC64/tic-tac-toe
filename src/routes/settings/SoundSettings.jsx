import { useGameConfig } from '../../core/GameConfig.jsx';

export default function SoundSettings() {
  const {
    soundsEnabled,
    setSoundsEnabled,
    soundVolume,
    setSoundVolume,
  } = useGameConfig();

  return (
    <section className="settings-section">
      <h2>Sound Effects</h2>

      <div className="settings-field">
        <label>
          <input
            type="checkbox"
            checked={soundsEnabled}
            onChange={(e) => setSoundsEnabled(e.target.checked)}
          />
          Enable Sound Effects
        </label>
      </div>

      {soundsEnabled && (
        <div className="settings-field">
          <label htmlFor="sound-volume">
            Volume: {Math.round(soundVolume * 100)}%
          </label>
          <input
            id="sound-volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={soundVolume}
            onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
          />
        </div>
      )}
    </section>
  );
}


