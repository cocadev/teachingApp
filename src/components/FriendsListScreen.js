import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ListView, Image, Button, TextInput, ScrollView } from 'react-native';
import firebase from 'firebase';
import Modal from "react-native-modal";
import { StackNavigator } from 'react-navigation';
import Spinner from "react-native-loading-spinner-overlay";
import ElevatedView from 'react-native-elevated-view';
import { SearchBar, Icon ,Avatar} from 'react-native-elements'
import { CustomHeader} from './common/CustomHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Autocomplete from 'react-native-autocomplete-input';
import { showMessage, hideMessage } from "react-native-flash-message";
// import { Card, CardSection, Input } from './common';
// import { Button } from './common';
import Chat from "./Chat";
import { strings } from '../../locales/i18n';

class FriendsListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: strings('FriendsList.friends_list'),
      headerTitle: <CustomHeader title='Friends List' navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }
    state = {
        name: "",
        uid: null,
        email: "",
        searchText: ''
      };
      constructor(props) {
        super(props);
        var user = firebase.auth().currentUser;
        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
          }),
          MydataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
          }),
          MySearchFriends: [],
          // new ListView.DataSource({
          //   rowHasChanged: (row1, row2) => row1 !== row2
          // }),
          loading: true,
          films: [],
          query: '',
          blockedOn: false,
          openModalForBLocking: false,
          blockthisUser: ''  
        };
        this.friendsRef = this.getRef().child("users");
        // this.BlockedfriendsRef = this.getRef().child("users").child(user.uid).child("blockedFriends");
      }

      findFilm(query) {
        if (query === '' || query.length <= 2) {
          return [];
        }
      
        const { films } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        // console.log(films.filter(film => film.username.search(regex) >= 0));
        var myfilms = films.filter(film => film.username.search(regex) >= 0);
        // this.setState({MySearchFriends:myfilms})
        return myfilms;
      }
    
      getRef() {
        return firebase.database().ref();
      }
    
      listenForItems(text) {
        var user = firebase.auth().currentUser;
        // var searchText = this.state.searchText;
        // console.log(text);
        // console.log(this.BlockedfriendsRef);
        console.log('LOADIN DRAUGELIUS');
        this.setState({loading:true});
        // friendsRef.on("value", snap => {
          if (text.length >= 3) {
            
          
          this.getRef().child("users").orderByChild("username").startAt(text).endAt(text).on('value', (snap) => {
            // get children as an array
            var items = [];
            snap.forEach(child => {
              // console.log(child);
              if (child.val().email != user.email && child.val().email != undefined)
                items.push({
                  name: child.val().username,
                  uid: child.val().uid,
                  email: child.val().email,
                  pic: child.val().myPic,
                  langNative: child.val().languageNative,
                  langLearning: child.val().languageLearning,
                  blockedBy: child.val().blockedBy,
                  age: child.val().age,
                  checkedMale: child.val().checkedMale,
                  premium: child.val().premium
                });
            });

            // console.log(items);
      
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(items),
              
              // blockedPeople: items.blockedBy,
              // MydataSource: this.state.dataSource.cloneWithRows(Myitems),
              loading: false
            });
          
        });

      } else {

        this.getRef().child("users").child(`${user.uid}`).child("friends").on('value', (snap) => {
          
          var Myitems = [];
          snap.forEach(child => {
              Myitems.push({
                name: child.val().username,
                uid: child.val().uid,
                email: child.val().email,
                pic: child.val().myPic,
                langNative: child.val().languageNative,
                langLearning: child.val().languageLearning,
                friend: true,
                blockedBy: child.val().blockedBy,
                age: child.val().age,
                checkedMale: child.val().checkedMale,
                premium: child.val().premium
              });
          });
    
          this.setState({
            MyblockedPeople: Myitems,
            // myBestFriends: items,
            // dataSource: this.state.dataSource.cloneWithRows(items),
            MydataSource: this.state.dataSource.cloneWithRows(Myitems),
            loading: false
          });
          
        });

      }

      }


    
      componentDidMount() {
        this.listenForItems('');
        var user = firebase.auth().currentUser;
        const { params } = this.props.navigation.state;

        // var myArray = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}];
        // console.log(myArray.find(x => x.id === '45'));

        this.setState({WholeUserObject:params.user});
        this.setState({user});
        const self = this;

        firebase.database().ref(`/users`).once("value", snap => {

          var results = snap.val();
          var allUsers = Object.values(results);
      
          self.setState({films:allUsers});
          
        })

      }

      blockFriend(rowData) {

        var user = firebase.auth().currentUser;
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        // console.log(rowData);
        
        var myCurrentFriends = this.state.myBestFriends;

        // for(var i = 0; i < myCurrentFriends.length; i++) {
          // if (myCurrentFriends[i].name == row.name) {
          //     break;
          // } else {
            
          var blockedById = user.uid;
            firebase.database().ref()
              // .push(user.uid)
              .child(`/users/${rowData.uid}/blockedBy/${blockedById}`)
              .set(user.uid)
              .then(() => {
                // const key = snap.key;
                // console.log(snap);
                var survey = firebase.database().ref(`/users/${user.uid}/friends`);    //Eg path is company/employee                
                survey.child(rowData.uid).remove()
                // PRIDETI user.uid i friends/rowData.uid/blocked, tada patikrint pirmam etape
                showMessage({
                  message: 'User has been blocked sucessfully',
                  description: 'Redirecting...',
                  type: "success",
                });

                this.setState({ openModalForBLocking: false });
                navigate('FriendsList', { user: params.user });
                

              this.setState({ loading: false })
    
            })
            .catch(() => {
              console.log('NEIRASE I DB !!!')
            })
          
          // }
        // }

      }

      unblockFriend(rowData) {
        // console.log(rowData);
        var user = firebase.auth().currentUser;
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        
        var survey = firebase.database().ref(`/users/${rowData.uid}/blockedBy`);    //Eg path is company/employee                
        survey.child(user.uid).remove()

        showMessage({
          message: 'User has been unblocked!',
          description: 'Redirecting...',
          type: "success",
        });

        // this.setState({ openModalForBLocking: false });
        navigate('FriendsList', { user: params.user });

      }

      checklastmessage(rowData) {
        const { params } = this.props.navigation.state;
        var myMessages = params.user.messages;

        // var myArray = [{'id':'73','foo':'bar'},{'id':'45','foo':'bar'}];
        let lastMessages = Object.keys(myMessages).map(key => myMessages[key]);
        // var lastMessages = params.user.messages;
        // console.log(lastMessages);
        var result = lastMessages.find(x => x.uid === rowData.uid);
        // console.log(result);

        if (result) {
          return (
            <Text>{result.message}</Text>
          )
        } else {
          return (
            <Text>No messages yet!</Text>
          )  
        }

      }    

    renderRow = rowData => {

        if (rowData.hasOwnProperty('friend')) {
          var star = 'star';
        } else {
          var star = 'star-o';
        }

        // console.log(rowData);

        var blockedUsers = rowData.blockedBy;
        // console.log(blockedUsers);

        if (Object.values(blockedUsers).indexOf(this.state.user.uid) > -1) {
          var itHasBlocked = true;
       } else {
          var itHasBlocked = false;
       }

      switch (itHasBlocked) {
        case true:
          return (
            <View style={{flexDirection:'row', height:120, borderBottomColor:'#BEE1EB', borderBottomWidth:1}}>
              <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                <View style={{width:60,height:60, justifyContent:'center', borderRadius:30, backgroundColor:'#84BCD5'}}>
                  <Image
                            source={{uri: rowData.pic}}
                            style={{width: 145, height: 200, alignSelf: 'center', borderRadius:100}}
                            resizeMode='contain'
                  />
                </View>
              </View>
              <View style={{flex:7, paddingTop:15, paddingRight:20}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
                  <Text style={{fontSize:18, color:'#BCBEC0', fontWeight:'bold'}}>{rowData.name}</Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <View>
                    <Text style={{fontSize:12, fontStyle:'italic', color:'#00A1AF'}}>(User has been blocked)</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Icon
                                name='block'
                                size={17}
                                color='#04A9D3'
                                onPress={() => this.unblockFriend(rowData)}
                    />
                  </View>
                </View>  
              </View>
            </View>
          // <Text>THIS USER WAS BLOCKED</Text>
          //   <TouchableOpacity
          //   onPress={() => {
          //     // console.log(rowData)
          //   }}
          // >
          //   <View style={styles.profileContainer}>
          //     <Text style={styles.profileName}>{rowData.name} (User has been blocked)</Text>

          //     <Icon
          //       name='block'
          //       color='#2496BE'
          //       onPress={() => this.unblockFriend(rowData)} />

          //   </View>
          // </TouchableOpacity>
          );
        case false:
          return (
            <TouchableOpacity
              style={{flexDirection:'row', height:120, borderBottomColor:'#BEE1EB', borderBottomWidth:1}}
              onPress={() => {
              name = rowData.name;
              email = rowData.email;
              uid = rowData.uid;
              langLearning = rowData.langLearning;
              langNative = rowData.langNative;
              this.props.navigation.navigate("Chat", {
                name: name,
                email: email,
                uid: uid,
                langNative: langNative,
                langLearning: langLearning
              });
            }}
          >
                      <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:60,height:60, justifyContent:'center', borderRadius:30, backgroundColor:'#84BCD5'}}>
                          <Image
                            source={{uri: rowData.pic}}
                            style={{width: 145, height: 200, alignSelf: 'center', borderRadius:100}}
                            resizeMode='contain'
                          />
                        </View>
                      </View>
                      <View style={{flex:7, paddingTop:15, paddingRight:20}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
                          <Text style={{fontSize:18, color:'#04A9D3', fontWeight:'bold'}}>{rowData.name}</Text>

                          {rowData.premium &&

                            <Icon
                              name='crown'
                              type='foundation'
                              color='#517fa4'
                              style={{marginLeft : 1, alignItems: 'flex-start'}}
                            />

                          }
                          <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:12, color:'#63B1DC'}}>Age: </Text>
                          <Text style={{fontSize:12, color:'#63B1DC'}}>{rowData.age}</Text>  
                          </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View>
                              <Text style={{fontSize:12, fontStyle:'italic', color:'#00A1AF'}}>Currently Learning:</Text>
                              <Text style={{fontSize:12, color:'#F15A29', fontWeight:'bold'}}>{rowData.langLearning}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              {/* <Text>{film.checkedFemale == true ? 'Female' : 'Male'}</Text> */}
                              <Icon
                                name='male'
                                size={20}
                                type='font-awesome'
                                color={(rowData.checkedMale == true) ? '#63B1DC':'#BEE1EB'}
                              />
                              <Icon
                                name='female'
                                size={20}
                                type='font-awesome'
                                color={(rowData.checkedMale == false) ? '#63B1DC':'#BEE1EB'}
                              />

                            </View>
                        </View>  
                        <View style={{flexDirection:'row', paddingTop:8, justifyContent:'space-between', alignItems:'flex-end'}}>
                          <View style={{ flex:9 }}>
                            <Text style={{fontSize:12, fontStyle:'italic', color:'#63B1DC'}}>{this.checklastmessage(rowData)}</Text>
                          </View>
                          <View style={{flex:1, justifyContent:'center', alignSelf:'stretch', alignItems:'flex-end'}}>
                            <Icon
                              size={17}
                              name='block'
                              color='#E1423A'
                              onPress={() => this.addFriend(rowData)}
                            />
                          </View>
                        </View>
                      </View>
            {/* <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: rowData.pic
                }}
                style={{padding: 1, width: 100, height: 100}}
              />
              <Text style={styles.profileName}>{rowData.name}</Text>
              <Text>{rowData.age}</Text>
              <Text></Text>
              <Text>{rowData.langLearning}</Text>
              <Text></Text>
              <Text>{rowData.checkedMale == true ? 'Male' : 'Female'}</Text>
              <Icon
                name={star}
                type='font-awesome'
                color='#2496BE'
                onPress={() => this.addFriend(rowData)} />
              <Text></Text>
              <Text>{this.checklastmessage(rowData)}</Text>
            </View> */}
          </TouchableOpacity>
          );
        }
      };

      addFriend(row) {

        var user = firebase.auth().currentUser;
        const { params } = this.props.navigation.state;
        const { navigate } = this.props.navigation;

        // fbDB.ref(`/users/${user.uid}/friends/${row.uid}`)
    //       .push({correctResponse, myURL})
    //       .then(() => {

        console.log(row);

        var myCurrentFriends = this.state.MyblockedPeople;
        var IsPresent = false;
        // console.log(row.name);
        for(var i = 0; i < myCurrentFriends.length; i++) {
          // console.log(myCurrentFriends);
          if (myCurrentFriends[i].name == row.username) {
              // console.log(myCurrentFriends[i].name);
              var IsPresent = true;
              break;
          // } else {
          }
        }

        var rowId = row.uid;

        console.log(IsPresent);

        if (IsPresent == false || myCurrentFriends.length == 0) {
          this.getRef().child("users").child(user.uid).child("friends").child(rowId)
            .set(row)
            .then(() => {

              showMessage({
                message: 'User has been saved!',
                description: 'Redirecting...',
                type: "success",
              });

              // this.setState({ openModalForBLocking: false });
              navigate('FriendsList', { user: params.user });

            this.setState({ loading: false })

          })
          .catch(() => {
            console.log('NEIRASE I DB !!!')
          })
        }
        

      }
    
      longBlock(user) {
        this.setState({blockthisUser:user});
        // this.setState({blockedOn:true});
        this.setState({openModalForBLocking:true});
      }

      shortChat(user) {
        const { navigate } = this.props.navigation;

        // if (this.state.blockedOn == false) {
          name = user.username;
          email = user.email;
          uid = user.uid;
          langLearning = user.languageLearning;
          langNative = user.languageNative;
          navigate("Chat", {
            name: name,
            email: email,
            uid: uid,
            langNative: langNative,
            langLearning: langLearning
          });
        // } else {
          // this.setState({openModalForBLocking:true});
        // }
      }

      _renderModalContent() {
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
                        this.setState({ openModalForBLocking: false });
                      }}>
                    <Icon
                      color='white'
                      size={25}
                      name='circle-with-cross'
                      type='entypo'
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ position:'absolute', width:'100%', height:45, justifyContent:'center', alignItems:'center' }}>
                  <Text style={{fontSize:20, fontWeight:'bold', color:'white'}}>
                    Last Chance!
                  </Text>
                </View>
              </View>
              <View style={{ height:200, padding:20, alignItems:'center', justifyContent:'center' }}>
                <View style={{ justifyContent:'center',  alignItems:'center'}}>
                  <Text style={{marginTop:30, fontSize:20, fontWeight:'bold', color:'#F68D3D', alignSelf:'center'}}>
                      Do you want to block
                  </Text>
                  <Text style={{ marginBottom:40, fontSize:20, fontWeight:'bold', color:'#F68D3D', alignSelf:'center'}}>
                      username?
                  </Text>
                  <Icon
                    size={50}
                    //name='block'
                     name='check-circle'
                     type='font-awesome'
                    color='#3DB984'
                    onPress={() => this.blockFriend(this.state.blockthisUser)} />
                </View>
              </View>
            </ElevatedView>
          </View>
        )
      }

      renderFilm(film, index) {

        var blockedUsers = film.blockedBy;
        console.log(film);

        if (film.hasOwnProperty('friend')) {
          var star = 'star';
        } else {
          var star = 'star-o';
        }


        if (Object.values(blockedUsers).indexOf(this.state.user.uid) > -1) {
            var itHasBlocked = true;
        } else {
            var itHasBlocked = false;
        }

        if (itHasBlocked) {
          return (
            // <View>
            // <Text>{film.username}</Text>
            // <Text>User was blocked!</Text>
            // <Icon
            //     name='block'
            //     color='#2496BE'
            //     onPress={() => this.unblockFriend(film)} />
            // </View>

            <View style={{width:'100%', justifyContent:'center', marginBottom:10, alignItems:'center' }}>
                <View style={{width:'90%', height:115, flex: 1}}>
                  <View style={{flex:1}}>
                    <View style={{flex:1, flexDirection:'row', marginHorizontal :3, marginVertical:5, paddingVertical:10, backgroundColor:'#EAF6F7', borderRadius:4}}>
                      <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:60,height:60, justifyContent:'center', borderRadius:30, backgroundColor:'#84BCD5'}}>
                          <Image
                            source={{uri: film.myPic}}
                            style={{width: 145, height: 200, alignSelf: 'center', borderRadius:100}}
                            resizeMode='contain'
                          />
                        </View>
                      </View>
                      <View style={{flex:7, paddingRight:20}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          <Text style={{fontSize:18, color:'#BCBEC0', fontWeight:'bold', marginRight:5}}>{film.username}</Text>
                          <Icon
                            size={15}
                            name='block'
                            color='#E1423A'
                          />
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:12, fontStyle:'italic', color:'#04A9D3'}}>User has been blocked</Text>
                        </View>  
                        <View style={{flexDirection:'row', marginTop:13 }}>
                            <TouchableOpacity style={{ backgroundColor:'#E1423A', borderRadius:3}} onPress={() => this.unblockFriend(film)}>
                              <Text style={{marginHorizontal:20, marginVertical:3, fontSize:13, color:'white'}}>Unblock</Text>
                            </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
          )
        } else {

            return (
              <View style={{width:'100%', justifyContent:'center', marginBottom:10, alignItems:'center' }}>
                <View style={{width:'90%', height:130, flex: 1}}>
                  <TouchableOpacity style={{flex:1}} key={index}
                          onLongPress={() => this.longBlock(film)}
                          onPress={() => {
                              this.shortChat(film)
                            }}
                      >
                    <View style={{flex:1, flexDirection:'row', marginHorizontal :3, marginVertical:5, paddingVertical:10, backgroundColor:'#EAF6F7', borderRadius:4}}>
                      <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:60,height:60, justifyContent:'center', borderRadius:30, backgroundColor:'#84BCD5'}}>
                          <Image
                            source={{uri: film.myPic}}
                            style={{width: 145, height: 200, alignSelf: 'center', borderRadius:100}}
                            resizeMode='contain'
                          />
                        </View>
                      </View>
                      <View style={{flex:7, paddingRight:20}}>
                      
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
                        
                        

                          <Text style={{fontSize:18, color:'#04A9D3', fontWeight:'bold'}}>{film.username}</Text>
                          
                          {film.premium &&
                            <Icon
                            name='crown'
                            type='foundation'
                            color='#517fa4'
                            style={{marginLeft : 1, alignItems: 'flex-start'}}
                            />
                          }

                          {/* <View style={{alignItems: 'flex-start', marginLeft : 5, marginBottom : 10, size:35}}> */}
                  
                  {/* </View> */}

                          <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:12, color:'#63B1DC'}}>Age: </Text>
                          <Text style={{fontSize:12, color:'#63B1DC'}}>{film.age}</Text>  
                          </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View>
                              <Text style={{fontSize:12, fontStyle:'italic', color:'#00A1AF'}}>Currently Learning:</Text>
                              <Text style={{fontSize:12, color:'#F15A29', fontWeight:'bold'}}>{film.languageLearning}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              {/* <Text>{film.checkedFemale == true ? 'Female' : 'Male'}</Text> */}
                              <Icon
                                name='male'
                                size={20}
                                type='font-awesome'
                                color={(film.checkedFemale == false) ? '#BEE1EB':'#63B1DC'}
                              />
                              <Icon
                                name='female'
                                size={20}
                                type='font-awesome'
                                color={(film.checkedFemale == true) ? '#BEE1EB':'#63B1DC'}
                              />

                            </View>
                        </View>  
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
                          <View style={{flex:6}}>
                            <Text style={{fontSize:12, fontStyle:'italic', color:'#63B1DC'}}>{this.checklastmessage(film)}</Text>
                          </View>
                          <View style={{flex:4, justifyContent:'center', alignItems:'flex-end', alignSelf:'stretch'}}>
                            <TouchableOpacity style={{ backgroundColor:'#F7941D', borderRadius:3}} onPress={() => this.addFriend(film)}>
                              <Text style={{fontSize:12, paddingHorizontal:10, paddingVertical:3, color:'white'}}>Add Friend</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{width: 20, height: 20, backgroundColor: 'transparent', position: 'absolute', justifyContent:'center', alignItems:'center', right: 0, top: 0}}>
                      <Icon
                          name='ios-information-circle'
                          size={20}
                          type='ionicon'
                          color='#E1423A'
                          onPress={() => this.addFriend(film)} />
                    </View>
                  </TouchableOpacity>
                </View>
            {/* <TouchableOpacity key={index} 
                onLongPress={() => this.longBlock(film)}
                onPress={() => {
                  this.shortChat(film)
                }}
            >
        
                <Image
                  source={{
                    uri: film.myPic
                  }}
                  style={{padding: 1, width: 100, height: 100}}
                />
                    <Text>{film.username}</Text>
                    <Text>{film.age}</Text>
                    <Text>{film.languageLearning}</Text>
                    <Text>{film.checkedFemale == true ? 'Female' : 'Male'}</Text>
                    <Icon
                      name={star}
                      type='font-awesome'
                      color='#2496BE'
                      onPress={() => this.addFriend(film)} />
                    <Text>{this.checklastmessage(film)}</Text>
                    

                <Text></Text>
                <Text>--------------------------------------------</Text>
                <Text></Text>

            </TouchableOpacity> */}
              </View>
            )
          }
      }

      render() {

        const { query } = this.state;
        const { navigate } = this.props.navigation;
        const films = this.findFilm(query);
        
        // console.log(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
          <View  style={{width:'100%', height:'100%',backgroundColor:'#C3E3E4'}}>
            <View style={{width:'100%', height:80, justifyContent:'center',alignItems:'center', backgroundColor:'white'}}>
              <View style={{width:'90%', height:50, padding:3,}}>
                <View style={{flex:1,  backgroundColor:'#D9F1FD', borderRadius:5}}>
                  <TextInput placeholder='Search for Friends'
                    placeholderTextColor='#84BCD5'
                    underlineColorAndroid="transparent"
                    onChangeText={text => this.setState({ query: text })}
                    style={{ fontSize:15, color:'#84BCD5', textAlign:'center'}}>
                  </TextInput>
                </View>
                
                <View style={{position:'absolute', right: 10, bottom: 0, top: 0, justifyContent: 'center'}}>
                  <Icon
                    name='search'
                    type='font-awesome'
                    color='#84BCD5'
                  />
                </View>
              </View>
              {/* <View style={{ flexDirection:'row', width:'90%', justifyContent:'center',alignItems:'center' }}>
                <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={{}}
                inputContainerStyle={{}}
                data={films.length === 1 && comp(query, films[0].username) ? [] : films}
                defaultValue={query}
                onChangeText={text => this.setState({ query: text })}
                placeholder='Search for Friends'
                renderItem={({ username }) => (
                  null
                  // <TouchableOpacity onPress={() => this.setState({ query: username })}>
                  //   <Text style={styles.itemText}>
                  //     {username}
                  //   </Text>
                  // </TouchableOpacity>
                )}
                />
              </View> */}
            </View>
            <View style={{width:'100%', flex:1, alignSelf:'stretch'}}>
                <ScrollView style={{width:'100%', height:'100%', backgroundColor:(films.length > 0) ? '#BEE1EB':'white'}}>
                  {films.length > 0 ? (
                    <View style={{width:'100%',paddingTop:20}}>
                      {films.map((film, index) => (

                        this.renderFilm(film, index)
                      ))}
                      {/* <Text>{films[1].username}</Text> */}
                      <Spinner visible={this.state.loading} />
                    </View>
                  ) : (
                    
                    <View style={{padding:15,width:'100%'}} >
                    <View style={{ paddingLeft:20, paddingVertical:3, width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#F15A29'}}>
                      <Text style={{ fontSize:20, color:'white' }}>Saved Friends</Text>
                    </View>
                    <View style={{ width:'100%', backgroundColor:'white', borderBottomColor:'#BEE1EB', borderBottomWidth:1 }}>
                      <ListView
                          style={{backgroundColor:'white', }}
                          dataSource={this.state.MydataSource}
                          renderRow={this.renderRow}
                      />
                    </View>
                    
                    <Button
                      onPress={() => {
                        navigate('NewPost');
                      }}
                      title="New Post"
                    />

                    <Spinner visible={this.state.loading} />
                    </View>
                  )}
              </ScrollView>
            </View>
            
            <Modal
              backdropColor={'black'}
              backdropOpacity={0.5}
              animationType="slide"
              transparent={true}
              isVisible={this.state.openModalForBLocking == true}
              onBackdropPress={() => this.setState({ openModalForBLocking: false })}
            >
              {this._renderModalContent()}
            </Modal>
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
    rightButton: {
      marginTop: 10,
      marginLeft: 5,
      marginRight: 10,
      padding: 0
    },
    topGroup: {
      flexDirection: "row",
      margin: 10
    },
    autocompleteContainer: {
      borderWidth:0
    },
    myFriends: {
      flex: 1,
      color: "#3A5BB1",
    //   tintColor: "#fff",
      //secondaryColor: '#E9E9E9',
      //grayColor: '#A5A5A5',
      fontSize: 16,
      padding: 5
    },
    profileContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      marginLeft: 6,
      marginBottom: 8
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: 6
    },
    profileName: {
      marginHorizontal: 15,
      color:'#666666',
      fontSize: 16
    },
    itemText: {
      fontSize: 15,
      margin: 2
    },
  });

export default FriendsListScreen;