import React from 'react';
import AppContext from '../app-context';
import Avatar from '../components/avatar';
import Chat from '../components/chat';
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
    this.setState({channelId: channelId});
    fetch(`/api/channel/${channelId}`)
      .then(res => res.json())
      .then(data => {
        if(data.isLive) {
          this.setState({isLive: true, channelName: data.channelName});
        } else {
          this.setState({isLive: false, channelName: data.channelName});
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
    const player = <ShakaPlayer autoPlay className="player rounded" src={`/live/${this.state.channelId}.mpd`} />
    const dummyPlayer = <div className='player rounded'></div>
    return (
      <>
      <div className="channel">
        <div className="channel-container">
            {(this.state.isLive && this.state.channelId !== null) ? player : dummyPlayer}
            <div className="profile rounded">
              <div className="row item-center">
                <Avatar
                  channelId={this.context.route.params.get('channelId')}
                  isLive={this.state.isLive}
                />
                <p>{this.state.channelName}</p>
              </div>
            </div>
        </div>
        <Chat user={this.context.user} toggleModal={this.toggleModal} room={this.context.route.params.get('channelId')} />
      </div>
      </>
    );
  }
}
