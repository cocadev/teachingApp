import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'firebase';
import { StackNavigator } from 'react-navigation';
import { Header } from './src/components/common';
import { Button, ThemeProvider } from 'react-native-material-ui';
import Spinner from "react-native-loading-spinner-overlay";
import FlashMessage from "react-native-flash-message";

import LoginForm from './src/components/LoginForm';
import ProfileScreen from './src/components/ProfileScreen';
import StartScreen from './src/components/StartScreen';
import CreateScreen from './src/components/CreateScreen';
import BuyScreen from './src/components/BuyScreen';
import BuyScreenSecond from './src/components/BuyScreenSecond';
import VisualAwarenessScreen from './src/components/VisualAwarenessScreen';
import WriteTheImageScreen from './src/components/WriteTheImage';
import ListenWriteScreen from './src/components/ListenWriteScreen';
import TextToTextScreen from './src/components/TextToTextScreen';
import SayTheImageScreen from './src/components/SayTheImageScreen';
import DrawThisScreen from './src/components/DrawThisScreen';
import PendingDrawingScreen from './src/components/PendingDrawingScreen';
import FriendsListScreen from './src/components/FriendsListScreen';
import Chat from './src/components/Chat';
import ResetPassword from './src/components/ResetPassword';
import NewPost from './src/components/NewPost';

import { Dimensions } from 'react-native';
import I18n from 'react-native-i18n';
// import HomeTitle from './src/components/StartScreen';
import { strings } from './locales/i18n';


import stripe from 'tipsi-stripe';
import testID from './src/utils/testID';

const robotoRegular='Roboto-Bold';
const robotoMedium='Roboto-Medium';
const robotoLight='Roboto-Light';
const robotoBold='Roboto-Bold';

// import ReactNativeTooltipMenu from 'react-native-tooltip-menu';

// import Button from './src/components/Button';
stripe.init({
    publishableKey: 'pk_live_8fAq6qzETYGHbMeecCXWKPWx',
    merchantId: '<MERCHANT_ID>',
    androidPayMode: 'live',
})

global.PaymentRequest = require('react-native-payments').PaymentRequest;


class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Welcome',
        header: null,
    };

    state = {
        loading: false,
        token: null,
        counterItem1: 0,
        counterItem2: 0
    }

    componentWillMount() {
        const { navigate } = this.props.navigation;
        firebase.auth().onAuthStateChanged((user) => {

            if (user) {
                this.setState({ loggedIn: true });
                firebase.database().ref('/users/' + user.uid).once('value')
                    .then(function(snapshot) {
                        
                        if (snapshot.val().languageLearning == 'PT') {

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

                        navigate('Start');
                    });
                // console.log(user);
                
                // console.log(user);
            } else {
                this.setState({ loggedIn: false });
                console.log('neprisilogines...');
            }
        });
    }

    // handleCardPayPress = async (months) => {
    //   try {
    //     this.setState({ loading: true, token: null })
    //     const amount = 500;
    //     console.log('lukas')
    //     console.log(months);

    //     const payment = {token, amount, months}

    //     firebase.database().ref(`/payments/${userId}`)
    //                        .push(payment)
    //                        .then(() => {

    //                         this.setState({ loading: false, token })

    //                       })
    //                       .catch(() => {
    //                         console.log('NEIRASE I DB !!!')
    //                       })

    //     console.log(token);

    //     this.setState({ loading: false, token })
    //   } catch (error) {
    //     this.setState({ loading: false })
    //     console.log('CATCH CIKLAS...')
    //   }
    // }
    handleCardPayPress = async (month) => {
        try {
            this.setState({ loading: true, token: null })
            const amount = 500;
            console.log(month);
            const months = 3;
            const token = await stripe.paymentRequestWithCardForm({
                email: 'kriminalas99@gmail.com',
                // Only iOS support this options
                smsAutofillDisabled: true,
                requiredBillingAddressFields: 'full',
                prefilledInformation: {
                    billingAddress: {
                        name: 'Gunilla Haugeh',
                        line1: 'Canary Place',
                        line2: '3',
                        city: 'Macon',
                        state: 'Georgia',
                        country: 'US',
                        postalCode: '31217',
                        email: 'ghaugeh0@printfriendly.com',
                    },
                },
            })

            const payment = { token, amount, months }

            firebase.database().ref('/payments/123')
                .push(payment)
                .then(() => {

                    console.log(token);
                    this.setState({ loading: false, token })

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

    renderContent() {
        const { navigate } = this.props.navigation;
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        const buttonH = 60;
        const logoViewH = (viewportHeight-60)*0.7;
        const middleViewH = (viewportHeight-60)*0.3;
        const logoImgH = logoViewH*0.8;

        switch (this.state.loggedIn) {
            case false:
                return (
                    <ThemeProvider>
                        <View style={style.homeContainer}>
                            <Image style={style.iconContainer} source={require('./src/assets/start_bg.png')} />
                            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center',}}>
                                <View style={{width:'100%', height:logoViewH, justifyContent:'flex-end', alignItems:'center',  backgroundColor:'transparent'}}>
                                    <View style={{width:logoImgH, height:logoImgH, backgroundColor:'transparent'}}>
                                        <Image style={{ width:'100%', height:'100%',
                                                resizeMode: 'cover',
                                                }} 
                                            source={require('./src/assets/LOGO.png')} />
                                    </View>
                                </View>
                                <View style={{width:'100%', height:middleViewH, justifyContent:'center',alignItems:'center', backgroundColor:'transparent'}}>
                                <Text style={style.textMessage}>{strings('App.what_language')}</Text>
                                </View>

                                <View style={style.bottomContainer}>
                                    <Button style={englishButton}
                                        text={strings('App.english')}
                                        onPress={() => navigate('Login', { lang: 'Portuguese' })} />


                                    <Button style={portugueseButton}
                                        text={strings('App.portuguese')}
                                        onPress={() => navigate('Login', { lang: 'English' })} />
                                </View>
                            </View>
                        </View>
                    </ThemeProvider>
                );
            default:
                return (
                    <Spinner visible={!this.state.loggedIn} />
                );
        }

    }

    render() {
        const { navigate } = this.props.navigation;

        // if (this.state.loggedIn == null) return (<Text>KRAUNASI</Text>)
        return (
            <View>

                {this.renderContent()}
            </View>
        )
    }
}

const englishButton = {
    container: {
        height: 60,
        backgroundColor: '#FE330A',
        padding: 6,
        width: '50%',
    },
    text: {
        fontSize: 16,
        color: "#ffffff",
    }
};

const portugueseButton = {
    container: {
        height: 60,
        backgroundColor: '#FF7F00',
        padding: 6,
        width: '50%',
    },
    text: {
        fontSize: 16,
        color: "#ffffff",
        fontFamily:'Roboto'
    }
};

const style = StyleSheet.create({
    homeContainer: {
        width: '100%',
        height: '100%',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconContainer: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    logo: {
        aspectRatio: 0.75,
        resizeMode: 'contain',
        marginHorizontal: 25,
    },
    textMessage: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily:robotoLight,
     },
    bottomContainer: {
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        padding: 0,
        paddingHorizontal: 0,
        marginHorizontal: 0,
        bottom: 0,
        width: '100%',
    },

});

const SimpleApp = StackNavigator({
    Home: { screen: HomeScreen },
    Login: { screen: LoginForm },
    Profile: { screen: ProfileScreen },
    Start: { screen: StartScreen },
    Buy: { screen: BuyScreen },
    Create: { screen: CreateScreen },
    VisualAwareness: { screen: VisualAwarenessScreen },
    SayTheImage: { screen: SayTheImageScreen },
    TextToText: { screen: TextToTextScreen },
    WriteTheImage: { screen: WriteTheImageScreen },
    ListenWrite: { screen: ListenWriteScreen },
    DrawThis: { screen: DrawThisScreen },
    PendingDrawing: { screen: PendingDrawingScreen },
    FriendsList: { screen: FriendsListScreen },
    Chat: { screen: Chat },
    ResetPassword: { screen: ResetPassword },
    BuyScreenSecond: {screen: BuyScreenSecond },
    NewPost: { screen: NewPost }
    // HomeTitle: {screen: HomeTitle}
});


export default class App extends Component {
    state = { loggedIn: null, language: "" };

    componentWillMount() {

        // firebase.auth().onAuthStateChanged((user) => {
        //   if (user) {
        //     console.log('user is logged');
        //   }
        // }

        firebase.initializeApp({
            apiKey: "AIzaSyCqM9js4iQG-dt-tzSHgUrZ-RA9P3PdTZ0",
            authDomain: "yak-vernac-app.firebaseapp.com",
            databaseURL: "https://yak-vernac-app.firebaseio.com",
            projectId: "yak-vernac-app",
            storageBucket: "yak-vernac-app.appspot.com",
            messagingSenderId: "284275940374"
        });

        // firebase.auth().onAuthStateChanged((user) => {
        //   // const { navigate } = this.props.navigation;
        //   if (user) {
        //     this.setState({ loggedIn: true });
        //     // console.log('logged in! :)')
        //     navigate('Start');
        //     // console.log(user);
        //   } else {
        //     this.setState({ loggedIn: false });
        //     console.log('neprisilogines...');
        //   }
        // });
    }

    renderContent() {

        switch (this.state.language) {
            case "Portuguese":
                return (
                    <LoginForm lang="Portuguese" />
                );
            case "English":
                return (
                    <LoginForm lang="English" />
                );
            default:
                return <LoginForm lang="English" />
        }

    }

    render() {
        return <View style={{ flex: 1 }}>
                 <SimpleApp />
                 <FlashMessage position="top" />
               </View>;
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instruction: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    token: {
        height: 20,
    }
})