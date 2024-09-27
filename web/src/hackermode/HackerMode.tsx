import { Fragment, useState } from 'react';
import './HackerMode.scss';

type HackerModeProps = {
  setHackerMode: (value: boolean) => void;
};
export default function HackerMode({ setHackerMode }: HackerModeProps) {
  const [forceRerender, setForceRerender] = useState(0);
  const [textareaContents, setTextareaContents] = useState<string[]>([
    'Welcome to Hacker Mode!\nq to escape, h for help',
    ''
  ]);
  const [cursorPos, setCursorPos] = useState<number | null>(0);
  console.log(textareaContents);
  return (
    <div
      id="textarea"
      onLoad={() => {
        document.getElementById('textarea')?.focus();
      }}
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
              let lastItem = textareaContents.pop()!;
              lastItem =
                lastItem.slice(0, lastItem.length + cursorPos - 1) +
                lastItem.slice(lastItem.length + cursorPos);
              newTextareaContents.push(lastItem);
              setTextareaContents(newTextareaContents);
              setForceRerender(forceRerender + 1);
            }
            console.log(textareaContents);
            break;
          }
          case 'Enter': {
            const newTextareaContents = textareaContents;
            let lastItem = newTextareaContents.pop()!;
            switch (lastItem) {
              case 'h':
              case 'help': {
                lastItem +=
                  "\nNot implemented yet, you'll just have to memorize the commands.\nGood luck!";
                newTextareaContents.push(lastItem);
                newTextareaContents.push('');
                break;
              }
              case 'q':
              case 'quit': {
                setHackerMode(false);
                break;
              }
              default: {
                lastItem += '\nInvalid command.';
                newTextareaContents.push(lastItem);
                newTextareaContents.push('');
              }
            }
            setTextareaContents(newTextareaContents);
            setForceRerender(forceRerender + 1);
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
          {(cursorPos !== null && lineIndex === textareaContents.length - 1
            ? line.slice(0, line.length + cursorPos) +
              '\u2588' +
              line.slice(line.length + cursorPos + 1)
            : line
          )
            .split('\n')
            .map((subline, sublineIndex) => (
              <Fragment key={sublineIndex}>
                {(sublineIndex === 0 ? '>\u00a0' : '\u00a0\u00a0') + subline}
                <br />
              </Fragment>
            ))}
        </Fragment>
      ))}
    </div>
  );
}
