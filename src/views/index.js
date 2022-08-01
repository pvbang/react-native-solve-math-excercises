import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, View, Text, TouchableOpacity, Modal, Animated} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { Provider } from 'react-redux';
import { store } from '../redux/store'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';

import {color} from '../constants';
import Home from './home';
import Search from './search';
import Settings from './setting';
import CameraButton from './cameraButton';

const screenOptions = ({route}) => ({
    
    headerShown: false,
    tabBarActiveTintColor: color.primary,
    tabBarInactiveTintColor: 'gray',

    tabBarShowLabel: false,
    tabBarStyle:{
        height: 57
    },

    tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Tìm kiếm') {
            return (
                <CameraButton/>
            )
        } else if (route.name === 'Cài đặt') {
            iconName = focused ? 'settings' : 'settings-outline';
        }
        
        return (
            <View style={{position: 'absolute', margin: 0, padding: 0, alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons name={iconName} size={23} color={color} />
                <Text style={{color: color, fontSize: 11, fontFamily: 'opensans_medium'}}>{route.name}</Text>
            </View>
        );
    },
});

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Tab.Navigator screenOptions={screenOptions}>
                    <Tab.Screen name="Trang chủ" component={Home}></Tab.Screen>
                    <Tab.Screen name="Tìm kiếm" component={Search}></Tab.Screen>
                    <Tab.Screen name="Cài đặt" component={Settings}></Tab.Screen>
                </Tab.Navigator>   
            </NavigationContainer>
        </Provider>
    );
}