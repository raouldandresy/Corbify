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
    BackAndroid
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

export default class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STOPPED,
            songs: '',
            secondsElapsed: 0,
            currentTime:0,
            duration:0,
            xPosition: new Animated.Value(0),
            tracks:[],
            min: 0,
            max: 0,
            listening: 0
        };
    }


    _statusChanged(status) {
    if(status==='FINISHED'){
        this.setState({duration: 0,currentTime:0,secondsElapsed:0});
        if(this.state.listening > this.state.min && this.state.listening < this.state.max){
            var track = 'http://corbisiero.dtdns.net:5000/get/'+this.state.tracks[this.state.listening]._id;
            fetch('https://api.deezer.com/search?q='+this.state.tracks[this.state.listening].author).then(function(response,error) {
                                   var contentType = response.headers.get("content-type");
                                   if(contentType && contentType.includes("application/json")) {
                                     return response.json();
                                   }
                                   throw new TypeError("Oops, we haven't got JSON!");
                                 }).then(res => {
                                       this.setState({image: res.data[0].album.cover_medium});
                                   }).catch(function(error) { console.log(error); });
            var song = this.state.tracks[this.state.listening].title;
            var listening = Math.floor(Math.random() * this.state.max);
            this.setState({track: track,listening: listening,song: song});
             RNAudioStreamer.setUrl(track);
             this.play(song);
        }else{
             this.setState({listening: 0});
        }
    }
         if(status==='STOPPED' && this.state.currentTime!=this.state.duration){
            this.setState({duration: 0,currentTime:0,secondsElapsed:0});
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
                      if(action.split("_")[0] === "PREV"){
                       this.setState({action: action});
                           this.back();
                      }
                      if(action.split("_")[0] === "NEXT"){
                       this.setState({action: action});
                           this.next();
                      }
                       if(action.split("_")[0] === "PLAY"){
                       this.setState({action: action});
                       this.play();
                      }
               }
      }


   // Status change observer
   componentDidMount() {
   this.interval = setInterval(this.tick, 1000);
   this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this));
   this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerAction',this.actionChanged.bind(this));
    this.cycleAnimation();
     fetch('http://corbisiero.dtdns.net:5000/playlist/'+this.props.user).then(function(response,error) {
                   var contentType = response.headers.get("content-type");
                   if(contentType && contentType.includes("application/json")) {
                       return response.json();
                   }
                    throw new TypeError("Oops, we haven't got JSON!");
                   }).then(res => {
                     this.setState({tracks: res,max:  res.length});
                     if(res.length > 0 && res.length != null){

                     var track = 'http://corbisiero.dtdns.net:5000/get/'+res[0].id_track;
                                 fetch('https://api.deezer.com/search?q='+res[0].author).then(function(response,error) {
                                                        var contentType = response.headers.get("content-type");
                                                        if(contentType && contentType.includes("application/json")) {
                                                          return response.json();
                                                        }
                                                        throw new TypeError("Oops, we haven't got JSON!");
                                                      }).then(res => {
                                                            this.setState({image: res.data[0].album.cover_medium});
                                                        }).catch(function(error) { console.log(error); });

                                 var listening = Math.floor(Math.random() * this.state.max);
                                 this.setState({track: track,listening: listening,song: res[0].title});
                                  RNAudioStreamer.setUrl(track);
                             }
                   }).catch(function(error) { console.log(error); });
   }



   cycleAnimation = () => {
   Animated.sequence([
       Animated.timing(this.state.xPosition, {
         toValue: 200,
          duration: 4000,
       }),
       Animated.timing(this.state.xPosition, {
         toValue: 0,
         duration: 4000,
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

    stop = () =>{
           RNAudioStreamer.pause();
      }

     play = (song) =>{
        if(song){
            RNAudioStreamer.play(song);
         }else{
            RNAudioStreamer.play(this.state.song);
         }
       }

     back = () =>{
                        var track = 'http://corbisiero.dtdns.net:5000/get/'+this.state.tracks[this.state.listening].id_track;
                        fetch('https://api.deezer.com/search?q='+this.state.tracks[this.state.listening].author).then(function(response,error) {
                                               var contentType = response.headers.get("content-type");
                                               if(contentType && contentType.includes("application/json")) {
                                                 return response.json();
                                               }
                                               throw new TypeError("Oops, we haven't got JSON!");
                                             }).then(res => {
                                                   this.setState({image: res.data[0].album.cover_medium});
                                               }).catch(function(error) { console.log(error); });
                        var song = this.state.tracks[this.state.listening].title;
                        var listening = Math.floor(Math.random() * this.state.max);
                        this.setState({track: track,listening: listening,song: song});
                         RNAudioStreamer.setUrl(track);
                         this.play(song);
       }

     next = () =>{
                    var track = 'http://corbisiero.dtdns.net:5000/get/'+this.state.tracks[this.state.listening].id_track;
                    fetch('https://api.deezer.com/search?q='+this.state.tracks[this.state.listening].author).then(function(response,error) {
                                           var contentType = response.headers.get("content-type");
                                           if(contentType && contentType.includes("application/json")) {
                                             return response.json();
                                           }
                                           throw new TypeError("Oops, we haven't got JSON!");
                                         }).then(res => {
                                               this.setState({image: res.data[0].album.cover_medium});
                                           }).catch(function(error) { console.log(error); });
                    var song = this.state.tracks[this.state.listening].title;
                    var listening = Math.floor(Math.random() * this.state.max);
                    this.setState({track: track,listening: listening,song: song});
                     RNAudioStreamer.setUrl(track);
                     this.play(song);
     }


    render() {
        return (
        <View style={{ flex: 1 }}>
        <View style={styles.image}>
        <AnimatedCircularProgress
          size={300}
          width={40}
          fill={(this.state.duration <= 0) ? 0 : ((this.state.currentTime /this.state.duration)*100)}
          tintColor="#00e0ff"
          backgroundColor="#3d5875" >
         { (fill) => (<Image
                  resizeMode={"cover"}
                  style={{width: 200, height: 200,borderRadius:100}}
                  source={{uri: this.state.image}}
            />)}
          </AnimatedCircularProgress>
          </View>
          <View style={{ paddingBottom: 40 }} />
          <Slider onValueChange={(value)=>this.onSeek(value)} value={this.state.currentTime} minimumValue={0} maximumValue={this.state.duration} thumbTintColor="#00e0ff" maximumTrackTintColor="#3d5875" minimumTrackTintColor="#00e0ff"/>
          <View style={{ paddingBottom: 40 }} />
          <View style={{ flex: 1 }}>
           <Animated.Text style={{ transform: [{translateX: this.state.xPosition}]}}>
           <Text style={styles.songName}>{this.state.song}</Text>
           </Animated.Text>
           </View>
          <View  style={styles.container}>
           <Button style={{color:"#3d5875"}} text="<<"  onPress={this.back}/>
          <Button style={{color:"#00e0ff"}} text="Play" onPress={this.play}/>
          <Button style={{color:"#3d5875"}} text="Pause" onPress={this.pause}/>
          <Button style={{color:"#3d5875"}} text="Stop"  onPress={this.stop}/>
          <Button style={{color:"#3d5875"}} text=">>"  onPress={this.next}/>
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
    },
    image:{
     alignItems: 'center',
            flexDirection: 'row',
            justifyContent:'center',
            paddingTop: 20
    }
});


