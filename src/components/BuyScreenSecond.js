import React, { Component, PureComponent } from 'react';
import { Text, TextInput, View, TouchableOpacity, Linking, Platform, ScrollView, StatusBar, SafeAreaView, Image } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
// import Moment from 'react-moment';
// import {CheckBox} from 'react-native-elements';
// import { Card, CardSection, Input, Spinner } from './common';

import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from './SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ProfilePics, ENTRIES2 } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../utils/animations';
import { CustomHeader } from './common/CustomHeader';
import { ThemeProvider, Button } from 'react-native-material-ui';

import stripe from 'tipsi-stripe';

import testID from '../utils/testID';


const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

export default class BuyScreenSecond extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  static navigationOptions = {
    title: 'Welcome',
    headerTitle: <CustomHeader title="Welcome" />,
    headerStyle: {
      backgroundColor: '#2496BE',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: 'Roboto-Bold.ttf',
    },
  };

  state = {
    loading: false,
    loadingCarousel: true,
    token: null,
    userId: '',
    paid: false
    // userValues: ''
    // entries: []
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;

    this.setState({userId:params.user.uid});

    const self = this;
    
    firebase.database().ref('/users/' + params.user.uid).on('value', function(snapshot) {
         
      const values = snapshot.val();
      var myXP = values.xp;
      self.setState({myXP})

      if (values.premium != undefined) {
        self.setState({paid:true, until:values.premium.untilNice});

      } else {
        self.setState({paid:false});
      }

    })

  }

  handleCardPayPress = async (months) => {
    try {
      this.setState({ loading: true, token: null })
      const amount = 500;
      // console.log('lukas')
      console.log(months);
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

      console.log(token);

      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false })
      console.log('CATCH CIKLAS...')
    }
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
    const { navigate } = this.props.navigation;

    switch (this.state.paid) {
      case true:
        return (
          <View>
            <Text style={styles.title}>You have purchsed Premium account!</Text>
            <Text style={styles.subtitle}>Valid until {this.state.until}</Text>
            <Text></Text>
            <Button 
            title='Back to Menu'
            onPress={() => navigate('Start')}/>

          </View>
        )
      case false:
        return (
          <View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} >
              <View style={{ margin:10, width:100,height:130}}>
                <View style={{ marginTop:20,marginHorizontal:2,marginBottom:0, width:96,height:80, justifyContent:'center',alignItems:'center', backgroundColor:'#2496B2' }}>
                  <Text style={{ fontSize:14, color:'white', textAlign:'center'}}>
                    $5.85/month
                  </Text>
                  <Text style={{ fontSize:14, color:'white', textAlign:'center'}}>
                    $70.2/year
                  </Text>
                </View>
                <TouchableOpacity style={{ width:100,height:30, justifyContent:'center',alignContent:'center',  backgroundColor:'#FF7F00' }}
                onPress={() => this.handleCardPayPress(3)}>
                  <Text style={{ fontSize:15,fontWeight:'bold', color:'white', textAlign:'center'}}>
                    3 Months
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ margin:10, width:100,height:130}}>
                <View style={{ marginTop:0,marginHorizontal:2,marginBottom:0, width:96,height:100, justifyContent:'center',alignItems:'center', backgroundColor:'#2496B2' }}>
                  <Text style={{ fontSize:14, color:'white', textAlign:'center'}}>
                    $5/month
                  </Text>
                  <Text style={{ fontSize:14, color:'white', textAlign:'center'}}>
                    $60/year
                  </Text>
                </View>
                <TouchableOpacity style={{ width:100,height:30, justifyContent:'center',alignContent:'center',  backgroundColor:'#FF7F00' }}
                onPress={() => this.handleCardPayPress(6)}>
                  <Text style={{ fontSize:15,fontWeight:'bold', color:'white', textAlign:'center'}}>
                    6 Months
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ margin:10, width:100,height:130}}>
                <View style={{ marginTop:20,marginHorizontal:2,marginBottom:0, width:96,height:80, justifyContent:'center',alignItems:'center', backgroundColor:'#2496B2' }}>
                  <Text style={{ fontSize:14, color:'white', textAlign:'center'}}>
                    $4.20/month
                  </Text>
                  <Text style={{ fontSize:14, color:'white', textAlign:'center'}}>
                    $50.4/year
                  </Text>
                </View>
                <TouchableOpacity style={{ width:100,height:30, justifyContent:'center',alignContent:'center',  backgroundColor:'#FF7F00' }}
                onPress={() => this.handleCardPayPress(12)}>
                  <Text style={{ fontSize:15,fontWeight:'bold', color:'white', textAlign:'center'}}>
                    12 Months
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
              {/* <Button
              title="Premium membership for 3 months"
              loading={this.loading}
              onPress={() => this.handleCardPayPress(3)}
              {...testID('cardFormButton')}
              />
              <Button
              title="Premium membership for 6 months"
              loading={this.loading}
              onPress={() => this.handleCardPayPress(6)}
              {...testID('cardFormButton')}
              />
              <Button
              title="Premium membership for 12 months"
              loading={this.loading}
              onPress={() => this.handleCardPayPress(12)}
              {...testID('cardFormButton')}
              /> */}
              {/* <View
              style={styles.token}
              {...testID('cardFormToken')}>
              { {this.state.token &&
                  <Text style={styles.instruction}>
                  Token: {this.state.token.tokenId}
                  </Text>
              } }
              </View> */}
          </View>
        )
    }
  }

  render() {
    // if (this.state.entries) {
    //   const example1 = this.mainExample(this.state.entries, 'Get a new profile picture', 'using your hard-earned XP');
    // }
    const { navigate } = this.props.navigation;
    
    return (
      <ThemeProvider>
      <SafeAreaView style={styles.safeArea}>
                <View style={[styles.container,{backgroundColor:'#C3E3E4'}]}>
                    <StatusBar
                      translucent={true}
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    />
                    {/* { this.gradient } */}
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                    <View style={{
                      width:'100%', 
                      justifyContent:'center', 
                      alignItems:'center', 
                      borderRadius:10,
                      paddingTop:20,
                      paddingBottom:40,   
                      backgroundColor:'rgba(255,255,255,0.7)'}}>
                        <Text style={{ fontSize:18,fontWeight:'bold', marginBottom:10, color:'#FB5A3A'}}>
                          Buy Premium
                        </Text>
                        {this.renderPremium()}
                    </View>
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
                          <Button text='Donate' style={{container: {
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
                    </ScrollView>
                </View>
      </SafeAreaView>
      </ThemeProvider>
    );
  }
}

// const styles = {
//   errorTextStyle: {
//     fontSize: 20,
//     alignSelf: 'center',
//     color: 'red'
//   },
//   labelStyle: {
//     fontSize: 18,
//     paddingLeft: 20,
//     flex: 1 // label occupies 1/3 of the space
//   },
//   inputStyle: {
//     color: '#000',
//     paddingRight: 5,
//     paddingLeft: 5,
//     fontSize: 18,
//     lineHeight: 23,
//     flex: 2 // input ocupies 2/3 of the space
//   }
// };

// export default BuyScreen;