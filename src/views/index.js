import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Provider } from 'react-redux';
import { store } from '../redux/store'

import {color} from '../constants';
import Home from './home';
import Camera from './camera';
import Settings from './setting';

const Tab = createBottomTabNavigator();

const screenOptions = ({route}) => ({
    headerShown: false,
    tabBarActiveTintColor: color.primary,
    tabBarInactiveTintColor: 'gray',

    tabBarIcon: ({focused, color, size}) => {
        let iconName;
        let sizeCustom = size;

        if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
            sizeCustom = 29;
        } else if (route.name === 'Cài đặt') {
            iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={sizeCustom} color={color} />;
    },
});

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Tab.Navigator screenOptions={screenOptions}>
                    <Tab.Screen name="Trang chủ">{ () => <Home /> }</Tab.Screen>
                    <Tab.Screen name="Camera">{ () => <Camera /> }</Tab.Screen>
                    <Tab.Screen name="Cài đặt">{ () => <Settings /> }</Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </Provider>
        
    );
}

