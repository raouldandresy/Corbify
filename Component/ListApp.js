import React from 'react';
import {View, FlatList, Alert, TextInput, Dimensions,Text,TouchableHighlight,StyleSheet,Button,TouchableOpacity} from 'react-native';
import { ListItem } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/Entypo';
import Swipeout from 'react-native-swipeout';

export default class ListApp extends React.Component {


    constructor(props) {
        super(props);
        this.state = { data: [],text: ''};
        }

    loadResource = () =>{
       let name = this.state.text.trim();
       if(name){
        fetch('http://corbisiero.dtdns.net:5000/search/'+name).then(function(response,error) {
            var contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
              return response.json();
            }
            throw new TypeError("Oops, we haven't got JSON!");
          }).then(res => {
               if(res.length > 0){
                    this.setState({data: res});
                }else{
                     fetch('http://corbisiero.dtdns.net:5000/alltracks').then(function(response,error) {
                      var contentType = response.headers.get("content-type");
                      if(contentType && contentType.includes("application/json")) {
                        return response.json();
                      }
                      throw new TypeError("Oops, we haven't got JSON!");
                      }).then(res => {
                       this.setState({data: res});
                      }).catch(function(error) { console.log(error); });
                }
            }).catch(function(error) { console.log(error); });
          }else{
            fetch('http://corbisiero.dtdns.net:5000/alltracks').then(function(response,error) {
               var contentType = response.headers.get("content-type");
               if(contentType && contentType.includes("application/json")) {
                   return response.json();
               }
                throw new TypeError("Oops, we haven't got JSON!");
               }).then(res => {
                 this.setState({data: res});
               }).catch(function(error) { console.log(error); });
          }
        }

        addToPlaylist = (item) =>{
            Alert.alert('add to playlist');
            var data = {
                id_user: this.props.user,
                id_track: item._id,
                title: item.title,
                author: item.author,
                fileName: item.fileName
            };
            fetch('http://corbisiero.dtdns.net:5000/addplaylist', {
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
            });
        }

        removeFromPlaylist = (item) =>{
            Alert.alert('remove from playlist');
            var data = {
                            id_user: this.props.user,
                            id_track: item._id,
                            title: item.title,
                            author: item.author,
                            fileName: item.fileName
                        };
             fetch('http://corbisiero.dtdns.net:5000/delplaylist', {
                                        method: 'DELETE',
                                        headers: {
                                          Accept: 'application/json',
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                        });
        }


        renderItem (items){

          const swipeSettings = {
                         autoClose: true,
                         right: [
                             { onPress: () => this.addToPlaylist(items.item), text: 'ADD', type: 'primary' }
                         ],
                         left: [ { onPress: () => this.removeFromPlaylist(items.item), text: 'DEL', type: 'delete' }],
                         rowId: items.index,
                         sectionId: 1
                     };

         return(
         <View style={{ flex: 1}}>
         <Swipeout {...swipeSettings}>
                    <ListItem
                      id={items.item._id}
                       divider
                       centerElement={{
                         primaryText: items.item.title+' - '+items.item.author,
                       }}
                      onPress={() => {this.props.goToTrack(items.item)}}
                     />
          </Swipeout>
          </View>);
            }


          render() {
          let { dim } = Dimensions.get("window");

            return (
            <View style={{flex: 1, height: dim}}>
            <TextInput
                 style={{height: 50,textAlign: 'center'}}
                 onChangeText={(text) => this.setState({text: text})}
                 value={this.state.text}
                 placeholder="Search and press the track"
             />
            <Button
              raised
              icon={{name: 'load', size: 32}}
              buttonStyle={{backgroundColor: 'red', borderRadius: 10}}
              textStyle={{textAlign: 'center'}}
              title={`Search`}
               onPress={this.loadResource.bind(this)}
            />
             { this.props.enabled ?
                 <FlatList
                data={this.state.data}
                keyExtractor={(item, index) => index}
                renderItem={(items) => this.renderItem(items)}
              />
              : null }
                </View>
            );
          }
}


const swipeoutBtns = [
          {
            text: 'Button'
          }
        ];
