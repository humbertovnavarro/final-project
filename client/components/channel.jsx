import React from 'react';
import Player from '../components/player';
export default class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: null };
  }

  render() {
    return (
      <>
        <Player streamId={this.props.channelId}></Player>
        <div className="row">
          <h1>{this.state.name}</h1>
        </div>
      </>
    );
  }
}
