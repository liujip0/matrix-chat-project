import { Tree, useTreeItemExpansion, useTreeItemSelection } from 'react-md';
import './ChannelList.scss';

export default function ChannelList() {
  return (
    <Tree
      id="channellist"
      data={{
        channel1: { name: 'Channel #1', itemId: 'channel1', parentId: null }
      }}
      {...useTreeItemSelection([], false)}
      {...useTreeItemExpansion([])}
    />
  );
}
