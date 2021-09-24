import React from 'react';
import Stream from '../components/stream';
class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { streams: [], search: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getLiveStreams();
  }

  getLiveStreams(offset) {
    const payload = {
      offset: offset || 1
    };
    const request = {
      method: 'GET',
      url: '/api/streams/live',
      data: payload
    };
    fetch('/api/channels/live', request)
      .then(res => res.json())
      .then(res => this.setState({ streams: res }));
  }

  createStreamCards(streams) {
    const streamCards = streams.map(stream => {
      return (
        <Stream
        key={stream.channelId}
        channelName={stream.channelName}
        channelId={stream.channelId}
        isLive={stream.isLive}
        viewers={stream.viewers}
        title={stream.title}
        preview={stream.preview}/>
      );
    });
    return streamCards;
  }

  handleChange(event) {
    this.setState({ search: event.target.value });
    const request = {
      method: 'POST',
      body: JSON.stringify({ query: event.target.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/channels/query', request)
      .then(res => res.json())
      .then(res => {
        this.setState({ streams: res });
      });
  }

  render() {
    const streamCards = this.createStreamCards(this.state.streams);
    return (
      <div className="container">
        <div className="row justify-center">
          <div className="search">
            <input onChange={this.handleChange} value={this.state.search} type="text" placeholder="Search for a stream"/>
            <span className="material-icons search-icon">search</span>
          </div>
        </div>
        <div className="browse">
          {streamCards.length > 0 ? streamCards : <h1>No Streams :(</h1>}
        </div>
      </div>
    );
  }
}
export default Browse;
