import React from 'react';
import {View,Button} from 'react-native';

//const url = "https:\/\/cdns-preview-8.dzcdn.net\/stream\/c-84d310328c484be618c2d4e645e8ec45-4.mp3";
//ReactNativeAudioStreaming.pause();
//ReactNativeAudioStreaming.resume();
//ReactNativeAudioStreaming.play({this.props.url}, {showIniOSMediaCenter: true, showInAndroidNotifications: true});
//ReactNativeAudioStreaming.stop();

//import { Player } from 'react-native-audio-streaming';
import Player from './Player';


export default class Streaming extends React.Component {

    constructor(props){
        super(props);
        this.state = {track: '', image:''};
    }

  render() {
    return (
     <View style={{flex: 1}}>
       <Player image= {this.props.image} song={this.props.song} back={this.props.back} play={this.props.onPlay} />
       </View>
    );
  }
}