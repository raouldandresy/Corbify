import React from 'react';
import {View, FlatList, Alert, TextInput, Dimensions,Text} from 'react-native';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Button } from 'react-native-material-ui';

export default class Upload extends React.Component {

    constructor(props){
    super(props);
      this.state = {
          file: undefined
       };
   }

    selectFileTapped = () => {
       DocumentPicker.show({
             filetype: [DocumentPickerUtil.audio()],
           },(error,res) => {
             // Android

             console.log(
                res.uri,
                res.type, // mime type
                res.fileName,
                res.fileSize
             );


              this.uploadAudio(res);
              Alert.alert('Successful uploaded '+this.state.song);
           });


    }


    uploadAudio = async (res) => {
        const formData = new FormData();
        formData.append('file', {
          uri: res.uri,
          name: res.fileName,
          type: 'audio/mp3'
        })
        try {
          const res = await fetch('http://corbisiero.dtdns.net:5000/upload/'+this.state.song+'/'+this.state.artist, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          })
          const json = await res.json();
        } catch (err) {
          alert(err);
        }
      }


  render() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
     <View style={{width:300}}>
            <Text>Name Song : </Text>
            <TextInput value={this.state.song} onChangeText={(song) => this.setState({song})} />
      </View>
     <View style={{width:300}}>
            <Text >Name Artist : </Text>
            <TextInput value={this.state.artist}  onChangeText={(artist) => this.setState({artist})} />
    </View>
    <Button primary text="Open File" onPress={this.selectFileTapped.bind(this)} style={{width:300}}/>
    </View>
    );
  }
}

