import React from 'react';
import Avatar from './avatar';
import ShakaPlayer from 'shaka-player-react';
function Stream(props) {
  let style;
  return (
  <a href={`#channel?channelId=${props.channelId}`}>
  <div className="stream-card" style={style}>
    {
      props.isLive &&
      <ShakaPlayer muted={true} autoPlay={false} src={`/live/${props.channelId}.mpd`}></ShakaPlayer>
    }
    <div className="stream-card-footer">
      <div className="column-half">
        <div className="row item-center">
            <Avatar isLive={props.isLive} channelId={props.channelId} />
            <p>{props.channelName}</p>
        </div>
      </div>
      <div className="column-half">
        <div className="row reverse">
        </div>
      </div>
    </div>
  </div>
  </a>
  );
}
export default Stream;
