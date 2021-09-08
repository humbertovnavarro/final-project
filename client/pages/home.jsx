import React from 'react';
import Channel from '../components/channel';
import Header from '../components/header';
export default function Home(props) {
  return (
    <>
    <Header/>
    <div className="container">
      <div className="row">
        <div id="content">
          <Channel channelId="1"/>
        </div>
      </div>
    </div>
    </>
  );
}
