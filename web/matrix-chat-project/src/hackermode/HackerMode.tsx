import { Fragment, useRef, useState } from 'react';
import './HackerMode.scss';

export default function HackerMode() {
  const textareaRef = useRef<HTMLDivElement>(null);
  const [textareaContents, setTextareaContents] = useState([
    'abcde',
    'fghijkl'
  ]);
  const [cursorPos, setCursorPos] = useState<number | null>(0);
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
        console.log('keydown');
        switch (event.key) {
          case 'ArrowLeft': {
            console.log('left');
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
              setTextareaContents([
                ...textareaContents.slice(0, textareaContents.length - 2),
                textareaContents[textareaContents.length - 1].slice(
                  0,
                  textareaContents[textareaContents.length - 1].length +
                    cursorPos -
                    1
                ) +
                  textareaContents[textareaContents.length - 1].slice(
                    textareaContents[textareaContents.length - 1].length +
                      cursorPos,
                    textareaContents[textareaContents.length - 1].length - 1
                  )
              ]);
            }
          }
          default: {
            break;
          }
        }
      }}>
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
