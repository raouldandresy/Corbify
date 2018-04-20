import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import HomePage from './Component/index';
import { COLOR, ThemeProvider} from 'react-native-material-ui';


export default class App extends React.Component {

  render() {
    return (
    <ThemeProvider uiTheme={uiTheme}>
      <HomePage />
     </ThemeProvider>
    );
  }
}





const uiTheme = {
    palette: {
        primaryColor: COLOR.black,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

