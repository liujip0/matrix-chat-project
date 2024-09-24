import { Configuration } from 'react-md';
import ChannelList from './channellist/ChannelList.tsx';
import ServerList from './serverlist/ServerList.tsx';

const overrides = {};

export default function App() {
  return (
    <Configuration {...overrides}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%'
        }}>
        <ServerList />
        <ChannelList />
      </div>
    </Configuration>
  );
}
