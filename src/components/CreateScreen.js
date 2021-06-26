import React, { Component } from 'react';
import { Text, TextInput, View, ScrollView, TouchableOpacity, ListView, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import {CheckBox, ButtonGroup, Icon} from 'react-native-elements';
import { Card, CardSection, Input, Spinner } from './common';
import VisualAwarenessScreen from './VisualAwarenessScreen';
import MultiSelect from 'react-native-multiple-select';
import { Games } from '../static/entries';
import { ThemeProvider, Button } from 'react-native-material-ui';
import MultiSelectDropDown from './common/MultiSelectDropDown';
import { CustomHeader } from './common/CustomHeader';
import ElevatedView from 'react-native-elevated-view'
import Modal from "react-native-modal";
import { strings } from '../../locales/i18n';

import * as TopicNames from '../static/TopicNames.json';

class CreateScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Welcome',
      headerTitle: <CustomHeader title={strings('Create.create_game')} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { Topics: [], selectedGames:[], selectedItems: [], index: 0, topicIndex: undefined, WordsIndex: 0, WordsIndexes: [0], selected: [0], WordsFromTopic: [''], dataSource: ds.cloneWithRows([]), SecondmodalVisible: false };
  }

  componentDidMount() {
    const {currentUser} = firebase.auth();
    const { params } = this.props.navigation.state;

    var self = this;
      // console.log(data);
      
      firebase.database().ref(`/topics${params.myUser.languageNative}`).once("value", snapshot => {
        const mytopics = snapshot.val();
        // console.log('-----------------')
        // console.log(mytopics);
        var newData = [];
        for (var property in mytopics) {
          // console.log(mytopics[property]);
          var myObj = {};
          myObj.id = property;
          myObj.words = mytopics[property];
          myObj.title = property;
          // self.capitalizeFirstLetter(property);
          if (params.myUser.languageLearning == 'PT') {
            myObj.name = property; 
          } else {
            myObj.name = TopicNames[property]; 
          }          

          newData.push(myObj)
        }
        // console.log(newData);
        self.setState({Topics:newData});

      })
      .catch(() => {
        console.log('NIEKO NEGAVAU!');
      });
    
  }

  
  onSelectedItemsChange = selectedItems => {
    // console.log('Selected Items: ', selectedItems);
    this.setState({ selectedItems });
    var allTopics = this.state.Topics;
    let obj = allTopics.find(o => o.title == selectedItems[0]);
    var allWords = obj.words;
    var RealTopicTitle = obj.title;

    this.setState({RealtTitleTextToText:RealTopicTitle});
    this.setState({WordsFromTopic:allWords});
  };

  onSelectedGameChange = selectedGames => {
    // console.log('Selected Game:', selectedGames);
    this.setState({ selectedGames });
  };
  
  updateIndex = (index) => {
    this.setState({index})
  }

  updatetopicIndex = (topicIndex) => {
    const { params } = this.props.navigation.state;
    this.setState({topicIndex})

    // console.log(topicIndex);
    var self = this;

    firebase.database().ref(`/topics${params.myUser.languageNative}`).once("value", snapshot => {
      const mytopics = snapshot.val();

      // console.log(mytopics[Object.keys(mytopics)[topicIndex]]);
      
      this.setState({
        WordsFromTopic: mytopics[Object.keys(mytopics)[topicIndex]]
      })

      // console.log(WordsFromTopic[2]);

      // console.log(snapshot.val());

      // this.setState({
      //   WordsList: 
      // });
  

   });

  }

  updateWordsIndex = (WordsIndex) => {

    this.setState({WordsIndex})
  }

  ChooseWord = (word) => {
    // var lukas = this.state.selectedWords.push('lukas');
    // console.log(this.state.selectedWords)
    // // console.log(selectedWords);
    // this.setState({
    //   selectedWords: lukas
    // })

    // this.setState({
    //   selectedWords: this.state.selectedWords.push(word)
    // })

    const textArray = this.state.dataSource._dataBlob.s1;

    if (textArray.includes(word)) {
      return false;
    } else {
      textArray.push(word);
      this.setState(() => ({
        dataSource: this.state.dataSource.cloneWithRows(textArray),
        inputValue: '',
      }));
    }
  }

  _handleDeleteButtonPress = (id) => {
    this.setState((a) => {
      const newItem = a.dataSource._dataBlob.s1.filter((item, i) => (parseInt(id) !== i));
      return {
        dataSource: this.state.dataSource.cloneWithRows(newItem),
      }
    });
  }


  StartGame() {
    const { navigate } = this.props.navigation;
    if (this.state.selectedGames[0] == "VisualAwareness") {
      navigate(this.state.selectedGames[0], { words: this.state.dataSource._dataBlob.s1, myUser:this.state.myUser, topicwords: this.state.WordsFromTopic})
    } else {
      navigate(this.state.selectedGames[0], { words: this.state.dataSource._dataBlob.s1, myUser:this.state.myUser, TextToTextTitle:this.state.RealtTitleTextToText })
    }
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({myUser:params.myUser});

    // if()

    if (params.myUser.languageLearning == 'PT') {
      Games.forEach(function(oneGame) {
        oneGame.name = oneGame.title;
      })
    } else {
      Games.forEach(function(oneGame) {
        oneGame.name = oneGame.PTtitle;
      })
    }

    

  }

  onSendToFriend() {
    const { friendsNick } = this.state;

    var invitation = {
      game: this.state.selectedGames[0],
      words: this.state.dataSource._dataBlob.s1,
      myUser: this.state.myUser,
      TextToTextTitle: this.state.RealtTitleTextToText,
      WordsFromTopic: this.state.WordsFromTopic
    }

    var self = this;

    firebase.database().ref().child('users').orderByChild('username').equalTo(`${friendsNick}`)
        .once('value', function(snap) {

          // console.log(snap);

          if (snap.val() == undefined) {
            self.setState({error:'There is no user with the provided email!'})
          } else {
            // var userId = snap.node_.children_.root_.key;
            var userId = snap.node_.children_.root_.key;
            // console.log(userId);

            firebase.database().ref(`/users/${userId}/Invitations`)
              .push(invitation)
              .then(() => {
                console.log('VISKAS KO REIKIA - TAI GERAI NU');
                self.setSecondModalVisible(false);
                self.setState({selectScreenPhase:0})
                console.log('VISKAS KO REIKIA - TAI GERAI NU 2222');
                
            })
            .catch(() => {
              // self.setState({selectScreenPhase:1})
              // console.log('VISKAS KO REIKIA - TAI GERAI NU');
              // self.setSecondModalVisible(!this.state.SecondmodalVisible);
              console.log('IRASO, BET EINA I CATCH :(')
            })
      }
    })
  }

  setSecondModalVisible(visible) {
    this.setState({SecondmodalVisible: visible});
  }

  render() {
    // The screen's current route is passed in to `props.navigation.state`:
    const { selectedItems, selectedGames } = this.state;
    return (
        <ThemeProvider>
          <View style={{
            width:'100%',
            height:'100%',
            backgroundColor:'#bfe3ed',
          }}>
            <ScrollView style={styles.container}>
                <MultiSelectDropDown
                    single
                    items={Games}
                    uniqueKey="screenTitle"
                    onSelectedItemsChange={this.onSelectedGameChange}
                    selectedItems={selectedGames}
                    searchInputStyle={styles.searchButtonStyle}
                    searchInputPlaceholderText=''
                    selectText={strings('Create.select')}
                />
                <View>
                    {
                        this.multiselect
                        ? 
                        this.multiselect.getSelectedItemsExt(selectedGames)
                        :
                        null
                    }
                </View>

                <Text></Text>

                <Text></Text>

                <MultiSelectDropDown
                    single
                    items={this.state.Topics}
                    uniqueKey="id"
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={selectedItems}
                    searchInputPlaceholderText=''
                    selectText={strings('Create.select')}
                />
                <View>
                    {
                        this.multiselect
                        ? 
                        this.multiselect.getSelectedItemsExt(selectedItems)
                        :
                        null
                    }
                </View>

                <Text></Text>

      {/* <ButtonGroup
        selectedBackgroundColor="green"
        onPress={this.updatetopicIndex}
        selectedIndex={this.state.topicIndex}
        buttons={['Animals 1', 'Animals 2', 'Animals 3', 'Animals 3', 'Animals 3', 'Animals 3', 'Animals 3', 'Animals 3', 'Animals 3', 'Animals 3']}
        /> */}
            <CardSection style={{
            borderBottomWidth: 1,
            paddingHorizontal: 10,
            backgroundColor: 'transparent',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            borderColor: '#C3E3E4',
            position: 'relative'
            }}>
                <View style={{
                    width:'100%'
                }}>
                    <View style={{
                        width:'100%',
                        backgroundColor:'#FF7F00'
                    }}>
                        <Text style={{
                            fontSize:20,
                            fontWeight:'bold',
                            color:'white',
                            marginLeft:30
                        }}>
                            {strings('Create.words')}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, backgroundColor:'white' }}>
                        <View style={{ paddingBottom:4, width:'50%', justifyContent:'flex-start', alignItems:'center', borderRightWidth:1 }}>
                            <Text style={{ marginTop:8, fontSize:18}}>{strings('Create.words_to')}</Text>

                            {this.state.WordsFromTopic.map((word, index) => (
                                <TouchableOpacity key={index} onPress={() => this.ChooseWord(word)}>
                                    <Text style={{marginVertical:2,}}>
                                        {word}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                        </View>

                        <View style={{ paddingBottom:4, width:'50%', justifyContent:'flex-start', alignItems:'center' }}>
                            <Text style={{marginTop:8, fontSize:18}}>{strings('Create.chosen_words')}</Text>

                            <ListView
                                // style={styles.listView}
                                dataSource={this.state.dataSource}
                                renderRow={(rowData, sectionID, rowID) => {
                                    const handleDelete = () => {
                                        return this._handleDeleteButtonPress(rowID);
                                    }
                                    return (
                                        <TouchableOpacity onPress={handleDelete}>
                                            <Text>{rowData}</Text>
                                            {/* <Button
                                                title="Delete"
                                                onPress={handleDelete}
                                                style={styles.deleteButton}
                                                /> */}
                                        </TouchableOpacity>
                                    );
                                }
                                }
                            />

                        </View>

                    </View>
                </View>
              </CardSection>
          <View style={{
              flex:1,
              padding:20,
          }}>
          <Button text={strings('Create.start')} style={{container: {
              height: 45,
              backgroundColor: '#FF7F00',
              padding: 0,
              width: '100%',
            },
            text: {
              fontSize: 20,
              color: "#fff",
            }}}
              upperCase={false}
              onPress={this.StartGame.bind(this)} />
          </View>

        {/* <Button 
        title="Start"
        onPress={this.StartGame.bind(this)}
        /> */}
          <View style={{
              flex:1,
              padding:20,
          }}>
          <Button text={strings('Create.invite')} style={{container: {
              height: 45,
              backgroundColor: '#FF7F00',
              padding: 0,
              width: '100%',
            },
            text: {
              fontSize: 20,
              color: "#fff",
            }}}
              upperCase={false}
              onPress={() => this.setSecondModalVisible(!this.state.SecondmodalVisible)} />
          </View>
          <View style={{width:'100%', height:50}}></View>
        {/* <Button 
        title="Invite"
        onPress={() => this.setSecondModalVisible(!this.state.SecondmodalVisible)}
        /> */}
        <Modal
            backdropColor={'black'}
            backdropOpacity={0.5}
            animationType="slide"
            transparent={true}
            isVisible={this.state.SecondmodalVisible}
            onRequestClose={() => {
              this.setSecondModalVisible(!this.state.SecondmodalVisible);
            }}>
            <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                  {strings('CreateInvite.invite_your')}
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                    this.setSecondModalVisible(!this.state.SecondmodalVisible);
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
              <View style={{width:'100%',justifyContent:'center', alignItems:'center'}}>
                <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center',}}></View>
                  <View style={{width:'100%', height:50, justifyContent:'center', alignItems:'center',}}>
                    <TextInput
                      style={{ fontSize:18, width:'70%',backgroundColor:'#FFFFFF', borderRadius:3, borderWidth:1, borderColor:'#E0E0E0' }}
                      placeholder={strings('CreateInvite.friends_nickname')}
                      placeholderTextColor = "#D4D4D4"
                      value={this.state.friendsNick}
                      onChangeText={friendsNick => this.setState({ friendsNick })}
                    />
                    {/* <Input
                      placeholder="Friend's nickname"
                      // label="Username"
                      value={this.state.friendsNick}
                      onChangeText={friendsNick => this.setState({ friendsNick })}
                    /> */}
                  </View>          
                  <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center'}}></View>
                  <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
                    <View style={{width:200,}}>
                      <Button text={strings('CreateInvite.send')}
                        style={{
                          container: {
                          height: 45,
                          backgroundColor: '#2496BE',
                          padding: 0,
                          width: '100%',
                          },
                          text: {
                            fontSize: 20,
                            color: "#fff",
                          }
                        }}
                        upperCase={false}
                        onPress={this.onSendToFriend.bind(this)} />
                    </View>
                  </View>
                  <View style={{width:'100%', height:20, justifyContent:'center', alignItems:'center'}}></View>
              </View>
            </ElevatedView>
            </View>
          </Modal>
       
          


      {/* <ButtonGroup
        selectedBackgroundColor="green"
        selectMultiple
        onPress={WordsIndex => {
          this.setState({ WordsIndex });
        }}
        // selectedIndex={this.state.WordsIndex}
        selectedIndexes={this.state.WordsIndexes}
        buttons={this.state.wordsList}
        
        containerStyle={{height: 30}} /> */}



      </ScrollView>
      </View>
      </ThemeProvider>
    );
  }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#bfe3ed',
        paddingTop: 20,
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
  },
  searchButtonStyle: {
    backgroundColor: '#FF7F00',
    color: '#fff',
    paddingLeft: 30,
  },
};

export default CreateScreen;