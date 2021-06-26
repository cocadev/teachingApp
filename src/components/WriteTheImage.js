import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import {CheckBox, Slider} from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import { Button, Icon } from 'react-native-elements';
import { CustomHeader} from './common/CustomHeader';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ElevatedView from 'react-native-elevated-view'
import { showMessage, hideMessage } from "react-native-flash-message";
import { strings } from '../../locales/i18n';

class WriteTheImageScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Spatial Learning',
      headerTitle: <CustomHeader title={strings('AllGames.write_the')} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }
  state = { words: [''], index: 0, topicIndex: 0, a: [''], k: 0, temp: '', moreInfo: '', result: [''], finalArray: [], compareResult: [''], allCorrect: 0, max: 5};

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

  makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 3; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  changeWord(a) {
    // console.log(this.state.k);
    // console.log(a);
    const { params } = this.props.navigation.state;
    const {currentUser} = firebase.auth();

    if (this.state.k != this.state.max) {
      // this.setState({WordToGuess:a[this.state.k]});
    //   this.setState({ImageToGuess:a})
      this.setState({finalArray: []});
      firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}/${a[this.state.k]}`).once("value", snapshot => {
      
      this.setState({realword:a[this.state.k]});
      var snapshotResult = snapshot.val();
      var temp = snapshotResult.word;

      if(snapshotResult.hasOwnProperty("url2")){
        var imgToShow = snapshotResult.url2;
      } else {
        var imgToShow = snapshotResult.url;
      }

      this.setState({imgToGuess:imgToShow});

      var tempResult = temp.split('');
      var MyresultArray = this.shuffle(tempResult);
      
      var Addletters = this.makeid().split('');
      var result = MyresultArray.concat(Addletters);

      // console.log('mano zodis !');
      this.setState({translation:temp});
      
      if (tempResult.indexOf('/') !== -1) {
        this.setState({moreInfo: 'This word can be masculine or feminine'})
        var compRes = temp.split('/');
        this.setState({compareResult: compRes});

        tempResult.splice(tempResult.indexOf('/'), 1 );
        var result = this.shuffle(tempResult);
        this.setState({result});
        // console.log('resultatas !');
        // console.log(result);
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

    
    // console.log(a);

    this.changeWord(a);

  }

  addToArray(letter, index) {
    // console.log(letter);
    var Myarray = this.state.finalArray;
    Myarray.push(letter);
    this.setState({finalArray: Myarray});

    var ResultArray = this.state.result;
    ResultArray.splice(index, 1);
    this.setState({result:ResultArray});
  }

  deleteFromArray(index, letter) {
    var manoArray = this.state.finalArray;
    manoArray.splice(index, 1);
    this.setState({finalArray:manoArray});

    var ResultArray = this.state.result;
    ResultArray.push(letter);
    this.setState({result:ResultArray});
  }

  compareStrings(strA,strB){
    for(var result = 0, i = strA.length; i--;){
        if(typeof strB[i] == 'undefined' || strA[i] == strB[i]);
        else if(strA[i].toLowerCase() == strB[i].toLowerCase())
            result++;
        else
            result += 4;
    }
    return 1 - (result + 4*Math.abs(strA.length - strB.length))/(2*(strA.length+strB.length));
  }

  CheckIfCorrect(word) {
    var kelintas = this.state.k + 1;
    // console.log('KELINTAS YRA: ' + kelintas);
    
    var final = this.state.finalArray.join(""); 
    var compareResult = this.state.compareResult;

    console.log(this.compareStrings('restaurante', 'restaurante'));

    console.log(compareResult);
    console.log('------------------------');
    console.log(final);
    var confIndex = 0;
    
    for (var i = 0; i < compareResult.length; i++) { 
      // var confIndex = this.compareStrings(compareResult[i], final);
      if (confIndex < this.compareStrings(compareResult[i], final)) {
        var confIndex = this.compareStrings(compareResult[i], final)
      }
    }

    if (confIndex >= 0.8) {
      this.setState({temp:strings('GamesCommon.correct')})
      this.setState({allCorrect:this.state.allCorrect + 1});

      showMessage({
        message: strings('GamesCommon.correct'),
        description: strings('GamesCommon.sucess_desc'),
        type: "success",
      });

    } else {
      this.setState({temp:strings('GamesCommon.wrong')})
      showMessage({
        message: strings('GamesCommon.wrong'),
        description: strings('GamesCommon.better_luck'),
        type: "danger",
      });
    
    }
    
    // if (compareResult.indexOf(final) !== -1) {
      
    // } else {
      
    // }
    
    this.setState({
      k:kelintas
  }, () => {
    this.changeWord(this.state.a);
  });

  }

  

  renderContent() {
    const { navigate } = this.props.navigation;

    switch (this.state.k) {
      case this.state.max: 
        return (
          <View style={{width:'100%',height:'100%', paddingHorizontal:30, paddingTop:15, backgroundColor:'#C3E3E4'}}>
            <View style={{ width:'100%',height:'80%', flex: 1, justifyContent:'center', alignItems:'center' }} >
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
                {strings('WriteTheImage.guess_image')}
              </Text>
            </View>
            <View style={{width:'100%', paddingTop:5}}>
            <TouchableHighlight onPress={() =>this.setModalVisible(true)}>
              <Image
                  style={{
                    alignSelf: 'center',
                    height: 250,
                    width: '100%',
                    borderWidth: 1,
                    //borderRadius:5,
                  }}
                  source={{uri: this.state.imgToGuess}}
                  resizeMode="cover"
                />
              </TouchableHighlight>
              
            </View>
            <View style={{ width:'100%',justifyContent:'center', alignItems:'center'}}>
              <Text>{this.state.moreInfo}</Text>
            
              <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                {this.state.result.map((letter, index) => (
                  <TouchableOpacity
                    key={index} 
                    onPress={() => this.addToArray(letter, index)}
                  >
                    <View style={{ marginHorizontal:2, marginVertical:5, width:25,height:25, justifyContent:'center', alignItems:'center', backgroundColor:'#2496BE'}}>
                      <Text style={{color:'white', fontSize:20 }}>{letter}</Text>
                    </View>
                  </TouchableOpacity>
                ))} 
              </View>
              <Text style={{marginTop:10,}}>{strings('GamesCommon.your_response')}</Text>
              <View style={{ marginBottom:20, width:'100%', height:65, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  {this.state.finalArray.map((letter, index) => (
                    <TouchableOpacity
                    
                    key={index} 
                    onPress={() => this.deleteFromArray(index, letter)}
                    >
                        <Text style={{padding: 5, fontSize:20}}>{letter}</Text>
                    </TouchableOpacity>
                  
                  ))} 
                </View>
              </View>
              <View style={{ marginBottom:35, flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                <Button 
                  title={strings('GamesCommon.validate')}
                  textStyle={{
                    fontSize:24,
                    fontWeight:'bold'
                  }}
                  buttonStyle={{
                    backgroundColor:'#1EA2BC',
                    width:180,
                    height:45,
                  }}
                  onPress={() => this.CheckIfCorrect()}/>

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
                  onPress={() => this.setModalVisible(true)}/>


              </View>
              {/* <Text>--------------------------------</Text>
              <Text>{this.state.temp}</Text> */}
            </View>
          </View>
        );
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  renderModalContent() {

    // const {currentUser} = firebase.auth();
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                    <Icon
                      color='white'
                      size={25}
                      name='circle-with-cross'
                      type='entypo'
                    />
                  </TouchableOpacity>
                </View>
              </View>
          {/* <View style={{width:'100%',height:100, justifyContent:'center', alignItems:'center'}}>
            <Text style={{ marginVertical:45, fontSize:20, fontWeight:'bold', color:'black'}}>{this.state.compareResult}</Text>
          </View> */}

          <View style={{width:'100%',height:100, justifyContent:'center', textAlign: "left"}}>
            <Text style={{ marginHorizontal:30, fontSize:20, fontWeight:'bold', color:'black'}}>{params.myUser.languageLearning}: {this.state.translation}</Text>
            <Text style={{ marginHorizontal:30, fontSize:20, fontWeight:'bold', color:'black'}}>{params.myUser.languageNative}: {this.state.realword}</Text>
          </View>

        </ElevatedView>
      </View>
    );
  }

  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    
    return (
      <KeyboardAwareScrollView style = {{backgroundColor:'#C3E3E4'}}>
        {this.renderContent()}
        <Modal
            animationType="slide"
            transparent={true}
            isVisible={this.state.modalVisible}
            onRequestClose={() => {
            alert('Modal has been closed.');
        }}>
            {this.renderModalContent()}
        </Modal>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
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
};

export default WriteTheImageScreen;