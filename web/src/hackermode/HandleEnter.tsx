import {
  matrixListJoinedRooms,
  matrixListPublicRooms,
  matrixLogin
} from '../ApiRequests.tsx';

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
  setCommandRunning: (value: boolean) => void,
  setCursorPos: (value: number | null) => void
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
          setCommandRunning(false);
          break;
        }
        case 'q':
        case 'quit': {
          if (lastItemArr.length === 1) {
            setHackerMode(false);
            setCommandRunning(false);
          }
          break;
        }
        case 'l':
        case 'login': {
          setMode('loginuserid');
          lastItem += '\nUser ID: \u200b';
          break;
        }
        case 'ls':
        case 'list': {
          setCursorPos(null);
          if (lastItemArr.length === 1) {
            const response = await matrixListJoinedRooms(
              homeserver,
              accessToken
            );
            if (response.success) {
              lastItem += '\n' + response.rooms.join('\n');
            } else {
              lastItem += '\nAPI request failed\n' + response.error;
            }
          } else if (lastItemArr[1] === 'p' || lastItemArr[1] === 'public') {
            const response = await matrixListPublicRooms(
              homeserver,
              accessToken,
              lastItemArr[2] ? lastItemArr[2] : undefined
            );
            if (response.success) {
              lastItem +=
                '\n' +
                response.rooms
                  .map((room) => `${room.name}     ${room.id}`)
                  .join('\n');
            } else {
              lastItem += '\nAPI request failed\n' + response.error;
            }
          }
          setCursorPos(0);
          newCommand = true;
          setCommandRunning(false);
          break;
        }
        default: {
          lastItem += '\nInvalid command.';
          newCommand = true;
          setCommandRunning(false);
        }
      }
    } else {
      lastItem += '\nAnother command is already running.';
      newCommand = true;
    }
  } else {
    switch (mode) {
      case 'loginuserid': {
        setMode('loginpassword');
        const userid = lastItem.split('\u200b')[1];
        setCommandArgs([userid]);
        lastItem += '\nPassword: \u200b';
        break;
      }
      case 'loginpassword': {
        setMode('');
        const userid = commandArgs[0];
        const password = lastItem.split('\n')[2].split('\u200b')[1];
        lastItem = lastItem
          .split('\n')
          .map((subline, sublineIndex) =>
            sublineIndex === lastItem.split('\n').length - 1
              ? 'Password: \u26bf'
              : subline
          )
          .join('\n');
        setCursorPos(null);
        const response = await matrixLogin(userid, password);
        if (response.success) {
          lastItem += '\nLogin succeeded';
          setDeviceId(response.deviceId);
          setAccessToken(response.accessToken);
          setHomeserver(response.homeserver);
        } else {
          lastItem += '\nLogin failed\n' + response.error;
        }
        setCommandArgs([]);
        setCursorPos(0);
        newCommand = true;
        setCommandRunning(false);
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
