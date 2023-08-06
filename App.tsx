import React from 'react';
import {useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RecordScreen from './screens/RecordScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EditResultScreen from './screens/EditResultScreen';

export type RootStackParamList = {
  Record: undefined;
  Edit: {result: any};
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Record'} component={RecordScreen} />
          <Stack.Screen name={'Edit'} component={EditResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;
