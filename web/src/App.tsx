import { useState } from 'react';
import { Configuration } from 'react-md';
import Gui from './guimode/Gui.tsx';
import HackerMode from './hackermode/HackerMode.tsx';

const mdOverrides = {};

export default function App() {
  const [hackerMode, setHackerMode] = useState(true);
  const [homeserver, setHomeserver] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  return (
    <Configuration {...mdOverrides}>
      {hackerMode ? (
        <HackerMode
          setHackerMode={setHackerMode}
          homeserver={homeserver}
          setHomeserver={setHomeserver}
          deviceId={deviceId}
          setDeviceId={setDeviceId}
          accessToken={accessToken}
          setAccessToken={setAccessToken}
        />
      ) : (
        <Gui />
      )}
    </Configuration>
  );
}
