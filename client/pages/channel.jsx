import React from 'react';
import AppContext from '../app-context';
import ShakaPlayer from 'shaka-player-react';
import 'shaka-player/dist/controls.css';
export default class Channel extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {isLive: false};
  }
  checkStatus() {
    let channelId = this.context.params.get('channelId');
    fetch(`/api/channel/${channelId}/status`)
      .then(res => res.json())
      .then(data => {
        if(data.isLive != this.state.isLive) {
          //Workaround to wait for NGINX to generate a manifest file before loading it
          setTimeout(() => {
            this.setState({isLive: data.isLive});
          }, 1000);
        }
      }).catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this.checkStatus();
    this.checkStream = setInterval(() => {
      this.checkStatus();
    }, 5000);
  }

  render() {
    let channelId = this.context.params.get('channelId');
    const player = <ShakaPlayer ref={this.ref} autoPlay className='player rounded' src={`/live/${channelId}.mpd`} />
    const dummyPlayer = <div className='player rounded'></div>
    return (
      <>
        { this.state.isLive ? player : dummyPlayer }
      </>
    );
  }
}
