import React from 'react';
import logo from './logo.svg';
import './App.css';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import axios from 'axios';

function App() {
  var playsList = {};

async function handlePlayClick(url, videoWrapper){

  const player = playsList[videoWrapper]
  if(player){
    player.destroy();
  }

  const result = await axios(
    `http://localhost:5000/api/play?url=${url}`,
  );

  if(result.status === 200){

    var ws = `ws://localhost/play/${result.data}`;
    const player = new JSMpeg.VideoElement(videoWrapper, ws);
    player.play();

    playsList[videoWrapper] = player;
  }
}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div className='video'>
          <div className='video-container'>
            <div id="videoWrapper1" className='video-wrapper'></div>
            <button onClick={() => handlePlayClick('rtsp://58.99.33.8:1935/ipcam/172.28.0.130.stream','#videoWrapper1')}>play</button>
          </div>
          <div className='video-container'>
            <div id="videoWrapper2" className='video-wrapper'></div>
            <button onClick={() => handlePlayClick('rtsp://58.99.33.8:1935/ipcam/172.28.0.122.stream','#videoWrapper2')}>play</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
