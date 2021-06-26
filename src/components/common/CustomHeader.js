import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Dimensions } from 'react-native';

class CustomHeader extends React.Component {

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
        {/* <Icon name='area-chart' style={{fontSize:20,color:'white'}} /> */}
        <Icon name='home'  type='FontAwesome' color='white' onPress={() => this.props.navigation.navigate('Start')}/>
        </View>
        </View>
      );
    }
  }

  export { CustomHeader };
