import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Button,
  TextInput,
  SafeAreaView, ScrollView
} from "react-native";
import { Icon } from 'react-native-elements';
import { StackNavigator } from "react-navigation";
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "firebase";
import Modal from "react-native-modal";
import { PowerTranslator, ProviderTypes, Translation } from 'react-native-power-translator';

import ContainerStyles, { colors } from '../styles/index.style';
import ElevatedView from 'react-native-elevated-view';
import { Dimensions } from 'react-native';
import { strings } from '../../locales/i18n';
// import Mystyles from '../styles/SliderEntry.style';
// import ContainerStyles, { colors } from '../styles/index.style';
// import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';


var uid;
var Filter = require('bad-words'),
    filter = new Filter();
    filter.addWords(['Anus', 'Baba-ovo', 'Babaca', 'Babaovo', 'Bacura',	'Bagos', 'Baitola', 'Bebum', 'Bicha',	 'Bisca', 'Boazuda', 'Boceta', 'Boco', 'Boiola', 'Boquete', 'Bosseta', 'Bostana', 'Buca', 'Buceta', 'Bunda', 'Bunduda', 'Busseta', 'Caga', 'Cagado', 'Cagao', 'Cagona', 'Caralho',	'Checheca', 'Chereca', 'Chibumba', 'Chibumbo', 'Chifruda', 'Chifrudo', 'Chochota', 'Chota', 'Chupada', 'Chupado', 'Clitoris', 'Cocaina', 'Coco', 'Corna', 'Corno', 'Cornuda', 'Cornudo', 'Cretina', 'Cretino', 'Cu', 'Culhao', 'Curalho', 'Cuzao', 'Cuzuda', 'Cuzudo', 'Debiloide', 'Defunto', 'Demonio', 'Difunto', 'Fedida', 'Feiosa', 'Felação', 'Fenda', 'Foda', 'Fodao', 'Fode', 'Fodida', 'Fodido', 'Fornica', 'Fudecao', 'Fudendo', 'Fudida', 'Fudido', 'Imbecil', 'Manguaa', 'Masturba', 'merda', 'Nadega', 'Olhota', 'Pica', 'Picao', 'Piru', 'Porra', 'Prost-bulo', 'Prostibulo', 'Prostituta', 'Prostituto', 'Puta', 'Puto', 'Puxa-saco', 'Puxasaco', 'Rabao',	'Rabo',	'Racha', 'Rachada', 'Rachadao', 'Rachadinha', 'Rachadinho', 'Rachado', 'Retardada', 'Retardado', 'Rola', 'Rosca', 'Sacana', 'Safada', 'Safado', 'Sapatao', 'Siririca', 'Tarada', 'Tarado', 'Testuda', 'Tezao', 'Tezuda', 'Tezudo', 'Trouxa', 'Troxa', 'Xana', 'Xaninha',	'Xavasca', 'Xerereca',	'Xexeca', 'Xibumba',	'Xochota', 'Xota', 'Xoxota']);


class ChatTitle extends React.Component {

  render() {
    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    middleViewWidth = viewportWidth - 56*2;
    return (
      <View style={{flexDirection:'row',flex:1}}>
      <View style={{width:middleViewWidth, justifyContent:'center', alignItems:'center'}}>
      <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>
        {this.props.title}
      </Text>
      </View>
      <View style={{flex:1, flexDirection:'row',flex:2, justifyContent:'flex-end',alignItems:'center', paddingRight:15, backgroundColor:'transparent'}}>
      </View>

      </View>
    );
  }
}

export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chat',
      headerTitle: <ChatTitle title={strings('Chat.Chat')} navigation={navigation}/>,
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
    this.user = firebase.auth().currentUser;

    const { params } = this.props.navigation.state;
    uid = params.uid;
    // name = params.name;
    // email = params.email;
    var self = this;
    this.state = {
      messages: [],
      visibleModal: null,
      isModalVisible: false,
      languageCode: 'en',
      message: {text:''}
    };
    // langNative = this.getRef().child("languageNative");
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
      var json = snapshot.val();
      langNative = json.languageNative;
      var freeTranslations = json.freeTranslations;

      if (json.premium != undefined) {
        self.setState({paid:true});
      } else {
        self.setState({paid:false});
      }

      self.setState({freeTranslations:freeTranslations})

      // console.log(langNative);

      self.setState({languageCode:langNative});

    });

      this.user = firebase.auth().currentUser;
      // console.log("User:" + uid);
      state = { visibleModal: null, isModalVisible: false }

      this.chatRef = this.getRef().child("chat/" + this.generateChatId());
      
      this.chatRefData = this.chatRef.orderByChild("order");
      this.onSend = this.onSend.bind(this);
      // this.renderFooter = this.renderFooter.bind(this);
      this.longPress = this.longPress.bind(this);
    // var langCode = langNative.toLowerCase();

    
    // this.renderBubble = this.renderBubble.bind(this);
    // this.renderSystemMessage = this.renderSystemMessage.bind(this);
  }

  // state = { visibleModal: null, isModalVisible: false }

  //generate ChatId works cause when you are the user sending chat you take user.uid and your friend takes uid
  // when your friend is using the app to send message s/he takes user.uid and you take the uid cause you are the friend 
  
  longPress(context, message) {
    
    var free = this.state.freeTranslations + 1;

    firebase.database().ref(`/users/${this.user.uid}`)
      .update({freeTranslations:free})

      .then(() => {

        this.setState({message});
        this.setState({ visibleModal: 6 });
        this.setState({freeTranslations:free});
  
      })
      .catch(() => {
          console.log('could not update the profile values!')
      })
    
    // this.changeLanguage('pt');
    // console.log(context);
    // console.log('---------------------------------------');
    // console.log(message);
  }

  changeLanguage(languageCode) {
    this.setState({ languageCode: languageCode });
}

  _renderModalContent() {

    if (this.state.freeTranslations > 10 && this.state.paid == false) {
      return (
        <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
                 <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
                  <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                    <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                      <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                        {/* Translation */}
                      </Text>
                    </View>
                    <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                      <TouchableOpacity onPress={() => {
                        this.setState({ visibleModal: false });
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
                  <View style={{width:'100%', padding:20, alignItems:'center', justifyContent:'center' }}>
                  <View>
                    <Text>You already used your 10 translations! Subscribe to our Premium package to have unlimited translations!</Text>
                  </View>
                </View>
          </ElevatedView>
        </View>
      )
    }

    else {
      return (
    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
             <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'100%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                    {/* Translation */}
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                        this.setState({ visibleModal: false });
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
              <View style={{width:'90%', padding:20, alignItems:'center', justifyContent:'center' }}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={{marginLeft:30, fontSize:16, fontWeight:'bold', color:'#F68D3D'}}>
                    Original:
                  </Text>
                  <Text style={{marginLeft:4, fontSize:15, color:'#F68D3D'}}>{this.state.message.text}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{marginLeft:55, fontSize:16, fontWeight:'bold', color:'#81CBEB'}}>
                    Translation:
                  </Text>
                  <PowerTranslator style={{marginLeft:5,fontSize:15, color:'#81CBEB'}} text={this.state.message.text} />
                </View>
              <View>
                {!this.state.paid && <Text>Free translations: {this.state.freeTranslations}/10</Text>}
              </View>
            </View>
      </ElevatedView>
    </View>
    )
    }

    
  };

  renderFooter(props) {
    // if (this.state.typingText) {
      return (
        <Modal
            backdropColor={'black'}
            backdropOpacity={0.5}
            animationType="slide"
            transparent={true}
          isVisible={this.state.visibleModal === 6}
          onBackdropPress={() => this.setState({ visibleModal: null })}
        >
          {this._renderModalContent()}
        </Modal>
      );
    // }
    // return null;
  }

  generateChatId() {
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }

  getRef() {
    return firebase.database().ref();
  }

  renderBubble(props) {
    return (
      <Modal
          isVisible={this.state.visibleModal === 6}
          onBackdropPress={() => this.setState({ visibleModal: null })}
        >
          {this._renderModalContent()}
        </Modal>
    );
  }

  renderSystemMessage(props) {
    return (
      <Modal
          isVisible={this.state.visibleModal === 6}
          onBackdropPress={() => this.setState({ visibleModal: null })}
        >
          {this._renderModalContent()}
        </Modal>
    );
  }

  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        //var name = child.val().uid == this.user.uid ? this.user.name : name1;
        items.push({
          _id: child.val().createdAt,
          text: child.val().text,
          createdAt: new Date(child.val().createdAt),
          user: {
            _id: child.val().uid
            //avatar: avatar
          }
        });
      });

      this.setState({
        loading: false,
        messages: items
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.chatRefData);
    
    const {currentUser} = firebase.auth();

    var ChatId = this.generateChatId();
    // var SystemChat = this.user.uid + '-' + uid;
    console.log(ChatId);
    // if (ChatId == SystemChat) {
      // firebase.database().ref(`/users/${currentUser.uid}`)
      // .update({xp:userXP})

      var query = firebase.database().ref().child('chat').child(ChatId).orderByChild('fuid').equalTo(currentUser.uid);

      if (query != undefined) {
        query.on('value', function(snapshot) {
          snapshot.forEach(function(SystemSnapshot) {
              console.log(SystemSnapshot.val());
              SystemSnapshot.ref.update({ seen: true });
          });
        });
      }

      var query2 = firebase.database().ref().child('users').child(this.user.uid).child('messages').child(uid);

      console.log(query2);

      if (query2 != undefined) {
        query2.on('value', function(snapshot2) {
          // snapshot2.forEach(function(SystemSnapshot2) {
              // console.log(SystemSnapshot2.val());
              snapshot2.ref.update({ seen: true });
          // });
        });
      }
      

      // firebase.child(`chat/${ChatId}`).on('value', function(snapshot) {
      //   console.log(snapshot.ref());
      //   snapshot.ref()
      //   // .orderByChild("id")
      //   // .equalTo("ID_OF_THE_USER")
      //   .update({seen: true}); // or snapshot.ref if you're in SDK 3.0 or higher
      // });

    // }

  }

  componentWillUnmount() {
    this.chatRefData.off();
  }

  onSend(messages = []) {
    // this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    messages.forEach(message => {
      //var message = message[0];
      var now = new Date().getTime();
      var FilteredMessage = filter.clean(message.text);

      firebase.database().ref(`/users/${uid}/messages/${this.user.uid}`)
      .set({message:FilteredMessage, seen:false, uid:this.user.uid})
      .then(() => {

        this.chatRef.push({
          _id: now,
          text: FilteredMessage,
          createdAt: now,
          uid: this.user.uid,
          fuid: uid,
          order: -1 * now,
          seen: false
        });

      })
      .catch(() => {
        console.log('could not update the profile values!')
      })
      
      // console.log(now);
      
    });
  }

  renderCustomView(props) {
    return (
        <Modal
            isVisible={this.state.visibleModal === 6}
            onBackdropPress={() => this.setState({ visibleModal: null })}
          >
            {this._renderModalContent()}
          </Modal>
    );
  }

  render() {
    // const styles = this.getStyles();
    Translation.setConfig(ProviderTypes.Google, 'AIzaSyBcV8QCqM7YFYu6c9_6mjOt9bHDxo_F6sY', this.state.languageCode);

    return (
      <View style={{flex: 1, backgroundColor:'#D0ECF6'}}>
      <Modal
            isVisible={this.state.visibleModal === 6}
            onBackdropPress={() => this.setState({ visibleModal: null })}
          >
            {this._renderModalContent()}
          </Modal>
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.user.uid
        }}
        // renderFooter={this.renderFooter}
        onLongPress={this.longPress} 
        onPress={this.longPress}
        placeholder={strings('Chat.type_a')}
        // renderBubble={this.renderBubble}
        // renderSystemMessage={this.renderSystemMessage}
        // renderCustomView={this.renderCustomView}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
});
