import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import {CheckBox} from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import { Button, Slider, Icon } from 'react-native-elements';
import { CustomHeader} from './common/CustomHeader';
import ElevatedView from 'react-native-elevated-view'
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showMessage, hideMessage } from "react-native-flash-message";
import { strings } from '../../locales/i18n';

class VisualAwarenessScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Spatial/Linguistic',
      headerTitle: <CustomHeader title={strings('AllGames.visual_awareness')} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }
  state = { words: [''], index: 0, topicIndex: 0, a: [''], PICarray: [], k: 0, temp: '', result: '', allCorrect: 0, max: 5, modalVisible: false};

  // componentWillMount() {  }

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

  changeWord(a, topicwords) {

    const { params } = this.props.navigation.state;
    const {currentUser} = firebase.auth();

    this.setState({WordToGuess:a[this.state.k]});

    var shuffledTopicWords = this.shuffle(topicwords);


    if (this.state.k < this.state.max) {

      firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}/${a[this.state.k]}`).once("value", snapshot => {
        
        var trueResult = snapshot.val(); 

        var result = trueResult.word;

        var index = shuffledTopicWords.indexOf(a[this.state.k]);
        if (index > -1) {
          shuffledTopicWords.splice(index, 1);
        }

        // console.log('REZULTATAS ! ' + result);
        // console.log(shuffledTopicWords);


        this.setState({result});

        firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}/${shuffledTopicWords[0]}`).once("value", snapshot => {

          var firstWord = snapshot.val();

          firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}/${shuffledTopicWords[1]}`).once("value", snapshot => {

            var secondWord = snapshot.val();
  
            firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}/${shuffledTopicWords[2]}`).once("value", snapshot => {

              var thirdWord = snapshot.val();

              console.log(shuffledTopicWords);
              console.log(firstWord);
              console.log(secondWord);
              console.log(thirdWord);

              var obj = [];

              if(trueResult.hasOwnProperty("url2")){
                obj[result] = trueResult.url2;
              } else {
                obj[result] = trueResult.url;
              }

              if(firstWord.hasOwnProperty("url2")){
                obj[firstWord.word] = firstWord.url2;
              } else {
                obj[firstWord.word] = firstWord.url;
              }

              if(secondWord.hasOwnProperty("url2")){
                obj[secondWord.word] = secondWord.url2;
              } else {
                obj[secondWord.word] = secondWord.url;
              }

              if(thirdWord.hasOwnProperty("url2")){
                obj[thirdWord.word] = thirdWord.url2;
              } else {
                obj[thirdWord.word] = thirdWord.url;
              }

              var arfirstWord = firstWord.word;
              var arsecondWord = secondWord.word;
              var arthirdWord = thirdWord.word;

              var newArray = [result, arfirstWord, arsecondWord, arthirdWord];
              this.shuffle(newArray);
              var b = newArray; 

              // console.log(obj);
              // console.log(b);

              this.setState({words:b})
              this.setState({PICarray:obj});
    
            });
  
          });

        });



        // firebase.database().ref(`/Vocabulary${params.myUser.languageNative}${params.myUser.languageLearning}`).once("value", snapshot => {
        

        //   const myVoc = snapshot.val(); 
        //   // console.log(myVoc); 
        //   const elemListLength = snapshot.numChildren();
    
        //   var randomizeIt = Math.floor(Math.random() * elemListLength);
    
        //   var elem1 = myVoc[Object.keys(myVoc)[randomizeIt]];
        //   if (elemListLength > 1) {
        //       do {
        //         var randomizeIt = Math.floor(Math.random() * elemListLength);
        //         var elem2 = myVoc[Object.keys(myVoc)[randomizeIt]];
        //         var randomizeIt = Math.floor(Math.random() * elemListLength);
        //         var elem3 = myVoc[Object.keys(myVoc)[randomizeIt]];
    
        //       } while(elem1 == elem2 || elem1 == elem3 || elem2 == elem3);
        //   }
        //   var elem1word = elem1.word;
        //   var elem2word = elem2.word;
        //   var elem3word = elem3.word;

        //   var obj = [];
        //   obj[result] = trueResult.url;
        //   obj[elem1word] = elem1.url;
        //   obj[elem2word] = elem2.url;
        //   obj[elem3word] = elem3.url;
        

        //   var newArray = [result, elem1word, elem2word, elem3word];
        //   // var newArrayPIC = [trueResult, elem1, elem2, elem3];
        //   // var car = {type:"Fiat", model:"500", color:"white"};

        //   // var PICarray = {result:trueResult.url, elem1word:elem1.url, elem2word:elem2.url, elem3word:elem3.url};    
         
        //   var b = this.shuffle(newArray);
        //   this.setState({words:b})
        //   this.setState({PICarray:obj});
        
        
        // });

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
    var topicwords = params.topicwords
    // console.log(params.topicwords);

    if (a.length > 5) {
      a = a.slice(0,5);
      this.setState({max:5});
      this.setState({a});
      this.setState({topicwords});
    } else {
      this.setState({max:a.length});
      this.setState({a});
      this.setState({topicwords});
    }

    // console.log(a);

    this.changeWord(a, topicwords);

  }

  CheckIfCorrect(word) {
    var kelintas = this.state.k + 1;
    // console.log('KELINTAS YRA: ' + kelintas);

    // console.log('ATSAKYMAS +++++++++ ' + this.state.result);
    // console.log('SPETAS +++++++++ ' + word);

    if (this.state.result == word) {
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

    this.setState({
      k:kelintas
  }, () => {
    this.changeWord(this.state.a, this.state.topicwords);
  });

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
            <Text style={{ marginVertical:45, fontSize:20, fontWeight:'bold', color:'black'}}>{this.state.WordToGuess}</Text>
          </View> */}

          <View style={{width:'100%',height:100, justifyContent:'center', textAlign: "left"}}>
            <Text style={{ marginHorizontal:30, fontSize:20, fontWeight:'bold', color:'black'}}>{params.myUser.languageNative}: {this.state.WordToGuess}</Text>
            <Text style={{ marginHorizontal:30, fontSize:20, fontWeight:'bold', color:'black'}}>{params.myUser.languageLearning}: {this.state.result}</Text>
          </View>

        </ElevatedView>
      </View>
    );
  }

  renderContent() {
    const { navigate } = this.props.navigation;
    // const {currentUser} = firebase.auth();
    // console.log(params);

    var obj = this.state.PICarray;
    // console.log(obj[biblioteca]);
    

    switch (this.state.k) {
      case this.state.max: 
        return (
          // <View style={{padding:10}}>
          //   <Text>Thanks for playing!</Text>
          //   <Text>You earned {this.state.allCorrect} xp</Text>
          //   <Text>{"\n"}</Text>
          //   <Button 
          //     title='Exit Game'
          //     onPress={() => navigate('Start')}/>
          // </View>
        <View style={{width:'100%',height:'100%', paddingHorizontal:30, paddingTop:15, backgroundColor:'#C3E3E4'}}>
          <View style={{ width:'100%',height:'80%', flex: 1, justifyContent:'center', alignItems:'center' }} >
            <Text style={{ fontSize:30, fontWeight:'bold', color:'#FB5A3A', marginTop:20}}>{strings('GamesCommon.thanks_for')}</Text>
            <Text style={{ marginTop:27, fontSize:24, color:'#2496BE'}}>{strings('GamesCommon.you_earned', { name:this.state.allCorrect})}</Text>
          </View>
          <View style={{width:'100%', height:45}}></View>
          <View style={{ width:'100%',height:'40%', justifyContent:'flex-start', alignItems:'center'}} >
            <View style={{ width:'96%',height:'40%',}} >
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
            <TouchableOpacity style={{ marginBottom:6, width:'100%', justifyContent:'center',alignItems:'center',  backgroundColor:'#FF7F00'}}
              onPress={() => {
                this.setModalVisible(true);
              }}>
              <Text style={{fontSize:24, fontWeight:'bold',color:'white'}}>{this.state.result}</Text>
            </TouchableOpacity>
            <View style={{
              flexDirection:'row',
              flexWrap:'wrap',
              width:'100%',
              aspectRatio:1,
            }}>
              {this.state.words.map((word, index) => (
              <View style={{
                width:'50%',
                aspectRatio:1,
                paddingTop: index < 2  ? 0:3,
                paddingBottom: index < 2  ? 3:0,
                paddingLeft: (index % 2 ) == 1 ? 3:0,
                paddingRight: (index % 2 ) == 0 ? 3:0,
              }}>
                <TouchableOpacity
                  style={{
                    width:'100%',
                    height:'100%',
                    aspectRatio:1,
                  }} key={index} onPress={() => this.CheckIfCorrect(word)}>
                  {obj[word] &&
                  <Image
                    style={{
                      alignSelf: 'center',
                      height: '100%',
                      width: '100%',
                      borderWidth: 1,
                      //borderRadius: 95
                    }}
                    source={{uri:obj[word]}}
                    // resizeMode="stretch"
                  />
                  }
                </TouchableOpacity>
              </View>
             ))} 
            </View>
             
            <View style={{  marginTop:20, flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
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
                  onPress={() =>this.setModalVisible(true)}/>
            </View>
            {/* <TouchableOpacity><Text>{this.state.words[0]}</Text></TouchableOpacity>
            <TouchableOpacity><Text>{this.state.words[1]}</Text></TouchableOpacity>
            <TouchableOpacity><Text>{this.state.words[2]}</Text></TouchableOpacity>
            <TouchableOpacity><Text>{this.state.words[3]}</Text></TouchableOpacity> */}
            {/* <Text>--------------------------------</Text>
            <Text>{this.state.temp}</Text> */}

            <Modal
                animationType="slide"
                transparent={true}
                isVisible={this.state.modalVisible}
                onRequestClose={() => {
                alert('Modal has been closed.');
            }}>
                {this.renderModalContent()}
            </Modal>

          </View>
        );
    }
  }

  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    
    return (
      <KeyboardAwareScrollView style = {{backgroundColor:'#C3E3E4'}}>
        {this.renderContent()}
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

export default VisualAwarenessScreen;