import WelcomeScreen from "./app/screens/WelcomeScreen";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Homepage from "./app/screens/Homepage";
import Provider from "./Context";
import {Add} from './app/screens/Add'
import SingleItem from './app/screens/SingleItem'
import Profile from './app/screens/Profile'
import MyListings from "./app/screens/MyListings";
import Register from './app/screens/Register'
import Messages from "./app/screens/Messages";
import Message from "./app/screens/Message";

export default function App() {
  const Stack = createNativeStackNavigator()
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator  >
          <Stack.Screen name="Login" component={WelcomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="Homepage" component={Homepage} options={{headerShown: false}} />
          <Stack.Screen name="Add" component={Add} options={{headerShown: false}} />      
          <Stack.Screen name="Single" component={SingleItem} options={{headerShown: false}} />      
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: true, headerTintColor:'orange'}} />      
          <Stack.Screen name="MyListings" component={MyListings} options={{headerShown: true, headerTintColor:'orange'}} />      
          <Stack.Screen name="Register" component={Register} options={{headerShown: false}} />      
          <Stack.Screen name="Messages" component={Messages} options={{headerShown: true, headerTintColor:'orange'}} />      
          <Stack.Screen name="Message" component={Message}  options={{headerShown: false,}} />      
        </Stack.Navigator> 
      </NavigationContainer>
    </Provider>
  )
}

