import { Fragment, useState } from 'react';
import './HackerMode.scss';
import { handleKeyPress } from './HandleKeypress.tsx';

type HackerModeProps = {
  setHackerMode: (value: boolean) => void;
  homeserver: string;
  setHomeserver: (value: string) => void;
  deviceId: string;
  setDeviceId: (value: string) => void;
  accessToken: string;
  setAccessToken: (value: string) => void;
};
export default function HackerMode({
  setHackerMode,
  homeserver,
  setHomeserver,
  deviceId,
  setDeviceId,
  accessToken,
  setAccessToken
}: HackerModeProps) {
  const [forceRerender, setForceRerender] = useState(0);
  const [textareaContents, setTextareaContents] = useState<string[]>([
    'Welcome to matrix-chat-project!\nq to escape, h for help',
    ''
  ]);
  const [commandArgs, setCommandArgs] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState<number | null>(0);
  const [mode, setMode] = useState('');
  const [commandRunning, setCommandRunning] = useState(false);
  return (
    <div
      id="textarea"
      onLoad={() => {
        document.getElementById('textarea')?.focus();
      }}
      tabIndex={0}
      onKeyDown={(event) => {
        handleKeyPress(
          event,
          textareaContents,
          setTextareaContents,
          cursorPos,
          setCursorPos,
          mode,
          setMode,
          commandArgs,
          setCommandArgs,
          commandRunning,
          setCommandRunning,
          homeserver,
          setHomeserver,
          deviceId,
          setDeviceId,
          accessToken,
          setAccessToken,
          setHackerMode
        );
        setForceRerender(forceRerender + 1);
      }}>
      <div style={{ display: 'none' }}>{forceRerender}</div>
      {textareaContents.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {(cursorPos !== null && lineIndex === textareaContents.length - 1
            ? line.slice(0, line.length + cursorPos) +
              '\u2588' +
              line.slice(line.length + cursorPos + 1)
            : line
          )
            .split('\n')
            .map((subline, sublineIndex) => (
              <Fragment key={sublineIndex}>
                {(sublineIndex === 0 ? '>\u00a0' : '\u00a0\u00a0') +
                  (mode.includes('password') &&
                  sublineIndex === line.split('\n').length - 1 &&
                  lineIndex === textareaContents.length - 1
                    ? subline.split('\u200b')[0] + '\u26bf'
                    : subline)}
                <br />
              </Fragment>
            ))}
        </Fragment>
      ))}
    </div>
  );
}
