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
  const [commandArgs, setCommandArgs] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState<number | null>(0);
  const [mode, setMode] = useState('');
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
            if (
              cursorPos !== null &&
              textareaContents[textareaContents.length - 1][
                textareaContents[textareaContents.length - 1].length +
                  cursorPos -
                  1
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
              setForceRerender(forceRerender + 1);
            }
            break;
          }
          case 'Enter': {
            const newTextareaContents = textareaContents;
            let lastItem = newTextareaContents.pop()!;
            const lastItemArr = lastItem.split(' ');
            const command = mode ? mode : lastItemArr[0];
            let newCommand = false;
            switch (command) {
              case 'h':
              case 'help': {
                lastItem +=
                  "\nNot implemented yet, you'll just have to memorize the commands.\nGood luck!";
                newCommand = true;
                break;
              }
              case 'q':
              case 'quit': {
                if (lastItemArr.length === 1) {
                  setHackerMode(false);
                }
                break;
              }
              case 'l':
              case 'login': {
                setMode('loginhomeserver');
                lastItem += '\nHomeserver: \u200b';
                break;
              }
              case 'loginhomeserver': {
                setMode('loginusername');
                const homeserver = lastItem.split('\u200b')[1];
                setCommandArgs([
                  homeserver.slice(0, 8) === 'https://' ||
                  homeserver.slice(0, 7) === 'http://'
                    ? homeserver
                    : 'https://' + homeserver
                ]);
                lastItem += '\nUsername: \u200b';
                break;
              }
              case 'loginusername': {
                setMode('loginpassword');
                setCommandArgs([
                  ...commandArgs,
                  lastItem.split('\n')[1].split('\u200b')[1]
                ]);
                lastItem += '\nPassword: \u200b';
                break;
              }
              case 'loginpassword': {
                setMode('');
                const args = [
                  ...commandArgs,
                  lastItem.split('\n')[2].split('\u002b')[1]
                ];
                setCommandArgs([]);
                lastItem = lastItem
                  .split('\n')
                  .map((subline, sublineIndex) =>
                    sublineIndex === lastItem.split('\n').length - 1
                      ? 'Password: \u26bf'
                      : subline
                  )
                  .join('\n');
                newCommand = true;
                break;
              }
              default: {
                lastItem += '\nInvalid command.';
                newCommand = true;
              }
            }
            newTextareaContents.push(lastItem);
            if (newCommand) {
              newTextareaContents.push('');
            }
            setTextareaContents(newTextareaContents);
            setCursorPos(0);
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
