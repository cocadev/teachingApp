import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { Button, Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import ElevatedView from 'react-native-elevated-view'

import { Dimensions } from 'react-native';

export default class SliderEntryVIP extends Component {

    state = {
        modalVisible: false,
        xp: 0,
        bought: 0
      };

    componentWillMount() {
        const {currentUser} = firebase.auth();
        // console.log(currentUser);
        var userId = currentUser.uid;

        const self = this;

        this.setState({userId:userId});

        firebase.database().ref('/users/' + userId).on('value', function(snapshot) {
            // console.log(snapshot.val());
            const values = snapshot.val();

            self.setState({ xp:values.xp, profilePics:values.profilePics, MyislandPics:values.islandPics, languageLearning:values.languageLearning });
            
            // console.log('VALUES USERNAME' + values.username);

            })
    }
    // componentWillUnmount() {
    //     console.log('UNMOUNTAS!!!!');
    // }

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : styles.imageContainerEven]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <View>
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
            
            </View>
        );
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    buyPicture() {
        const { data, userValues } = this.props;
        console.log('turiu !!!!');
        console.log(data);
        console.log('turiu !!!!');

        const self = this;

        // let result = await this.getUpdatedUser();
        
        var myXP = this.state.xp;
        var profilePics = this.state.profilePics;
        var MyislandPics = this.state.MyislandPics;

        // console.log(this.state.profilePics);

        if(data.hasOwnProperty('type')) { 

            if (this.state.MyislandPics.filter(function(e) { return e.title === data.title; }).length > 0) {
                self.setState({bought:1});
            } else if (myXP - data.xp >= 0) {
                var restXP = myXP - data.xp;
                
                MyislandPics.push(data);
                var newArray = MyislandPics;

                firebase.database().ref(`/users/${this.state.userId}`)
                .update({xp:restXP, islandPics:newArray})
                .then(() => {
                    self.setState({bought:2, xp:restXP, MyislandPics:newArray})
                })
                .catch(() => {
                    console.log('could not update the profile values!')
                })

            } else {
                self.setState({bought:3});
            }

        } else {     

            if (this.state.profilePics.filter(function(e) { return e.title === data.title; }).length > 0) {
                self.setState({bought:1});    
            } else if (myXP - data.xp >= 0 ) {
                var restXP = myXP - data.xp;

                profilePics.push(data);
                var newArray = profilePics;

                firebase.database().ref(`/users/${this.state.userId}`)
                .update({xp:restXP, profilePics:newArray})
                .then(() => {
                    self.setState({bought:2, xp:restXP, profilePics:newArray})
                })
                .catch(() => {
                    console.log('could not update the profile values!')
                })            
                
            } else {
                self.setState({bought:3});
            }

        }
    }

    render () {
        const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
        const { data: { PTdescription, PTtitle, title, description, subtitle, xp, illustration }, even, dataFull } = this.props;

        if (this.state.languageLearning == 'PT') {
            var myTitle = title;
            var myDescription = description;
        } else {
            var myTitle = PTtitle;
            var myDescription = PTdescription;
        }

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : styles.titleEven]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        var newwidth = viewportWidth;

        return (
            <View style={{width:newwidth, justifyContent:'center',alignItems:'center' }}>
            <View style={{ width:100, height:100,  marginLeft: 30, marginRight: 70, backgroundColor:'white' }}>
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
            
           </View>
            <Text style={{ textAlign:'center', marginTop:15, marginLeft: 30, marginRight: 70, fontWeight:'bold', fontSize:20, color:'#EE202E'}}>{myTitle}</Text>
            <Text style={{ textAlign:'center',marginTop:15, marginLeft: 30, marginRight: 70, color:'#63B1DC'}}>{myDescription}</Text>

            </View>
        );
    }
}
