import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, SafeAreaView, ScrollView, Image, StyleSheet, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
// import * as admin from "firebase-admin";
import { StackNavigator } from 'react-navigation';
import { CheckBox, Avatar, Icon } from 'react-native-elements';
import { ThemeProvider, Button } from 'react-native-material-ui';
import Modal from "react-native-modal";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { showMessage, hideMessage } from "react-native-flash-message";

import { Card, CardSection, Input, Spinner } from './common';
import Mystyles from '../styles/SliderEntry.style';
import ContainerStyles, { colors } from '../styles/index.style';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import Autocomplete from 'react-native-autocomplete-input';
import ElevatedView from 'react-native-elevated-view';
import { Dimensions } from 'react-native';
import { CustomHeader } from './common/CustomHeader';
import { strings } from '../../locales/i18n';
const SLIDER_1_FIRST_ITEM = 1;

const robotoRegular='Roboto-Bold';
const robotoMedium='Roboto-Medium';
const robotoLight='Roboto-Light';
const robotoBold='Roboto-Bold';


class ProfileScreen extends Component {
  // Nav options can be defined as a function of the screen's props:
  // static navigationOptions = ({ navigation }) => ({
  //   title: `Chat with ${navigation.state.params.user.email}`,
  // });

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Welcome',
      headerTitle: <CustomHeader title={strings('Profile.profile')} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold.ttf',
      },
    };
  }

  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
  }

  state = {
    visibleModal: null, uid: '', isModalVisible: false, email: '', password: '', error: '', checkedMale: false, checkedFemale: false, loading: false, loggedInUser: true, selectScreenPhase: 0,
    loadingCarousel: true, openModalForLanguage: false,
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    var manoID = params.user.uid;

    // console.log(params.user.uid);

    // const {currentUser} = firebase.auth();

    const self = this;

    firebase.database().ref('/users/' + params.user.uid).once('value')
      .then(function (snapshot) {
        // console.log(snapshot.val());
        const values = snapshot.val();
        // self.setState({profilePics:values.profilePics});
        if (values.checkedFemale == undefined) { values.checkedFemale = false; }
        if (values.checkedMale == undefined) { values.checkedMale = false; }
        if (values.premium == undefined) { values.premium = false; } else { values.premium = true; }
        if (values.myPic == undefined) {
          values.myPic = 'https://firebasestorage.googleapis.com/v0/b/yak-vernac-app.appspot.com/o/profile%20icons%2Fman.png?alt=media&token=ee7f968c-00c9-4097-8e0b-53f3a3562c05';
        }
        self.setState({ uid:manoID, username: values.username, age: values.age, language: values.language, checkedMale: values.checkedMale, checkedFemale: values.checkedFemale, interests: values.interests, introduction: values.introduction, xp: values.xp, profilePics: values.profilePics, myPic: values.myPic, premium: values.premium });

        // console.log('VALUES USERNAME' + values.username);
      })
      .catch(() => {
        console.log('NIEKO NEGAVAU!');
      });
  }

  onButtonPress() {
    const { params } = this.props.navigation.state;
    const { username, age, language, interests, introduction, checkedFemale, checkedMale, profilePics, xp, myPic } = this.state;
    const { navigate } = this.props.navigation;

    if (interests == undefined) {
      var Myinterests = '';
    } else {
      var Myinterests = interests;
    }

    if (introduction == undefined) {
      var Myintroduction = '';
    } else {
      var Myintroduction = introduction;
    }

    if (age == undefined) {
      var Myage = 18;
    } else {
      var Myage = age;
    }


    firebase.database().ref(`/users/${params.user.uid}`)
      .update({ email: params.user.email, username: username, age: Myage, interests: Myinterests, introduction: Myintroduction, checkedMale: checkedMale, checkedFemale: checkedFemale, myPic: myPic })
      .then(() => {
        navigate('Start')
      })
      .catch(() => {
        console.log('could not update the profile values!')
      })
  }

  onButtonPressDelete() {
    this.setState({openModalForLanguage:true});
    
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (

      <View>

        <Button text={strings('Profile.submit')} style={{
          container: {
            height: 45,
            backgroundColor: '#FF7F00',
            padding: 0,
            width: '100%',
          },
          text: {
            fontSize: 20,
            color: "#fff",
          }
        }}
          upperCase={false}
          onPress={this.onButtonPress.bind(this)} />

        <Text></Text>

        <Button text="Change Language" style={{
          container: {
            height: 45,
            backgroundColor: '#ff0000',
            padding: 0,
            width: '100%',
          },
          text: {
            fontSize: 20,
            color: "#fff",
          }
        }}
          upperCase={false}
          onPress={this.onButtonPressDelete.bind(this)} />  

      </View>
    );
  }

  onChangeMale() {
    if (this.state.checkedFemale == true) {
      this.setState({ checkedFemale: !this.state.checkedFemale });
    }
    this.setState({ checkedMale: !this.state.checkedMale });

  }

  onChangeFemale() {
    if (this.state.checkedMale == true) {
      this.setState({ checkedMale: !this.state.checkedMale });
    }
    this.setState({ checkedFemale: !this.state.checkedFemale });
  }

  _toggleModal() {
    // console.log(this.state.isModalVisible);
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  _renderModalContent = () => (
    this.mainExample(this.state.profilePics, 'Select a profile picture', 'by swiping them!')
  );

  changeLanguage(languageLearning) {
    // const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    console.log(' AAAAAAAAAAAAAAA BBBBBBBBBBB CCCCCCCCCCCCCC ');
    console.log(this.state.uid);

    if (languageLearning == 'EN') {

      console.log(this.state.uid);

      firebase.database().ref(`/users/${this.state.uid}`)
      .update({languageLearning:'EN', languageNative:'PT', language: "English"})
      .then(() => {

        this.setState({openModalForLanguage:false});
          
        showMessage({
          message: 'You will be learning English now!',
          description: 'Redirecting...',
          type: "success",
        });

        navigate('Start');

      })
      .catch(() => {
          console.log('could not update the profile values!')
      })

    } else {

      console.log(this.state.uid);

      firebase.database().ref(`/users/${this.state.uid}`)
      .update({languageLearning:'PT', languageNative:'EN', language: "Portuguese"})
      .then(() => {

        this.setState({openModalForLanguage:false});
          
        showMessage({
          message: 'You will be learning Portuguese now!',
          description: 'Redirecting...',
          type: "success",
        });

        navigate('Start');

      })
      .catch(() => {
          console.log('could not update the profile values!')
      })

    }
    
  }

  _renderModalContentLanguage() {
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
                    this.setState({ openModalForLanguage: false });
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
                What would you like to learn?
              </Text>
            </View>
          </View>
          <View style={{ height:230, padding:20, alignItems:'center', justifyContent:'center' }}>
            <View style={{ justifyContent:'center',  alignItems:'center'}}>
              <TouchableHighlight onPress={() => this.changeLanguage('PT')}>
                <Text style={{marginTop:20, paddingBottom: 0, marginBottom: 0, fontWeight:'bold', color:'#F68D3D', alignSelf:'center'}}>
                <Image
                  source={{uri: "https://www.waybrasil.net/uploaded/WAY_Brazil/Brazil_Logo.png"}}
                  style={{width: 256, height: 256, alignSelf: 'center'}}
                />
                </Text>
              </TouchableHighlight>

              <TouchableHighlight onPress={() => this.changeLanguage('EN')} style={{marginTop:0, paddingBottom: 10, fontWeight:'bold', color:'#F68D3D', alignSelf:'center'}}>
                <Text style={{marginTop:0, paddingBottom: 0, marginBottom: 0, fontWeight:'bold', color:'#F68D3D', alignSelf:'center'}}>
                <Image
                  source={{uri: "http://icons.iconarchive.com/icons/wikipedia/flags/256/GB-United-Kingdom-Flag-icon.png"}}
                  style={{width: 256, height: 256, alignSelf: 'center'}}
                />
                </Text>
              </TouchableHighlight>
              {/* <Icon
                size={50}
                //name='block'
                 name='check-circle'
                 type='font-awesome'
                color='#3DB984'
                onPress={() => this.blockFriend(this.state.blockthisUser)} /> */}
            </View>
          </View>
        </ElevatedView>
      </View>
    )
  }

  _renderItem({ item, index }) {

    var even = (index + 1) % 2 === 0;

    // console.log(item);

    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    var baseOne = viewportWidth;
    if(viewportHeight<viewportWidth)
    {
      baseOne = viewportHeight;
    }
    var frameWidth = baseOne*0.3; //this should be same to itemWidth
    var frameHeight = baseOne*0.25;
    var frameMargin = 0;

    return (
      <View style={{width:frameWidth, height:frameHeight, padding:5, backgroundColor:'transparent'}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{width: '100%',
                    height: '100%',
                    paddingHorizontal: frameMargin,
                    paddingBottom: 0 }}
          onPress={() => {
            this.setState({ myPic: item.illustration });
            this.setState({ visibleModal: null });
          }}
        // onPress={this.FirstSelectGame} 
        >
          <View style={{position: 'absolute',
                        top: 0,
                        left: frameMargin,
                        right: frameMargin,
                        bottom: 0,
                        shadowColor: colors.black,
                        shadowOpacity: 0.25,
                        shadowOffset: { width: 0, height: 10 },
                        shadowRadius: 10,
                        borderRadius: 0}}
          />
          <View style={[{justifyContent: 'center',
                          alignItems: 'center',
                          paddingTop: 8 ,
                          paddingBottom: 5,
                          paddingHorizontal: 16,
                          backgroundColor: '#0076B6',
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0}, 
                          even ? {backgroundColor: '#0076B6'} :{backgroundColor: '#0076B6'}]}>
            <Text
              style={[{textAlign: 'center',
                        color: 'white',
                        fontSize: 7,
                        fontWeight: 'bold',
                        letterSpacing: 0.5 },
                      even ? {color: 'white'} : {color: 'white'}]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={[{height:0,
                        marginTop: 0,
                        color: colors.gray,
                        fontSize: 12,
                        fontStyle: 'italic'
                      }, even ? { color: 'rgba(255, 255, 255, 0.7)'} : { color: 'rgba(255, 255, 255, 0.7)'}]}
              numberOfLines={2}
            >
              Something...
                </Text>
          </View>
          <View style={[{flex: 1,
                          marginBottom: 0, // Prevent a random Android rendering issue
                          backgroundColor: 'white',
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0
                        }, even ? {backgroundColor: '#ffffff'} : {backgroundColor: '#ffffff'}]}>
            <Image
              source={{ uri: item.illustration }}
              style={{...StyleSheet.absoluteFillObject,
                      resizeMode: 'cover',
                      borderRadius: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0}}
            />
            <View style={[{position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 0,
                            backgroundColor: 'white'}, 
                          even ? {backgroundColor: '#ffffff'} : {backgroundColor: '#ffffff'}]} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  mainExample(dataForCarousel, titleBuy, title) {
    const { slider1ActiveSlide } = this.state;
    // console.log(dataForCarousel);
    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    var baseOne = viewportWidth;
    if(viewportHeight<viewportWidth)
    {
      baseOne = viewportHeight;
    }
    baseOne = baseOne;
    var frameWidth = baseOne*0.3; //this should be same to itemWidth
    const carouselWidth = viewportWidth;
    const itemHMargin =0; // viewportWidth*0.02
    const itemWidth = baseOne*0.3;//viewportWidth*0.3;//-itemHMargin;

    return (
      <View style={{marginLeft:'10%', marginRight:'10%',width:'100%', justifyContent:'center', alignContent:'center'}}>
      <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5, width:'80%', backgroundColor:'white'}}>
              <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
                <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
                  <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                    {strings('Profile.select_picture')}
                  </Text>
                </View>
                <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
                  <TouchableOpacity onPress={() => {
                    this.setState({ visibleModal: null });
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
        
        {/* <Text style={{ fontSize:20, fontWeight:'bold', color:'black' }}>{title}</Text> */}
        <View style={{width:'100%', justifyContent:'center',alignItems:'center'}}>
        <Carousel
          ref={c => this._slider1Ref = c}
          data={dataForCarousel}
          renderItem={this._renderItem}
          sliderWidth={carouselWidth}
          itemWidth={itemWidth}
          // hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.5}
          // inactiveSlideShift={20}
          containerCustomStyle={{ backgroundColor:'transparent', marginTop: 15, overflow: 'visible'}}
          contentContainerCustomStyle={{paddingVertical: 10}}
          loop={true}
          loopClonesPerSide={2}
          //   autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
        </View>
        <View style={{width:'100%', height:20}}></View>
        </ElevatedView>
      </View>
    );
  }

  // _renderButton = (text, onPress) => (

  // );

  render() {
    // The screen's current route is passed in to `props.navigation.state`:

    return (
      <ThemeProvider>
        <ScrollView style={{ backgroundColor: '#C3E3E4' }}>
            <View style={{
              borderBottomWidth: 1,
              padding: 20,
              margin : 20,
              backgroundColor: '#fff',
              // justifyContent: 'flex-end',
              flexDirection: 'column',
              justifyContent : 'space-between',
              borderColor: '#C3E3E4',
              position: 'relative'
            }}>
              <View style={{height : 30}} />
              <View style={{flexDirection : 'row', flex : 1, marginBottom : 10}}>
                <View style={{flex : 6}}>
                  
                  <View style={{width:'90%'}}>
                  
                  {/* <View style={{marginBottom : 10}}> */}

                  {/* <View style={{marginBottom : 10, marginLeft : 1}}> */}
                                     
                    {/* <Image source={require('./../assets/avatar.png')} style={{width : 30, height : 30, marginLeft : 5, marginBottom : 10, marginTop : 10}} /> */}
                  {/* </View> */}

                  {/* </View> */}
                  
                  <View style={{alignItems: 'flex-start', marginLeft : 5, marginBottom : 10}}>

                  {this.state.premium && 
                    <Icon
                      name='crown'
                      type='foundation'
                      color='#517fa4'
                      // style={{marginLeft : 10}}
                      /> 
                  }
                  </View>

                  <View style={{marginBottom : 10}}>
                    
                    <Text style={styles.labelStyle}>{strings('Profile.username')}</Text>
                    
                    <TextInput
                      style={styles.inputStyle}
                      placeholder={strings('Profile.please_enter')}
                      placeholderTextColor = "#D4D4D4"
                      value={this.state.username}
                      onChangeText={username => this.setState({ username })}
                    />
                  </View>
                  <View style={{marginBottom : 10}}>
                    <Text style={styles.labelStyle}>{strings('Profile.age')}</Text>
                    <TextInput
                      style={styles.inputStyle}
                      placeholder={strings('Profile.please_age')}
                      placeholderTextColor = "#D4D4D4"
                      keyboardType='numeric'
                      value={this.state.age}
                      onChangeText={age => this.setState({ age })}
                    />
                  </View>
                  </View>
                </View>

                <View style={{flex : 4, justifyContent: 'flex-start', alignItems : 'center'}}> 
                  <Avatar
                    width={220}
                    height={220}
                    placeholder="Add \n Photo"
                    source={{
                      uri: this.state.myPic
                    }}
                    activeOpacity={0.7}
                    avatarStyle={{ borderRadius: 120 / 2 }}
                    overlayContainerStyle={{ backgroundColor: 'transparent' }}
                    onPress={() => this.setState({ visibleModal: 6 })}
                  />
                </View>
              </View>
             <View style={{flexDirection : 'column', flex : 1, marginBottom : 10, marginTop : 10}}>
                <View style={{marginBottom : 10}}>
                  <Text style={styles.labelStyle}>{strings('Profile.language_learning')}</Text>
                  <TextInput
                    style={styles.inputStyle}
                    // value={this.state.language}
                    // editable={false}
                    placeholder="English/Portuguese"
                    placeholderTextColor = "#D4D4D4"
                    value={this.state.language}
                    editable={false}
                  />
                </View>
                <View style={{marginBottom : 10}}>
                  <Text style={styles.labelStyle}>{strings('Profile.interests')}</Text>
                  <TextInput
                    style={{color: '#000', paddingRight: 5, paddingLeft: 5, fontSize: 15,}}
                    placeholder={strings('Profile.eg_travelling')}
                    placeholderTextColor = "#D4D4D4"
                    multiline = {true}
                    numberOfLines = {4}
                    value={this.state.interests}
                    onChangeText={interests => this.setState({ interests })}
                  />
                </View>
              </View>
              <Text style={styles.labelStyle}>{strings('Profile.gender')}</Text>
              <View style={{width:'100%', flexDirection:'row'}}>
                <View style={{width:'35%'}}>
                  <CheckBox containerStyle={{ borderWidth:0, paddingLeft: 5, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title={strings('Profile.male')}
                    textStyle={{
                      marginLeft: 20, fontSize: 14, fontWeight: 'normal', color: 'grey'
                    }}
                    checkedIcon='check-circle-o'
                    uncheckedIcon='male'
                    checked={this.state.checkedMale}
                    onPress={this.onChangeMale.bind(this)}
                  />
                </View>
                <View style={{width:'35%'}}>
                  <CheckBox containerStyle={{ borderWidth:0,  paddingLeft: 10, borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title={strings('Profile.female')}
                    textStyle={{
                      marginLeft: 19, fontSize: 14, fontWeight: 'normal', color: 'grey'
                    }}
                    checkedIcon='check-circle-o'
                    uncheckedIcon='female'
                    checked={this.state.checkedFemale}
                    onPress={this.onChangeFemale.bind(this)}
                  />
                </View>
              </View>
              <View style={{flex : 1, marginBottom : 20, marginTop:10}}>
                <Text style={styles.labelStyle}>{strings('Profile.introductory_blurb')}</Text>
                <TextInput style={{color: '#000000', paddingRight: 5, paddingLeft: 5, fontSize: 15,marginTop:10}}
                multiline={true}
                underlineColorAndroid="transparent"
                  placeholder={strings('Profile.eg_i')}
                />
                  
              </View>
              <View style={{height : 100}} />
            </View>

            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>

            <View style={{ width: '100%', paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 20 }}>
              {this.renderButton()}
            </View>
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

          <Modal
            backdropColor={'black'}
            backdropOpacity={0.5}
            animationType="slide"
            transparent={true}
            isVisible={this.state.openModalForLanguage == true}
            onBackdropPress={() => this.setState({ openModalForLanguage: false })}
          >
            {this._renderModalContentLanguage()}
          </Modal>

        </ScrollView>
      </ThemeProvider>
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
    color: '#4C4C4C',
    fontSize: 16,
    fontFamily : 'Roboto-regular',
    paddingLeft: 5,
    // flex: 1 // label occupies 1/3 of the space
  },
  inputStyle: {
    // color: '#7F7F7F',
    color: 'black',
    paddingRight: 5,
    paddingLeft: 5,
    fontFamily : 'Roboto-Light',
    fontSize: 17,
    height : 40
    // lineHeight: 23,
    // flex: 2 // input ocupies 2/3 of the space
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
};

export default ProfileScreen;