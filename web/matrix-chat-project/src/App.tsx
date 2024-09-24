import { useState } from 'react';
import { Configuration } from 'react-md';
import Gui from './guimode/Gui.tsx';
import HackerMode from './hackermode/HackerMode.tsx';

const overrides = {};

export default function App() {
  const [hackerMode, setHackerMode] = useState(true);
  return (
    <Configuration {...overrides}>
      {hackerMode ? <HackerMode /> : <Gui />}
    </Configuration>
  );
}
