import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function DetailsScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Details!</Text>
        </View>
    );
}

function CameraScreen({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Settings screen</Text>
        <Button
            title="Go to Details"
            onPress={() => navigation.navigate('Details')}
        />
        </View>
    );
}

const CameraStack = createNativeStackNavigator();

export default function CameraStackScreen() {
    return (
        <CameraStack.Navigator>
            <CameraStack.Screen name="Cameraa" component={CameraScreen} />
            <CameraStack.Screen name="Details" component={DetailsScreen} />
        </CameraStack.Navigator>
    );
}

