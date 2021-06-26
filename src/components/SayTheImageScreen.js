import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Image, AppRegistry, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import {CheckBox, Slider} from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import { Button } from 'react-native-elements';
import { CustomHeader} from './common/CustomHeader';
import Tts from 'react-native-tts';
import { showMessage, hideMessage } from "react-native-flash-message";

import Voice from 'react-native-voice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { strings } from '../../locales/i18n';

Tts.setDefaultLanguage('pt-BR');
Tts.setDefaultRate(0.4);

class SayTheImageScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Spatial/Linguistic',
      headerTitle: <CustomHeader title={strings('AllGames.say_the')} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }
  // Nav options can be defined as a function of the screen's props:
  // static navigationOptions = ({ navigation }) => ({
  //   title: `Chat with ${navigation.state.params.user.email}`,
  // });
  

    constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],

      words: [''], 
      index: 0, 
      topicIndex: 0, 
      a: [''], 
      k: 0, 
      temp: '', 
      result: '', 
      allCorrect: 0, 
      max: 5,
      modalVisible: false      
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params.myUser.languageLearning == 'PT') {
      Tts.setDefaultLanguage('pt-BR');
    } else {
      Tts.setDefaultLanguage('en-US');
    } 
  }

    componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: '√',
    });
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value,
    });
  }

  async _startRecognizing(e) {
    const { params } = this.props.navigation.state;
    this.setState({temp:''});
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
    try {
      if (params.myUser.languageLearning == 'PT') {
        await Voice.start('pt-BR');
      } else {
        await Voice.start('en-US');
      }
      
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    console.log('ISKVIECIAU STOPA');
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    console.log('ISKVIECIAU DESTROYERI');
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }


  onButtonPress() {

    const { navigate } = this.props.navigation;

    switch (this.state.index) {
      case 0:
        navigate('VisualAwareness');
      // case false:
      //   return <LoginForm />;
      default:
        return navigate('Home');
    }
  }

  changeWord(a) {
    console.log(this.state.k);
    console.log(a);
    const { params } = this.props.navigation.state;
    const {currentUser} = firebase.auth();

    if (this.state.k != this.state.max) {
      this.setState({WordToGuess:a[this.state.k]});
      this.setState({finalArray: []});
      firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}/${a[this.state.k]}`).once("value", snapshot => {
      
      var temp = snapshot.val().word;
      var url = snapshot.val().url;

      this.setState({url:url});

      var tempResult = temp.split('');
      var result = this.shuffle(tempResult);
      
      if (tempResult.indexOf('/') !== -1) {
        this.setState({moreInfo: 'This word can be masculine or feminine'})
        var compRes = temp.split('/');
        this.setState({compareResult: compRes});

        tempResult.splice(tempResult.indexOf('/'), 1 );
        var result = this.shuffle(tempResult);
        this.setState({result});
      } else {
        this.setState({result});
        this.setState({compareResult: [temp]});
      }

      this.setState({result});
    })
    } else if (this.state.k == this.state.max) {

      var userXP = params.myUser.xp + this.state.allCorrect;

      firebase.database().ref(`/users/${currentUser.uid}`)
      .update({xp:userXP})
      .then(() => {
      })
      .catch(() => {
        console.log('could not update the profile values!')
      })
  
  }
    
  }

  componentDidMount() {

    
    const { params } = this.props.navigation.state;
    var a = this.shuffle(params.words);
    if (a.length > 5) {
      a = a.slice(0,5);
      this.setState({a})
    } else {
      this.setState({max:a.length});
      this.setState({a})
    }

    
    console.log(a);

    this.changeWord(a);
  }

  CheckIfCorrect(word) {
    var kelintas = this.state.k + 1;
    console.log('KELINTAS YRA: ' + kelintas);

    // Voice.cancel();
    // Voice.cancel()
    this._stopRecognizing(this);
    // this._destroyRecognizer.bind(this)

    var compareResult = this.state.compareResult;
    var myResults = this.state.results;

    var found = compareResult.some(r=> myResults.indexOf(r) >= 0)
    
    if (found == true) {
      this.setState({temp:strings('GamesCommon.correct')});
      this.setState({allCorrect:this.state.allCorrect + 1});

      showMessage({
        message: strings('GamesCommon.correct'),
        description: strings('GamesCommon.sucess_desc'),
        type: "success",
      });

    } else {
      this.setState({temp:`${strings('SayTheImage.wrong_the', { name:compareResult[0]})}`});

      showMessage({
        message: strings('SayTheImage.wrong_the', { name:compareResult[0]}),
        description: strings('GamesCommon.better_luck'),
        type: "danger",
      });

    }

    this._destroyRecognizer(this);

    this.setState({
      k:kelintas
  }, () => {
    this.changeWord(this.state.a);
  });

    

  }

  // renderModalContent() {
  //   // const {currentUser} = firebase.auth();
  //   const { navigate } = this.props.navigation;

  //   return (
  //     <View>
  //         <Text>-----------------------------</Text> 
  //         <Text></Text>
  //         <Text>-----------------------------</Text>

  //         <TouchableHighlight
  //             onPress={() => {
  //                 this.setModalVisible(!this.state.modalVisible);
  //                 navigate('Start');
  //             }}>  
  //         <Text>Back to main menu</Text>
  //         </TouchableHighlight>

  //     </View>
  //   );
  // }

  renderContent(styles) {
    const { navigate } = this.props.navigation;
    var compareResult = this.state.compareResult;

    switch (this.state.k) {
      case this.state.max: 
        return (
          <View style={{width:'100%',height:'100%', paddingHorizontal:30, paddingTop:15, backgroundColor:'#C3E3E4'}}>
            <View style={{ width:'100%',height:'60%', flex: 1, justifyContent:'center', alignItems:'center' }} >
              <Text style={{ fontSize:30, fontWeight:'bold', color:'#FB5A3A', marginTop:20}}>{strings('GamesCommon.thanks_for')}</Text>
              <Text style={{ marginTop:27, fontSize:24, color:'#2496BE'}}>{strings('GamesCommon.you_earned', { name:this.state.allCorrect})}</Text>
            </View>
            <View style={{width:'100%', height:45}}></View>
            <View style={{ width:'100%',height:45, justifyContent:'flex-start', alignItems:'center'}} >
              <View style={{ width:'96%',height:45,}} >
                <Button 
                  title={strings('GamesCommon.exit_game')}
                  textStyle={{
                    fontSize:24,
                    fontWeight:'bold'
                  }}
                  buttonStyle={{
                    backgroundColor:'#FF7F00',
                    width:'100%',
                    height:45,
                  }}
                  onPress={() => navigate('Start')}/>
              </View>
            </View>
            <View style={{width:'100%', height:45}}></View>
          </View>
        );

      default:
        return (
          <View style={{width:'100%',height:'100%', paddingHorizontal:30, paddingTop:15, backgroundColor:'#C3E3E4'}}>
            <Slider
              value={this.state.k/this.state.max}
              thumbTintColor='#FF7F00'
              minimumTrackTintColor='#006780'
              maximumTrackTintColor='#1EA2BC'
              />
            <View style={{ marginBottom:20, flexDirection:'row', width:'100%', justifyContent:'flex-end', alignItems:'center'}}>
              <Text>{this.state.k}/{this.state.max}</Text>
            </View>
            <View style={{width:'100%', justifyContent:'center',alignItems:'center', backgroundColor:'#FD751C'}}>
              <Text style={{fontSize:20, fontWeight:'bold', color:'white'}}>
                {strings('SayTheImage.say_the')}
              </Text>
            </View>
            <View style={{width:'100%', paddingTop:5}}>
              <TouchableHighlight onPress={() => {Tts.speak(compareResult[0])}}>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: 250,
                    width: '100%',
                    borderWidth: 1,
                    //borderRadius:5,
                  }}
                  source={{uri:this.state.url}}
                  resizeMode="cover"
                />
              </TouchableHighlight>
            </View>
            <View style={{ paddingVertical:5, justifyContent:'center', alignItems:'center', width:'100%'}}>
              <Text style={{ fontSize:12, textAlign: 'center', color: '#333333'}} >
                {strings('SayTheImage.say_the_word')}
              </Text>
            </View>
            <Text style={styles.stat}>
              {`${strings('SayTheImage.started')}: ${this.state.started}`}
            </Text>
            <Text style={styles.stat}>
              {`${strings('SayTheImage.ended')}: ${this.state.end}`}
            </Text>
            <View style={{ marginVertical:10,  width:'100%', justifyContent:'center',alignItems:'center' }}>
              <TouchableOpacity onPress={this._startRecognizing.bind(this)}>
                <Image
                  style={styles.button}
                  source={require('./button.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width:'100%', justifyContent:'center', alignItems:'center'}}>
                <Button 
                  title={strings('SayTheImage.reset')}
                  textStyle={{
                    fontSize:18,
                    fontWeight:'bold'
                  }}
                  buttonStyle={{
                    backgroundColor:'#006780',
                    width:150,
                    height:30,
                  }}
                  onPress={this._destroyRecognizer.bind(this)}/>
            </View>
              {this.renderValidate()}
            {/* <Text>{this.state.temp}</Text> */}
          </View>
        );
    }
  }

  renderValidate() {

    var compareResult = this.state.compareResult;

//    if (this.state.end == '√' && this.state.results.length > 0) {
      return (
        <View style={{ marginTop:20,flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
          <Button 
            title='GO!'
            textStyle={{
              fontSize:24,
              fontWeight:'bold'
            }}
            buttonStyle={{
              backgroundColor:'#1EA2BC',
              width:150,
              height:45,
            }}
            onPress={() => this.CheckIfCorrect()}
          />

          <Button 
            title='Hint'
            textStyle={{
              fontSize:24,
              fontWeight:'bold'
            }}
            buttonStyle={{
              backgroundColor:'#3aaa17',
              width:80,
              height:45,
            }}
            onPress={() => {Tts.speak(compareResult[0])}}/>


        </View>
      );
//    } else {
//      return false;
//    }
  }

  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    
    return (
      <KeyboardAwareScrollView style = {{backgroundColor:'#C3E3E4'}}>
        {this.renderContent(styles)}
      </KeyboardAwareScrollView>
    );
  }
}


const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1 // label occupies 1/3 of the space
  },
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2 // input ocupies 2/3 of the space
  }
});

export default SayTheImageScreen;