import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
// import { Button } from 'react-native-elements'
import { Card, CardSection, Input, Spinner } from './common';
import {Button} from 'react-native-elements';
import { CustomHeader } from './common/CustomHeader';

class ResetPassword extends Component {
  static navigationOptions = {
    title: '',
    headerTitle: <CustomHeader title="" />,
    headerStyle: {
      backgroundColor: '#2496BE',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  // constructor(props){
  //   super(props)
  //   this.state = {
  //     lang: lang
  //   }
  // }

  state = { email: '', password: '', error: '', loading: false, loggedInUser: false };

 

  onButtonPress() {
    const { email, password } = this.state;

    this.setState({ error: '', loading: true });

    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then(this.onLoginSuccess.bind(this))
    //   .catch(() => {
    //     firebase.auth().createUserWithEmailAndPassword(email, password)
    //       .then(this.onLoginSuccess.bind(this))
    //       .catch(this.onLoginFail.bind(this));
    //   });

    // var actionCodeSettings = {
    //   url: 'https://yak-vernac-app.firebaseapp.com/__/auth/action?email=kriminalas99@gmail.com',
    //   iOS: {
    //     bundleId: 'com.example.ios'
    //   },
    //   android: {
    //     packageName: 'com.yakvernac',
    //     installApp: false,
    //     minimumVersion: '1'
    //   },
    //   handleCodeInApp: true
    // };

    firebase.auth().sendPasswordResetEmail(this.state.email).then(function() {
      this.setState({ error: "Password reset email sent"});
      console.log('SENT')
      }.bind(this)).catch(function(error) {
          this.setState({ error: error.message});
      }.bind(this))

  }

  renderButton() {
    return (

<Button title='Reset Password'
titleStyle={{fontSize:20,fontWeight:'bold'}}
buttonStyle={{
  height: 45,
  backgroundColor: '#FF7F00',
  padding: 0,
  width: '100%',
}}
upperCase={false}
onPress={this.onButtonPress.bind(this)} />
    );
  }

  renderContent(lang) {

    // switch (this.state.loggedInUser) {
    //   case true:
    //     return (
    //         <Button onPress={() => firebase.auth().signOut()}>
    //           Log Out
    //         </Button>
    //     );
    //   case false:
        return (
          <View style={{width:'100%', height:'100%'}}>
          <CardSection>
          <Input
            placeholder="user@gmail.com"
            label="Email"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
        </CardSection>
          <View style={{width:'100%', height:15}}></View>
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
        <View style={{width:'100%', height:15}}></View>
        <View style={{width:'100%'}}>
          {this.renderButton()}
        </View>
        </View>
        );
    //   default:
    //     return <Spinner size="large" />;
    // }
    
        
  }

  render() {

    const { params } = this.props.navigation.state;

    return (
      <View style={{width:'100%', height:'100%', padding:30}}>

        {this.renderContent()}

        
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'green'
  }
};

export default ResetPassword;
