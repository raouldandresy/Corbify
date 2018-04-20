import React from 'react';
import { StyleSheet, Text, View, Image,Alert } from 'react-native';
import Music from './Home';
import { BottomNavigation } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Upload from './Upload';
import Login from './Login';
import Playlist from './Playlist';


export default class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {active:'home',isLoggedIn: false, username: '', password: '',disabled: true};
        this.onLogoutPress = this.onLogoutPress.bind(this);
        this.onLoginPress = this.onLoginPress.bind(this);
        this.onChangeTextUser = this.onChangeTextUser.bind(this);
        this.onChangeTextPass = this.onChangeTextPass.bind(this);
        this.onRegisterPress = this.onRegisterPress.bind(this);
    }

    onChangeTextUser = (username) =>{
        this.setState({username})
         if(this.state.username && this.state.password)
            this.setState({disabled: false});
    }

     onChangeTextPass = (password) =>{
             this.setState({password})
             if(this.state.username && this.state.password)
                this.setState({disabled: false});
        }

    onLogoutPress(){ this.setState({isLoggedIn: false})}

    onLoginPress() {
        this.setState({disabled: true});
        fetch('http://corbisiero.dtdns.net:5000/signin/'+this.state.username).then(function(response,error) {
                    var contentType = response.headers.get("content-type");
                    if(contentType && contentType.includes("application/json")) {
                      return response.json();
                    }
                    throw new TypeError("Oops, we haven't got JSON!");
                  }).then(res => {
                       if(res.length > 0){
                        if(this.state.password === res[0].password){
                            this.setState({isLoggedIn: true, disabled: false,id_user:res[0]._id});
                          }else{
                            Alert.alert('Login Failed : Password wrong!');
                          }
                       }
                    }).catch(function(error) { console.log(error); });


    }

    onRegisterPress() {
        this.setState({disabled: true});
        fetch('http://corbisiero.dtdns.net:5000/signin/'+this.state.username).then(function(response,error) {
          var contentType = response.headers.get("content-type");
          if(contentType && contentType.includes("application/json")) {
            return response.json();
          }
            throw new TypeError("Oops, we haven't got JSON!");
        }).then(res => {
          if(res.length > 0){
          Alert.alert('Already registered '+this.state.username)
          }else{
             data = {
                 nick: this.state.username,
                 pass: this.state.password
             }
             fetch('http://corbisiero.dtdns.net:5000/register', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
             });
             Alert.alert('Successful registered '+this.state.username);
             this.setState({disabled: false});
           }
        }).catch(function(error) { console.log(error); });

    }


  render() {

    return (
     <View style={{ flex: 1 }}>
      {this.state.active==='home' ? <Login onLoginPress={this.onLoginPress} onLogoutPress={this.onLogoutPress} logged={this.state.isLoggedIn} disabled={this.state.disabled}
       onChangeTextUser={this.onChangeTextUser} onChangeTextPass={this.onChangeTextPass} username={this.state.username} onRegisterPress={this.onRegisterPress} style={styles.container}/> : null}
      {this.state.active==='music' ? <Music user={this.state.id_user} style={styles.container}/> : null}
      {this.state.active==='upload' ? <Upload style={styles.container}/> : null}
      {this.state.active==='playlist' ? <Playlist user={this.state.id_user} style={styles.container}/> : null}
       { this.state.isLoggedIn ?
       <BottomNavigation active={this.state.active} hidden={false} style={styles.bottomNavigation}>
              <BottomNavigation.Action
                  key="home"
                  icon={<Icon size={24} color="white" name="home" />}
                  label="Home"
                  onPress={() => this.setState({ active: 'home' })}
              />
              <BottomNavigation.Action
                  key="music"
                  icon={<Icon size={24} color="white" name="music" />}
                  label="Music"
                  onPress={() => this.setState({ active: 'music' })}
              />
              <BottomNavigation.Action
                  key="playlist"
                  icon={<Icon2 size={24} color="white" name="playlist-play" />}
                  label="Playlist"
                  onPress={() => this.setState({ active: 'playlist' })}
                  />
               <BottomNavigation.Action
                  key="upload"
                  icon={<Icon size={24} color="white" name="upload" />}
                  label="Upload"
                  onPress={() => this.setState({ active: 'upload' })}
                  />
          </BottomNavigation>
          : null}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56
  },
  container: {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
      }

})