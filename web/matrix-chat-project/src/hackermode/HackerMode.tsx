import { Fragment, useRef, useState } from 'react';
import './HackerMode.scss';

export default function HackerMode() {
  const [forceRerender, setForceRerender] = useState(0);
  const textareaRef = useRef<HTMLDivElement>(null);
  const [textareaContents, setTextareaContents] = useState<string[]>([
    'abcde',
    'fghijkl'
  ]);
  const [cursorPos, setCursorPos] = useState<number | null>(0);
  console.log(textareaContents);
  return (
    <div
      id="textarea"
      onLoad={() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }}
      ref={textareaRef}
      tabIndex={0}
      onKeyDown={(event) => {
        switch (event.key) {
          case 'ArrowLeft': {
            if (cursorPos !== null) {
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
              const lastItem = textareaContents.pop()!;
              const newLastItem =
                lastItem.slice(0, lastItem.length + cursorPos - 1) +
                lastItem.slice(lastItem.length + cursorPos);
              newTextareaContents.push(newLastItem);
              setTextareaContents(newTextareaContents);
              setForceRerender(forceRerender + 1);
            }
            console.log(textareaContents);
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
                setForceRerender(forceRerender + 1);
              }
            }
            break;
          }
        }
      }}>
      <div style={{ display: 'none' }}>{forceRerender}</div>
      {textareaContents.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {'> ' +
            (cursorPos !== null && lineIndex === textareaContents.length - 1
              ? line.slice(0, line.length + cursorPos) +
                '\u2588' +
                line.slice(line.length + cursorPos + 1)
              : line)}
          <br />
        </Fragment>
      ))}
    </div>
  );
}
