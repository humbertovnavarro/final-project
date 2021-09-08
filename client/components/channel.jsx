import React from 'react';
import Player from '../components/player';
import Avatar from '../components/avatar';
export default class Channel extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      userName: props.userName,
      channelId: props.channelId
    };
    this.state = state;
  }

  componentDidMount() {
    fetch(`/api/channel/${this.props.channelId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          userName: data.userName
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <>
        <Player streamId={this.state.channelId}></Player>
        <div className="row">
          <div className="row cyan rounded column-full">
            <div className="column-half">
              <div className="row item-center">
                <Avatar userId={this.state.channelId} />
                <span>{this.state.userName}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
