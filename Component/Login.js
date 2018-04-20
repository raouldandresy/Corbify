import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Image
} from 'react-native';

export default class Login extends Component {

 constructor(props){
    super(props);
   }

    render() {
        return (
            <ScrollView style={{padding: 20}}>
              { !this.props.logged ?
              <View style={{ flex: 1 }}>
                    <Text style={{fontSize: 27}}>
                    Login
                     </Text>
                <TextInput placeholder='Username' value={this.props.username} onChangeText={(username) => {this.props.onChangeTextUser(username)}} />
                <TextInput placeholder='Password' secureTextEntry={true} value={this.props.password} onChangeText={(password) => {this.props.onChangeTextPass(password)}}/>
                <View style={{ paddingBottom: 20 }} />
                <Button onPress={this.props.onRegisterPress} title="Register" disabled={this.props.disabled}/>
                 <View style={{ paddingBottom: 20 }} />
                <Button onPress={this.props.onLoginPress} title="Login" disabled={this.props.disabled}/>
                     </View> : null }
               { this.props.logged ?
                 <View style={{ flex: 1 }}>
                  <Text style={{fontSize: 27}}>
                    Welcome {this.props.username}
                  </Text>
                  <View style={{ paddingBottom: 20 }} />
                  <Image
                      resizeMode={"cover"}
                      style={{width: 300, height: 300}}
                      source={{uri: 'https://memegenerator.net/img/instances/58276575/done.jpg'}}
                   />
                   <View style={{ paddingBottom: 20 }} />
                  <Button onPress={this.props.onLogoutPress} title="Logout" />
                  </View> : null}
                </ScrollView>
            )
    }
}