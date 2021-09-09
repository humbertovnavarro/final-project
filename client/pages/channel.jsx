import React from 'react';
import AppContext from '../app-context';
import ShakaPlayer from 'shaka-player-react';
import 'shaka-player/dist/controls.css';
export default class Channel extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {isLive: false, channelId: null};
  }

  checkStatus() {
    let channelId = this.context.route.params.get('channelId');
    fetch(`/api/channel/${channelId}/status`)
      .then(res => res.json())
      .then(data => {
        if(data.isLive) {
          this.setState({isLive: true, channelId: channelId});
        } else {
          this.setState({isLive: false, channelId: channelId});
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
  componentWillUnmount() {
    clearInterval(this.checkStream);
  }

  render() {
    const player = <ShakaPlayer autoPlay className='player rounded' src={`/live/${this.state.channelId}.mpd`} />
    const dummyPlayer = <div className='player rounded'></div>
    return (
      <>
        { this.state.isLive ? player : dummyPlayer }
      </>
    );
  }
}
