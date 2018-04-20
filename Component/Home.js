import React from 'react';
import {
  TextInput,
  Image,
  View,
  Text,
  Modal,
  TouchableHighlight,
  Alert
} from 'react-native';
import ListApp from './ListApp';
import Streaming from './Streaming';
//import { ReactNativeAudioStreaming } from 'react-native-audio-streaming'
import RNAudioStreamer from 'react-native-audio-streamer';


export default class Music extends React.Component {

    constructor(props){
        super(props);
        this.state = {showList: true ,modalVisible: false};
        this.back = this.back.bind(this);
    }

    getTrack = (item) =>{
              fetch('https://api.deezer.com/search?q='+item.author).then(function(response,error) {
                       var contentType = response.headers.get("content-type");
                       if(contentType && contentType.includes("application/json")) {
                         return response.json();
                       }
                       throw new TypeError("Oops, we haven't got JSON!");
                     }).then(res => {
                           this.setState({image: res.data[0].album.cover_medium});
                       }).catch(function(error) { console.log(error); });

           if(this.state.track === item._id){
                this.setModalVisible(true);
           }else{
               this.setState({track: item._id,song:item.title,showList:false,uri: 'http://corbisiero.dtdns.net:5000/get/'+item._id });
               var track = 'http://corbisiero.dtdns.net:5000/get/'+item._id;
               RNAudioStreamer.setUrl(track);
               this.setModalVisible(true);
           }
    }

    back = () =>{
        RNAudioStreamer.pause();
        this.setState({showList:true,show: false});
        this.setModalVisible(false);
    }

     setModalVisible(visible) {
        this.setState({modalVisible: visible});
     }

      play = () =>{
              RNAudioStreamer.play(this.state.song);
          }

    render() {

      return (
      <View style={{flex: 1, paddingTop: 20}}>
         <ListApp goToTrack = {this.getTrack} enabled={this.state.showList} user={this.props.user} />
          <Modal
                   animationType="slide"
                   transparent={false}
                   visible={this.state.modalVisible}
                   >
                   <View style={{marginTop: 22, alignItems: 'center', textAlign: 'center'}}>
                     <View>
                        <Streaming onPlay={this.play} back={this.back} song={this.state.song} image={this.state.image} />
                     </View>
                    </View>
                 </Modal>
          </View>
      );
    }
  }

