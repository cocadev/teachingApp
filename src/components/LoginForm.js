import React, { Component } from 'react';
import { Text, View, Linking, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';

import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import { ButtonGroup, Icon } from 'react-native-elements';
import { Button, ThemeProvider } from 'react-native-material-ui';
import { Card, CardSection, Input, Spinner } from './common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from 'react-native-i18n';
import { strings } from '../../locales/i18n';

const robotoRegular='Roboto-Bold';
const robotoMedium='Roboto-Medium';
const robotoLight='Roboto-Light';
const robotoBold='Roboto-Bold';
import { Dimensions } from 'react-native';

class LogoTitle extends React.Component {

  render() {
    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    middleViewWidth = viewportWidth - 56*2;
    return (
      <View style={{flexDirection:'row',flex:1, backgroundColor:'transparent'}}>
      <View style={{width:middleViewWidth, justifyContent:'center', alignItems:'center'}}>
      <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>
        {this.props.title}
      </Text>
      </View>
      <View style={{flex:1, flexDirection:'row',flex:2, justifyContent:'flex-end',alignItems:'center', paddingRight:15, backgroundColor:'transparent'}}>
      {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
      {/* <Icon name='home'  type='FontAwesome' color='white'/> */}
      </View>
      </View>
    );
  }
}

class LoginForm extends Component {
  static navigationOptions = {
    title: 'Welcome',
    headerTitle: <LogoTitle title="Login" />,
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



  constructor() {
    super()
    this.state = { email: '', password: '', error: '', loading: false, loggedInUser: false, selectedIndex: 1, loginColour: '#FE330A', registerColour: '#FF7F00' };
    this.updateIndex = this.updateIndex.bind(this)
  }

  // static navigationOptions = {
  //   title: ,
  // };


  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params.lang == 'Portuguese') {

      I18n.defaultLocale = "en";
      I18n.locale = "en";
      I18n.currentLocale();
      console.log('PAKEICIAM I ANGLU !!!!')
      
    } else {
      I18n.defaultLocale = "pt";
      I18n.locale = "pt";
      I18n.currentLocale();
      console.log('PAKEICIAM I PORTUGALU !!!!')
    }
  }


  onButtonPress() {
    const { email, password } = this.state;

    this.setState({ error: '', loading: true });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch(this.onLoginFail.bind(this));
      });

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

    // firebase.auth().sendPasswordResetEmail('kriminalas99@gmail.com').then(function() {
    //   this.setState({ error: "Password reset email sent"});
    //   console.log('SENT')
    //   }.bind(this)).catch(function(error) {
    //       this.setState({ error: error.message});
    //   }.bind(this))

  }

  onLoginFail() {
    console.log("KLAIDELE...");
    if (this.state.selectedIndex == 1) {
      this.setState({ error: 'Username or Password incorrect', loading: false });
    } else {
      this.setState({ error: 'E-Mail already registered', loading: false });
    }
  }

  onLoginSuccess() {

    const { navigate } = this.props.navigation;

    const { currentUser } = firebase.auth();
    const { params } = this.props.navigation.state;

    firebase.database().ref(`/users/${currentUser.uid}/language`).once("value", snapshot => {
      const mylanguage = snapshot.val();

      this.setState({
        email: '',
        password: '',
        loading: false,
        error: '',
        loggedInUser: true
      });

      if (mylanguage) {
        navigate('Start')
      } else {
        if (params.lang === 'Portuguese') {
          var languageLearning = 'PT';
          var languageNative = 'EN';
        } else if (params.lang === 'English') {
          var languageLearning = 'EN';
          var languageNative = 'PT';
        }

        const myProfilePicture = [
          {
            title: 'Anonymous',
            illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.png?alt=media&token=ee7f968c-00c9-4097-8e0b-53f3a3562c05',
            xp: 0
          }
        ]

        const myIslandPics = [
          {
            title: 'Anonymous',
            illustration: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.jpg?alt=media&token=6bbc90c7-975a-47b5-847b-c7a3ec6c7651',
            xp: 0
          }
        ]

        const friends = {
          'FmIfeWNRGIh2s9iStQberUXIrgA3': {
            blockedBy: {
              'Nobody': '45612'
            },
            email: 'infoyakvernac@gmail.com',
            languageLearning: 'PT',
            languageNative: 'EN',
            name: 'YakVernac Support',
            username: 'YakVernac Support',
            myPic: 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/img%2Fmano.jpg?alt=media&token=7188d580-b62f-424a-af95-4234b85373f8',
            uid: 'FmIfeWNRGIh2s9iStQberUXIrgA3',
            age: 33,
            checkedMale: true
          }
        }

        const messages = {
          'FmIfeWNRGIh2s9iStQberUXIrgA3': {
            message: 'This is the Yak Vernac team. Feel free to message us here about any issues or suggestions you may have',
            seen: false,
            uid: 'FmIfeWNRGIh2s9iStQberUXIrgA3'
          }
        }

        var now = new Date().getTime();

        const oneChat = {
            _id: now,
            createdAt: now,
            fuid: currentUser.uid,
            order: -1 * now,
            text: "This is the Yak Vernac team. Feel free to message us here about any issues or suggestions you may have. \n\nHere is a helpful 'how to use Yak Vernac app' link - http://www.yakvernac.com \n\nTo read our Privacy Policy click here http://www.yakvernac.com/privacy-policy or the Terms and Conditions http://www.yakvernac.com/terms-and-conditions. \n\nPlease note that we will only respond to text messages concerning issues and suggestions.",
            uid: 'FmIfeWNRGIh2s9iStQberUXIrgA3',
            seen: false
        }

        if (currentUser.uid > 'FmIfeWNRGIh2s9iStQberUXIrgA3') {
          var ChatID = `${currentUser.uid}-FmIfeWNRGIh2s9iStQberUXIrgA3`;
        } else {
          var ChatID = `FmIfeWNRGIh2s9iStQberUXIrgA3-${currentUser.uid}`;
        }  

        firebase.database().ref(`/users/${currentUser.uid}`)
          .update({ username: '', language: params.lang, languageLearning, languageNative, uid: currentUser.uid, xp: 50, freeTranslations: 0, blockedBy: { 'Nobody': '4321312' }, profilePics: myProfilePicture, islandPics: myIslandPics, friends: friends, messages:messages });
        firebase.database().ref(`/chat/${ChatID}`)
          .update({oneChat});

        navigate('Profile', { user: currentUser })
      }
    });


  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    // switch (this.state.loginColour) {
      // case '#FE330A': 
        // return (
        //   <Button 
        //     text={strings('LoginScreen.log_in')} style={loginButton} upperCase={false}
        //     onPress={this.onButtonPress.bind(this)} />
        // )
      // case '#FF7F00':
        // return (
          // <Button 
            // text={strings('LoginScreen.register')} style={loginButton} upperCase={false}
            // onPress={this.onButtonPress.bind(this)} />
        // )
    

    return (
      <Button 
       text={strings('LoginScreen.log_in')} style={loginButton} upperCase={false}
        onPress={this.onButtonPress.bind(this)} />
    );
  }

  pressedRegister() {
    this.setState({loginColour:'#FF7F00'});
    this.setState({registerColour: '#FE330A'});
  }

  pressedLogin() {
    this.setState({loginColour:'#FE330A'});
    this.setState({registerColour: '#FF7F00'});
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
      <KeyboardAwareScrollView style={{width:'100%'}}>
        <View style={{width:'100%', justifyContent:'center',alignContent:'center'}}>
          <Text style={{fontSize:30,fontWeight:'bold',color:'white', textAlign:'center', fontFamily:robotoBold}}>
            Hello!
          </Text>
          <Text style={styles.helpContent}>
            {strings('LoginScreen.if_you')}
          </Text>
          <Text style={styles.helpContent}>

            {strings('LoginScreen.if_you_do')}
          </Text>
        </View>
        <View style={{width:'100%', height:15}}/>
        {/* <View style={{flexDirection:'row', width:'100%'}}>
          <View style={{width:'50%', paddingRight:5}}>
            <TouchableOpacity style={{width:'100%', height:40, justifyContent:'center',alignItems:'center', backgroundColor:this.state.registerColour}} onPress={this.pressedRegister.bind(this)}>
              <Text style={{fontSize:16,fontWeight:'bold',color:'white'}}>
              {strings('LoginScreen.register')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{width:'50%', paddingLeft:5}}>
            <TouchableOpacity style={{width:'100%', height:40, justifyContent:'center',alignItems:'center', backgroundColor:this.state.loginColour}} onPress={this.pressedLogin.bind(this)}>
              <Text style={{fontSize:16,fontWeight:'bold',color:'white'}}>
              {strings('LoginScreen.log_in')}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <View style={{width:'100%', height:50}}/>
        <View style={{flexDirection:'row', width:'100%', height:60, backgroundColor:'white'}}>
          <View style={{paddingLeft:20,width:'25%', height:60, justifyContent:'center', backgroundColor:'transparent'}}>
            <Text style={{fontSize:16, color:'grey'}}>
            {strings('LoginScreen.email')}
            </Text>
          </View>
          <View style={{width:'60%', height:60, justifyContent:'center', backgroundColor:'transparent'}}>
            <TextInput
              //placeholder="user@gmail.com"
              value={this.state.email}
              style={{ fontSize:15,color:'grey' }}
              underlineColorAndroid='transparent'
              onChangeText={email => this.setState({ email })}
            />
          </View>
          <View style={{paddingRight:15, width:'15%', justifyContent:'center', alignItems:'flex-end', height:60, backgroundColor:'transparent'}}>
            <Icon name='user' size={20}  type='font-awesome' color='#1FA4C0'/>
          </View>
        </View>
        <View style={{width:'100%', height:8}}/>
        <View style={{flexDirection:'row', width:'100%', height:60, backgroundColor:'white'}}>
          <View style={{paddingLeft:20,width:'25%', height:60, justifyContent:'center', backgroundColor:'transparent'}}>
            <Text style={{fontSize:16, color:'grey'}}>
            {strings('LoginScreen.password')}
            </Text>
          </View>
          <View style={{width:'60%', height:60, justifyContent:'center', backgroundColor:'transparent'}}>
            <TextInput
              //placeholder="password"
              secureTextEntry={true}
              value={this.state.password}
              style={{ fontSize:15,color:'grey' }}
              underlineColorAndroid='transparent'
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <View style={{paddingRight:15, width:'15%', justifyContent:'center', alignItems:'flex-end', height:60, backgroundColor:'transparent'}}>
            <Icon name='lock' size={20}  type='font-awesome' color='#1FA4C0'/>
          </View>
        </View>
        <View style={{width:'100%', height:20}}/>
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <View>
          {this.renderButton()}
        </View>
        <Text style={styles.helpContent}>
          {strings('LoginScreen.accessing_our')}
        </Text>
        <Text style={styles.privacyPolicy}
          onPress={() => Linking.openURL('http://www.yakvernac.com/privacy-policy')}>
          {strings('LoginScreen.privacy_policy')}
        </Text>

      </KeyboardAwareScrollView>
    );
    //   default:
    //     return <Spinner size="large" />;
    // }


  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex })
  }

  render() {

    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    const { selectedIndex } = this.state

    return (
      <ThemeProvider>
        <View style={{width:'100%',height:'100%'}}>
          <Image style={styles.iconContainer} source={require('../../src/assets/start_bg.png')} />
          <KeyboardAwareScrollView style={{width:'100%', padding:20}}>
            {/* <ButtonGroup buttonStyle={styles.buttonStyle}
              containerStyle = {{borderColor:"transparent"}}
              selectedButtonStyle={styles.selectedButtonStyle}
              textStyle={styles.buttonTextStyle}
              selectedTextStyle={styles.selectedButtonTextStyle}
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={['Register', 'Log In']}

            /> */}

            {this.renderContent()}
            <View style={{width:'100%',height:50}}></View>
            <CardSection style={{width: '100%',
              backgroundColor: '#1FA4C0',
              borderColor: 'transparent',}} >
            <Button text={strings('LoginScreen.reset_password')} style={resetPasswordButton}
              upperCase={false}
              onPress={() => navigate('ResetPassword')} />

          </CardSection>
          <View style={{width:'100%',height:50}}></View>
          <View style={{width:'100%',height:50}}></View>
          </KeyboardAwareScrollView>
          
        </View>
      </ThemeProvider>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
    fontFamily: robotoRegular,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    paddingTop: 80,
    flexDirection: 'column',
    alignItems: 'center',

  },
  cardStyle: {
    borderColor: 'transparent',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 20,
  },
  infoContainer: {
    marginVertical: 30,
    marginHorizontal: 30,
  },
  buttonStyle: {

    backgroundColor: '#FF7F00',
  },
  selectedButtonStyle: {
    marginHorizontal: 0,
    backgroundColor: '#FE330A',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: robotoBold,
  },
  selectedButtonTextStyle: {
    color: '#FFFFFF',
  },
  loginButtonContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  helpContent: {
    fontFamily: robotoMedium,
    //fontFamily: "Roboto-Bold",
    fontSize: 11,
    paddingTop: 16,
    color: '#fff',
    textAlign: 'center',
  },
  privacyPolicy: {
    fontFamily: robotoMedium,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  bottomContainer: {
    width: '100%',
    backgroundColor: '#1FA4C0',
    borderColor: 'transparent',
    position: 'absolute',
    bottom: 0,
  },

};
const loginButton = {
  container: {
    height: 40,
    backgroundColor: '#FE330A',
    padding: 6,
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily:robotoBold
  }
};
const resetPasswordButton = {
  container: {
    height: 40,
    backgroundColor: 'transparent',
    padding: 6,
    width: '100%',
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontFamily: robotoBold,
  }
};
export default LoginForm;

