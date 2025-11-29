import './settings.scss';
import ThemeSettings from './ThemeSettings.jsx';
import PieceSettings from './PieceSettings.jsx';
import SoundSettings from './SoundSettings.jsx';

export default function Settings() {
  return (
    <main id="settings-main">
      <h1>Settings</h1>

      <ThemeSettings />
      <PieceSettings />
      <SoundSettings />
    </main>
  );
}

