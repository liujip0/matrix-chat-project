import ChannelList from './channellist/ChannelList.tsx';
import MessageWindow from './messagewindow/MessageWindow.tsx';
import ServerList from './serverlist/ServerList.tsx';

export default function Gui() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%'
      }}>
      <ServerList />
      <ChannelList />
      <MessageWindow />
    </div>
  );
}
