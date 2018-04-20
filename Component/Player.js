import React, { Component } from 'react';
import {
    NativeModules,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    DeviceEventEmitter,
    ActivityIndicator,
    Platform,
    Image,
    Alert,
    Animated,
    Slider,
    BackHandler
} from 'react-native';
import { Button } from 'react-native-material-ui';
import PropTypes from 'prop-types';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNAudioStreamer from 'react-native-audio-streamer';

// Possibles states
const PLAYING = 'PLAYING';
const STREAMING = 'STREAMING';
const PAUSED = 'PAUSED';
const STOPPED = 'STOPPED';
const ERROR = 'ERROR';
const METADATA_UPDATED = 'METADATA_UPDATED';
const BUFFERING = 'BUFFERING';
const START_PREPARING = 'START_PREPARING'; // Android only
const BUFFERING_START = 'BUFFERING_START'; // Android only

// UI
const iconSize = 60;

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STOPPED,
            song: '',
            secondsElapsed: 0,
            currentTime:0,
            duration:0,
            xPosition: new Animated.Value(0)
        };
    }


    _statusChanged(status) {
    if(status==='STOPPED'){
        this.setState({duration: 0,currentTime:0});
    }
       console.log(status);
        RNAudioStreamer.duration((err, duration)=>{
            if(!err){
                console.log(duration);
                this.setState({duration: duration});
            } //seconds
        })

            RNAudioStreamer.currentTime((err, currentTime)=>{
                if(!err){
                    console.log(currentTime);
                    this.setState({currentTime: currentTime});
                }//seconds
            })
     }



     tick = () => {
        this.setState({secondsElapsed: this.state.secondsElapsed + 1});
        RNAudioStreamer.currentTime((err, currentTime)=>{
                        if(!err){
                            console.log(currentTime);
                            this.setState({currentTime: currentTime});
                        }//seconds
                    })

      }

      componentWillUnmount = () => {
        clearInterval(this.interval);
        this.subscription.remove();
      }

      actionChanged(action){
             if(this.state.action != action){
                            if(action.split("_")[0] === "PAUSE"){
                             this.setState({action: action});
                                 this.pause();
                            }
                             if(action.split("_")[0] === "PLAY"){
                             this.setState({action: action});
                             this.props.play();
                            }
                   }
            }


   // Status change observer
   componentDidMount() {
   this.interval = setInterval(this.tick, 1000);
   this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
   this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerAction',this.actionChanged.bind(this));
    this.cycleAnimation();
    }

   cycleAnimation = () => {
   Animated.sequence([
       Animated.timing(this.state.xPosition, {
         toValue: 200,
          duration: 3000,
       }),
       Animated.timing(this.state.xPosition, {
         toValue: 0,
         duration: 3000,
       })]).start(() => {
          this.cycleAnimation();
     });
   }

   onSeek = (value) => {
        RNAudioStreamer.seekToTime(value);
   }

   pause = () =>{
        RNAudioStreamer.pause();
   }


    render() {
        return (
        <View style={{ flex: 1 }}>
        <AnimatedCircularProgress
          size={300}
          width={40}
          fill={(this.state.duration <= 0) ? 0 : ((this.state.currentTime /this.state.duration)*100)}
          tintColor="#00e0ff"
          backgroundColor="#3d5875" >
         { (fill) => (<Image
                  resizeMode={"cover"}
                  style={{width: 200, height: 200,borderRadius:100}}
                  source={{uri: this.props.image}}
            />)}
          </AnimatedCircularProgress>
          <View style={{ paddingBottom: 40 }} />
          <Slider onValueChange={(value)=>this.onSeek(value)} value={this.state.currentTime} minimumValue={0} maximumValue={this.state.duration} thumbTintColor="#00e0ff" maximumTrackTintColor="#3d5875" minimumTrackTintColor="#00e0ff"/>
          <View style={{ paddingBottom: 40 }} />
          <View style={{ flex: 1 }}>
           <Animated.Text style={{ transform: [{translateX: this.state.xPosition}]}}>
           <Text style={styles.songName}>{this.props.song}</Text>
           </Animated.Text>
           </View>
          <View  style={styles.container}>
          <Button style={{color:"#00e0ff"}} text="Play" onPress={this.props.play}/>
          <Button style={{color:"#3d5875"}} text="Pause" onPress={this.pause}/>
          <Button style={{color:"#3d5875"}} text="Stop"  onPress={this.props.back}/>
          </View>
        </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'center',
        height: 80,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#00e0ff",
        borderTopWidth: 1,
    },
    textContainer: {
        flexDirection: 'column',
        margin: 10
    },
    songName: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000'
    }
});

Player.propTypes = {
    url: PropTypes.string.isRequired
};


