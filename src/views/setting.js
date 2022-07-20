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

function SettingsScreen({navigation}) {
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

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen() {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen name="Settingss" component={SettingsScreen} />
            <SettingsStack.Screen name="Details" component={DetailsScreen} />
        </SettingsStack.Navigator>
    );
}

