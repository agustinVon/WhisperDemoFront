import React, {useState} from 'react';
import {Button, SafeAreaView, Text, useColorScheme, View} from 'react-native';
import LiveAudioStream from 'react-native-live-audio-stream';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Buffer} from 'buffer';

const options = {
  sampleRate: 32000, // default is 44100 but 32000 is adequate for accurate voice recognition
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
  audioSource: 6, // android only (see below)
  bufferSize: 4096, // default is 2048,
  wavFile: 'test',
};

function App(): JSX.Element {
  const socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  // @ts-ignore
  socket.onerror = error => {
    console.error('WebSocket error:', error);
  };

  const [recording, setRecording] = useState(false);

  LiveAudioStream.init(options);

  LiveAudioStream.on('data', data => {
    const chunk = Buffer.from(data, 'base64');
    socket.send(chunk);
  });

  const onStartRecording = () => {
    setRecording(true);
    LiveAudioStream.start();
  };

  const onStopRecording = () => {
    setRecording(false);
    LiveAudioStream.stop();
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 40}}>
            {recording ? 'RECORDING' : 'NOT RECORDING'}
          </Text>
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{padding: 10}}>
            <Button title={'Record sound'} onPress={() => onStartRecording()} />
          </View>
          <View style={{padding: 10}}>
            <Button
              title={'Stop recording'}
              onPress={() => onStopRecording()}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
