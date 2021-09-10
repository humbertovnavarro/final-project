import React from 'react';
import Avatar from './avatar';
function Stream(props) {
  let style;
  if(props.isLive) {
    style = {backgroundImage: `url(${props.preview})`};
  } else {
    style = {};
  }
  const hidden = props.isLive ? '' : 'hidden';
  return(
  <a href={`#channel?channelId=${props.channelId}`}>
  <div className="stream-card" style={style}>
    <div className="stream-card-header">
    </div>
    <div className="stream-card-body">
    </div>
    <div className="stream-card-footer">
      <div className="column-half">
        <div className="row item-center">
            <Avatar isLive={props.isLive} channelId={props.channelId} />
            <p>{props.channelName}</p>
        </div>
      </div>
      <div className="column-half">
        <div className="row reverse">
          <p className={`red ${hidden}`}>{props.viewers}</p>
          <span className={`material-icons red ${hidden}`}>person</span>
        </div>
      </div>
    </div>
  </div>
  </a>
  );
}
export default Stream;
