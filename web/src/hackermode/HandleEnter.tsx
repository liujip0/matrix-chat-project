import { matrixLogin } from '../ApiRequests.tsx';

export async function handleEnter(
  textareaContents: string[],
  setTextareaContents: (value: string[]) => void,
  mode: string,
  setMode: (value: string) => void,
  commandArgs: string[],
  setCommandArgs: (value: string[]) => void,
  homeserver: string,
  setHomeserver: (value: string) => void,
  deviceId: string,
  setDeviceId: (value: string) => void,
  accessToken: string,
  setAccessToken: (value: string) => void,
  setHackerMode: (value: boolean) => void,
  commandRunning: boolean,
  setCommandRunning: (value: boolean) => void
) {
  const newTextareaContents = textareaContents;
  let lastItem = newTextareaContents.pop()!;
  const lastItemArr = lastItem.split(' ');
  let newCommand = false;
  if (!mode) {
    if (!commandRunning) {
      setCommandRunning(true);
      switch (lastItemArr[0]) {
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
        case 'ls':
        case 'list': {
          break;
        }
        default: {
          lastItem += '\nInvalid command.';
          newCommand = true;
        }
      }
    } else {
      lastItem += '\nAnother command is already running.';
      newCommand = true;
    }
  } else {
    switch (mode) {
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
          lastItem.split('\n')[2].split('\u200b')[1]
        ]);
        lastItem += '\nPassword: \u200b';
        break;
      }
      case 'loginpassword': {
        setMode('');
        const username = commandArgs[1];
        const password = lastItem.split('\n')[3].split('\u200b')[1];
        lastItem = lastItem
          .split('\n')
          .map((subline, sublineIndex) =>
            sublineIndex === lastItem.split('\n').length - 1
              ? 'Password: \u26bf'
              : subline
          )
          .join('\n');
        const response = await matrixLogin(commandArgs[0], username, password);
        if (response.success) {
          lastItem += '\nLogin succeeded';
          setDeviceId(response.deviceId);
          setAccessToken(response.accessToken);
          setHomeserver(response.homeserver);
        } else {
          lastItem += '\nLogin failed\n' + response.error;
        }
        setCommandArgs([]);
        newCommand = true;
        break;
      }
    }
  }
  newTextareaContents.push(lastItem);
  if (newCommand) {
    newTextareaContents.push('');
  }
  setTextareaContents(newTextareaContents);
}
