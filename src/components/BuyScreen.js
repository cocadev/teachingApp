import React, { Component, PureComponent } from 'react';
import { Text, TextInput, View, TouchableOpacity, Linking, Platform, ScrollView, StatusBar, SafeAreaView, Image } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
// import Moment from 'react-moment';
// import {CheckBox} from 'react-native-elements';
// import { Card, CardSection, Input, Spinner } from './common';
import Modal from "react-native-modal";
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from './SliderEntry';
import SliderEntryVIP from './SliderEntryVIP';
import styles, { colors } from '../styles/index.style';
import { ProfilePics, PremiumStuff } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../utils/animations';
import { CustomHeader } from './common/CustomHeader';
import { ThemeProvider, Button } from 'react-native-material-ui';
import {Icon} from 'react-native-elements';
import stripe from 'tipsi-stripe';
import ElevatedView from 'react-native-elevated-view'
import { Dimensions } from 'react-native';
import { strings } from '../../locales/i18n';

import testID from '../utils/testID';


const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

export default class BuyScreen extends React.Component {
  // Nav options can be defined as a function of the screen's props:
  // static navigationOptions = ({ navigation }) => ({
  //   title: `Chat with lukas`,
  // });

  constructor (props) {
    super(props);
    this.state = {
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        viewport: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
      }
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Welcome',
      headerTitle: <CustomHeader title={strings('BuyScreen.welcome')} navigation={navigation}/>,
      headerStyle: {
        backgroundColor: '#2496BE',
        // marginTop: 24
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold.ttf',
      },
    };
  }

  // static propTypes = { url: 'https://www.yakvernac.com/#donate' };

  // handleClick = () => {
  //   Linking.canOpenURL(this.props.url).then(supported => {
  //     if (supported) {
  //       Linking.openURL(this.props.url);
  //     } else {
  //       console.log("Don't know how to open URI: " + this.props.url);
  //     }
  //   });
  // }

  // state = { email: '', password: '', error: '', checkedMale: false, loading: false, loggedInUser: true };

  state = {
    loading: false,
    loadingCarousel: true,
    token: null,
    userId: '',
    paid: false,
    visibleModalVIP: null
    // userValues: ''
    // entries: []
  }

  // componentWillMount() {

  //   const self = this;


  //   firebase.database().ref(`/profilePics`).once("value", snap => {

  //     var fromProfile = snap.val();
  //     self.setState({entries:fromProfile});
      
  //   })
  // }

  componentWillMount() {
    const { params } = this.props.navigation.state;

    this.setState({userId:params.user.uid});

    const self = this;
    
    firebase.database().ref('/users/' + params.user.uid).on('value', function(snapshot) {
         
      const values = snapshot.val();
      var myXP = values.xp;
      // var languageLearning = values.languageLearning;
      self.setState({myXP})

      if (values.premium != undefined) {
        self.setState({paid:true, until:values.premium.untilNice});

      } else {
        self.setState({paid:false});
      }

      // self.setState({languageLearning:languageLearning})
      

      // console.log(values);

    })

    firebase.database().ref(`/profilePics`).once("value", snap => {

      var fromProfile = snap.val();
      self.setState({entries:fromProfile});
      
    })

    firebase.database().ref(`/islandPics`).once("value", snap => {

      var fromIslandPics = snap.val();
      self.setState({entriesIsland:fromIslandPics});
      
    })

  }

  handleCardPayPress = async (months, amount) => {
    try {
      this.setState({ loading: true, token: null })
      // const amount = 500;
      // console.log('lukas')
      // console.log(months);
      // var userId = 123;
      const token = await stripe.paymentRequestWithCardForm({})

      const payment = {token, amount, months}

      firebase.database().ref(`/payments/${this.state.userId}`)
                         .push(payment)
                         .then(() => {

                          this.setState({ loading: false, token, paid:true })

                        })
                        .catch(() => {
                          console.log('NEIRASE I DB !!!')
                        })

      // console.log(token);
      this.setState({ visibleModalVIP: null });
      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false })
      console.log('CATCH CIKLAS...')
    }
  }

  _renderItem ({item, index}) {
    // const { params } = this.props.navigation.state;
    // console.log(item);
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
}

_renderItemVIP ({item, index}) {
  // const { params } = this.props.navigation.state;
  return <SliderEntryVIP data={item} even={(index + 1) % 2 === 0} />;
}

_renderItemWithParallax ({item, index}, parallaxProps) {
    return (
        <SliderEntry
          data={item}
          even={(index + 1) % 2 === 0}
          parallax={true}
          parallaxProps={parallaxProps}
        />
    );
}

mainExample (dataForCarousel, titleBuy, title) {
    const { slider1ActiveSlide } = this.state;

    // const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

    return (
        <View style={styles.exampleContainer}
          onLayout={() => {
            this.setState({
                viewport: {
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height
                }
            });
          }}
        >
            <Text style={[styles.title,{color:'#2496BE'}]}>{`${titleBuy}`}</Text>
            <Text style={[styles.subtitle,{color:'#1FA4C0'}]}>{title}</Text>
            <Carousel
              ref={c => this._slider1Ref = c}
              data={dataForCarousel}
              renderItem={this._renderItem}
              sliderWidth={this.state.viewport.width}
              itemWidth={itemWidth}
              // hasParallaxImages={true}
              firstItem={SLIDER_1_FIRST_ITEM}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.5}
              // inactiveSlideShift={20}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContentContainer}
              loop={true}
              loopClonesPerSide={2}
            //   autoplay={true}
              autoplayDelay={500}
              autoplayInterval={3000}
              onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
            />
        </View>
    );
}
get pagination () {
  const { entries, slider1ActiveSlide } = this.state;
  return (
    PremiumStuff &&
      <Pagination
        dotsLength={PremiumStuff.length}
        activeDotIndex={slider1ActiveSlide}
        containerStyle={{ flexDirection : 'row',
        height : 50,
        paddingTop : 0,
        paddingBottom : 0 }}
        dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 0,
            backgroundColor: '#0076B6',
            // color:'#0076B6'
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
  );
}
mainExampleVIP (dataForCarousel, titleBuy, title) {
  const { slider1ActiveSlide } = this.state;

  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

    function wp (percentage) {
        const value = (percentage * viewportWidth) / 100;
        return Math.round(value);
    }
  const slideHeight = 300 //viewportHeight * 0.15;
  const slideWidth = 300 //slideHeight+10; // Math.round((25*viewportWidth)/100);
  const itemHorizontalMargin = Math.round((2*viewportWidth)/100);
  
  const sliderWidth = viewportWidth;
  const itemWidth = slideWidth;// + itemHorizontalMargin;
  return (
      <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center',}}>
        <ElevatedView elevation={4} style={{ borderTopStartRadius:3,borderTopEndRadius:3,borderBottomStartRadius:5,borderBottomEndRadius:5,width:'100%',height:'100%', backgroundColor:'white'}}>
          <View style={{width:'100%', height:45,flexDirection:'row', borderTopStartRadius:3,borderTopEndRadius:3, backgroundColor:'#F15A29'}}>
            <View style={{ width:'85%', paddingLeft:15, height:45, justifyContent:'center',}}>
              <Text style={{ marginLeft:15, fontSize:20, fontWeight:'bold', color:'white'}}>
                {`${titleBuy}`}
              </Text>
            </View>
            <View style={{width:'15%', height:45, justifyContent:'flex-start', alignItems:'flex-end', paddingRight:6, paddingTop:10}}>
              <TouchableOpacity onPress={() => {
                this.setState({ visibleModalVIP: null });
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
          <View style={{flex:1}}>
            <ScrollView>
            <View style={{width:'100%', height:30}}></View>
            <Carousel
                ref={c => this._slider1Ref = c}
                data={dataForCarousel}
                renderItem={this._renderItemVIP}
                sliderWidth={viewportWidth}
                itemWidth={viewportWidth}
                firstItem={SLIDER_1_FIRST_ITEM}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.5}
                // containerCustomStyle={{
                //   marginTop: 15,
                //   overflow: 'visible' }}
                // contentContainerCustomStyle={{
                //   paddingVertical: 10}}
                loop={true}
                // loopClonesPerSide={2}
                autoplayDelay={500}
                autoplayInterval={3000}
                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
              />
              {this.pagination}
            <View style={{width:'100%', height:30}}></View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} >
                <TouchableOpacity style={{}}
                    onPress={() => this.handleCardPayPress(3, 450)}>
                  <View style={{borderRadius:5, padding:5, width:95,height:110, justifyContent:'center',alignItems:'center', backgroundColor:'#00B7F1'}}>
                  <Text style={{textAlign:'center', fontSize:12, color:'white'}}>
                      {strings('BuyScreen.premium_membership_3')}
                    </Text>
                    <Text style={{marginTop:11, textAlign:'center', fontSize:20, color:'white'}}>
                      $4.50
                    </Text>
                    <Text style={{textAlign:'center', fontSize:8, color:'white'}}>
                      /{strings('BuyScreen.month')}
                    </Text>
                    {/* <Text style={{marginTop:11,textAlign:'center', fontSize:8, color:'white'}}>
                      Cancel Anytime
                    </Text> */}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{}}
                    onPress={() => this.handleCardPayPress(6, 2430)}>
                  <View style={{borderRadius:5, padding:5, width:100,height:135, justifyContent:'center',alignItems:'center', backgroundColor:'#F68D3D'}}>
                  <Text style={{textAlign:'center', fontSize:12, color:'white'}}>
                      {strings('BuyScreen.premium_membership_6')}
                    </Text>
                    <Text style={{marginTop:15, textAlign:'center', fontSize:20, color:'white'}}>
                      $24.30
                    </Text>
                    <Text style={{textAlign:'center', fontSize:8, color:'white'}}>
                      /{strings('BuyScreen.quarter')}
                    </Text>
                    <Text style={{marginTop:15,textAlign:'center', fontSize:8, color:'white'}}>
                    {strings('BuyScreen.10_off')}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{}}
                    onPress={() => this.handleCardPayPress(12, 4590)}>
                  <View style={{borderRadius:5, padding:5, width:95,height:110, justifyContent:'center',alignItems:'center', backgroundColor:'#00B7F1'}}>
                  <Text style={{textAlign:'center', fontSize:12, color:'white'}}>
                      {strings('BuyScreen.premium_membership_12')}
                    </Text>
                    <Text style={{marginTop:11, textAlign:'center', fontSize:20, color:'white'}}>
                      $45.90
                    </Text>
                    <Text style={{textAlign:'center', fontSize:8, color:'white'}}>
                      /{strings('BuyScreen.year')}
                    </Text>
                    <Text style={{marginTop:11,textAlign:'center', fontSize:8, color:'white'}}>
                    {strings('BuyScreen.15_off')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{width:'100%', height:30}}></View>
              </ScrollView>
          </View>
        </ElevatedView>
      </View>
  );
}

get gradient () {
    return (
        <LinearGradient
          colors={[colors.background1, colors.background2]}
          startPoint={{ x: 1, y: 0 }}
          endPoint={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
    );
}

  renderPremium() {
    const {currentUser} = firebase.auth();
    const { navigate } = this.props.navigation;

    switch (this.state.paid) {
      case true:
        return (
          <View>
            <Text style={styles.title}>You have purchsed Premium account!</Text>
            <Text style={styles.subtitle}>Valid until {this.state.until}</Text>
            <Text></Text>
          </View>
        )
      case false:
        return (
          <View style={{ width:'100%', justifyContent:'center', alignItems:'center',borderRadius:10, backgroundColor:'rgba(255,255,255,0.5)'}}>
          <View style={{ paddingVertical:10, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <Button text='Buy Preimum' style={{
              container: {
                  height: 35,
                  backgroundColor: '#FF7F00',
                  width:'70%'
                },
                text: {
                  fontSize: 18,
                  color: "#fff",
                }
              }}
              upperCase={false}
              onPress={() => navigate('BuyScreenSecond', { user: currentUser })}/>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>More Content</Text>
            </View>
            <View style={{flexDirection:'row',paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>Save Custom Lessons</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>Unlimited Translation Tool</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>No Ads</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>Exclusive Items</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>Exclusive Text Stickers</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>Power Search</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
          <View style={{flexDirection:'row', width:'100%', borderBottomWidth:1, borderBottomColor:'#CCCCCC'}}>
            <View style={{flexDirection:'row',paddingLeft:50, width:'60%', justifyContent:'flex-start', alignItems:'center'}}>
            <Text style={{fontSize:12, color:'#2496BE'}}>Learn Multiple Languages</Text>
            </View>
            <View style={{flexDirection:'row', paddingRight:50, width:'40%', justifyContent:'flex-end', alignItems:'center'}}>
            <Icon name='home'  type='fontawesome' size={15} color='green'/>
            </View>
          </View>
            {/* <Button 
              title='Buy Premium Membership'
              onPress={() => navigate('BuyScreenSecond', { user: currentUser })}/> */}
          </View>
        )
    }
  }

  _renderModalVIPScreen = () => (
    this.mainExampleVIP(PremiumStuff, 'VIP', 'using your hard-earned XP')
  );

  render() {
    // if (this.state.entries) {
    //   const example1 = this.mainExample(this.state.entries, 'Get a new profile picture', 'using your hard-earned XP');
    // }
    const { navigate } = this.props.navigation;
    
    
    return (
      <ThemeProvider>
      <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container, {backgroundColor:'#C3E3E4'}]}>
                    {/* <StatusBar
                      translucent={true}
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    /> */}
                    {/* { this.gradient } */}
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                    <View style={{width:'100%', backgroundColor:'#E2ECEB'}}>
                      <View style={{width:'100%', justifyContent:'center',alignItems:'center'}}>
                        <View style={{width:30,height:30,marginTop:8}}>
                          <Image style={{
                            flex: 1,
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            }} 
                            source={require('../assets/coin.png')} 
                          />
                        </View>
                      </View>
                      <View style={{width:'100%', justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:10, color:'#2496BE'}}>
                          {strings('BuyScreen.you_have')}
                        </Text>
                        <Text style={{fontSize:20, lineHeight:19.5, fontWeight:'bold', color:'#FB5A3A'}}>
                          {this.state.myXP} XP
                        </Text>
                        <Text style={{fontSize:10,lineHeight:9, color:'#2496BE'}}>
                          {strings('BuyScreen.points')}
                        </Text>
                      </View>

                     { this.state.entries && this.mainExample(this.state.entries, strings('BuyScreen.get_a'), strings('BuyScreen.using_your')) }

                     { this.state.entriesIsland && this.state.paid == true && this.mainExample(this.state.entriesIsland, strings('BuyScreen.get_a_new'), strings('BuyScreen.using_xp')) }

                      
                          

                        {/* <Button
                          title="Donate"
                          onPress={() => Linking.openURL(`http://www.yakvernac.com/#donate`)}
                          /> */}

                      </View>
                      <View style={{width:'100%', height:50}}></View>
                      <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity style={{width:'100%', backgroundColor:'#E2ECEB'}}
                          onPress={() => this.setState({ visibleModalVIP: true })}>
                          <View style={{width:'100%', height:20}}></View>
                          <View style={{flexDirection:'row', width:'100%'}}>
                            <View style={{flex:1.3, backgroundColor:'transparent', alignItems:'flex-end', justifyContent:'center'}}>
                              <View style={{width:20,height:20}}>
                                <Image style={{
                                  flex: 1,
                                  width: 20,
                                  height: 20,
                                  justifyContent: 'center',
                                  }} 
                                  source={require('../assets/crown.png')} 
                                />
                              </View>
                            </View>  
                            <View style={{flex:8.7,paddingLeft:15, paddingRight:30, backgroundColor:'transparent'}}>
                              <Text style={{fontSize:20, fontWeight:'bold', color:'#EE202E'}}>
                                {strings('BuyScreen.VIP_Membership')}
                              </Text>
                              <Text style={{color:'#0076B6'}}>
                                {strings('BuyScreen.VIP_benefits')}
                              </Text>
                            </View>  
                          </View>
                          <View style={{width:'100%', height:20}}></View>    
                        </TouchableOpacity>
                        
                        <View style={{width:'100%', justifyContent:'center',alignItems:'center'}}>
                        <View style={{width:50,height:50,marginTop:20}}>
                        <Image style={{
                          flex: 1,
                          width: 50,
                          height: 50,
                          justifyContent: 'center',
                          }} 
                          source={require('../assets/pig.png')} 
                        />
                        </View>
                        <View style={{paddingHorizontal:30,paddingVertical:10,  justifyContent:'center',alignItems:'center', width:'100%', backgroundColor:'transparent'}}>
                          <Button text={strings('BuyScreen.donate')} style={{container: {
                            height: 45,
                            backgroundColor: '#FF7F00',
                            padding: 0,
                            width: '50%',
                          },
                          text: {
                            fontSize: 20,
                            color: "#fff",
                          }}}
                            upperCase={false}
                            onPress={() => Linking.openURL(`http://www.yakvernac.com/#donate`)} />
                        </View>
                        {/* <Button
                          title="Donate"
                          onPress={() => Linking.openURL(`http://www.yakvernac.com/#donate`)}
                          /> */}
                    </View>  

                      </View>
                    </ScrollView>
                </View>

                

      </SafeAreaView>

      <Modal
                            backdropColor={'black'}
                            backdropOpacity={0.5}
                            animationType="slide"
                            transparent={true}
                            isVisible={this.state.visibleModalVIP === true}
                            onBackdropPress={() => this.setState({ visibleModalVIP: null })}
                          >
                            {this._renderModalVIPScreen()}
                          </Modal>
      </ThemeProvider>
    );
  }
}
