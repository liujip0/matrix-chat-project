import { useState } from 'react';
import { Configuration } from 'react-md';
import Gui from './guimode/Gui.tsx';
import HackerMode from './hackermode/HackerMode.tsx';

const mdOverrides = {};

export default function App() {
  const [hackerMode, setHackerMode] = useState(true);
  return (
    <Configuration {...mdOverrides}>
      {hackerMode ? <HackerMode setHackerMode={setHackerMode} /> : <Gui />}
    </Configuration>
  );
}
