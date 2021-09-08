import React from 'react';
import ShakaPlayer from 'shaka-player-react';
import 'shaka-player/dist/controls.css';
function Player(props) {
  return <ShakaPlayer autoPlay className='player rounded' src={`/live/${props.streamId}.mpd`}/>;
}
export default Player;
