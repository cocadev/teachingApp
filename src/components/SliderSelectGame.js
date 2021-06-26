import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';

export default class SliderSelectGame extends Component {

    state = {
        modalVisible: false,
        xp: 0,
        bought: 0
      };

    componentWillMount() {
        const {currentUser} = firebase.auth();
        console.log(currentUser);
        var userId = currentUser.uid;

        const self = this;

        this.setState({userId:userId});

        firebase.database().ref('/users/' + userId).on('value', function(snapshot) {
            console.log(snapshot.val());
            const values = snapshot.val();

            self.setState({ xp:values.xp, profilePics:values.profilePics });
            
            console.log('VALUES USERNAME' + values.username);

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
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    buyPicture() {
        const { data, userValues } = this.props;
        console.log(data);
        console.log('turiu !!!! ' + this.state.xp);

        const self = this;

        // let result = await this.getUpdatedUser();
        
        var myXP = this.state.xp;
        var profilePics = this.state.profilePics;

        console.log(this.state.profilePics);

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
                console.log('------------ MANO STATE ----------')
                console.log(this.state.profilePics);
            })
            .catch(() => {
                console.log('could not update the profile values!')
            })
        } else {
            self.setState({bought:3});
        }
    }

    renderContent() {
        const { data, userValues } = this.props;

        switch (this.state.bought) {
            case 3:
                return (
                    <View>
                        <Text>You do not have sufficient XP to buy '{data.title}' profile picture!</Text> 
                        <Text>You can go back and search for other awesome items :)</Text>

                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                        <Text>Go Back</Text>
                        </TouchableHighlight>

                    </View>
                )
            case 2:
                return (
                    <View>
                        <Text>Thanks for buying '{data.title}' profile picture!</Text> 
                        <Text>You can go back and search for other awesome items :)</Text>

                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                        <Text>Go Back</Text>
                        </TouchableHighlight>

                    </View>
                )
            case 1: 
                return (
                    <View>
                        <Text>You already have '{data.title}' profile picture!</Text> 
                        <Text>You can go back and search for other awesome items :)</Text>

                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                        <Text>Go Back</Text>
                        </TouchableHighlight>

                    </View>
                )
            default:
                return (
                    <View>
                        <Text>Do you want to buy "{data.title}" for {data.xp} ?</Text>
                        <Text>------------------</Text>
                        <Text></Text>

                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                                
                            }}>
                        <Text>Cancel</Text>
                        </TouchableHighlight>
                        
                        <Text></Text>

                        <TouchableHighlight
                            onPress={() => {
                                this.buyPicture();
                            }}>
                        <Text>Buy</Text>
                        </TouchableHighlight>
                    </View>
                )    
        }
    }

    render () {
        const { data: { title, subtitle, xp }, even, dataFull } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : styles.titleEven]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
            <View>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { 
                //   this.setModalVisible(true); 
                this.props.onSelectLanguage('LUKUTUKAS! ------');
            }}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : styles.subtitleEven]}>
                    <Image
                source={{ uri: illustration }}
                style={styles.image}
                />
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : styles.subtitleEven]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : styles.subtitleEven]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle, even ? styles.subtitleEven : styles.subtitleEven]}
                      numberOfLines={2}
                    >
                        { subtitle }
                    </Text>
                </View>
            </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                    alert('Modal has been closed.');
                }}>
                    <View style={{marginTop: 22}}>
                        {this.renderContent()}
                    </View>
                </Modal>
            </View>
        );
    }
}
