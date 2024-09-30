import { handleEnter } from './HandleEnter.tsx';

export async function handleKeyPress(
  event: React.KeyboardEvent<HTMLDivElement>,
  textareaContents: string[],
  setTextareaContents: (value: string[]) => void,
  cursorPos: number | null,
  setCursorPos: (value: number | null) => void,
  mode: string,
  setMode: (value: string) => void,
  commandArgs: string[],
  setCommandArgs: (value: string[]) => void,
  commandRunning: boolean,
  setCommandRunning: (value: boolean) => void,
  homeserver: string,
  setHomeserver: (value: string) => void,
  deviceId: string,
  setDeviceId: (value: string) => void,
  accessToken: string,
  setAccessToken: (value: string) => void,
  setHackerMode: (value: boolean) => void
) {
  if (event.ctrlKey && event.key === 'c') {
    const newTextareaContents = textareaContents;
    let lastItem = newTextareaContents.pop()!;
    lastItem += '\n^C';
    newTextareaContents.push(lastItem);
    newTextareaContents.push('');
    setTextareaContents(newTextareaContents);
  } else {
    switch (event.key) {
      case 'ArrowLeft': {
        if (
          cursorPos !== null &&
          textareaContents[textareaContents.length - 1][
            textareaContents[textareaContents.length - 1].length + cursorPos - 1
          ] !== '\u200b'
        ) {
          setCursorPos(
            Math.max(
              cursorPos - 1,
              -1 * textareaContents[textareaContents.length - 1].length
            )
          );
        }
        break;
      }
      case 'ArrowRight': {
        if (cursorPos !== null) {
          setCursorPos(Math.min(cursorPos + 1, 0));
        }
        break;
      }
      case 'Backspace': {
        if (cursorPos !== null) {
          const newTextareaContents = textareaContents;
          let lastItem = newTextareaContents.pop()!;
          if (lastItem[lastItem.length + cursorPos - 1] !== '\u200b') {
            lastItem =
              lastItem.slice(0, lastItem.length + cursorPos - 1) +
              lastItem.slice(lastItem.length + cursorPos);
          }
          newTextareaContents.push(lastItem);
          setTextareaContents(newTextareaContents);
        }
        break;
      }
      case 'Enter': {
        setCommandRunning(true);
        handleEnter(
          textareaContents,
          setTextareaContents,
          mode,
          setMode,
          commandArgs,
          setCommandArgs,
          homeserver,
          setHomeserver,
          deviceId,
          setDeviceId,
          accessToken,
          setAccessToken,
          setHackerMode,
          commandRunning,
          setCommandRunning
        );
        setCursorPos(0);
        break;
      }
      default: {
        if (event.key.replace(/[\u0300-\u036f]/g, '').length === 1) {
          if (cursorPos !== null) {
            const newTextareaContents = textareaContents;
            const lastItem = textareaContents.pop()!;
            const newLastItem =
              lastItem.slice(0, lastItem.length + cursorPos) +
              event.key +
              lastItem.slice(lastItem.length + cursorPos);
            newTextareaContents.push(newLastItem);
            setTextareaContents(newTextareaContents);
          }
        }
        break;
      }
    }
  }
}
