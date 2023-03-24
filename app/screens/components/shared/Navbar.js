import {  StyleSheet,   View, Pressable } from 'react-native'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser,faPlusCircle, faHouse } from '@fortawesome/free-solid-svg-icons'
import { Context } from '../../../../Context'
export default function Navbar({navigation}) {
  
  const{rotation, changeRotation} = useContext(Context)
    const handlePress = () =>{
        changeRotation('Homepage')
        navigation.navigate('Homepage') 
    }
    const handleAdd = () =>{
      changeRotation('Add')
      navigation.navigate('Add')
  }
    const handleProfile = () =>{
      changeRotation('Profile')
      navigation.navigate('Profile')
  }
  return (
    <View style={{width: '100%', height: '10%', display:'flex' ,flexDirection:'row', justifyContent:'space-around', alignItems:'center', backgroundColor:'white', position: 'absolute', bottom:0}}>
        <Pressable style={{padding: 20}}  onPress={handlePress}>
          <FontAwesomeIcon color={rotation === 'Homepage' ? 'orange' : 'gray'} size={24} icon={faHouse}/>
        </Pressable>
        <Pressable style={{padding: 20, borderRadius: 50, backgroundColor: rotation === 'Add' ? 'orange' : 'gray', bottom: 25, borderWidth: 5, borderColor: 'white'}}  onPress={handleAdd}>
          <FontAwesomeIcon color='white' size={24} icon={faPlusCircle}/>
        </Pressable>
        <Pressable style={{padding: 20}} onPress={handleProfile} >
          <FontAwesomeIcon color={rotation === 'Profile' ? 'orange' : 'gray'} size={24} icon={faUser}/>
        </Pressable>
    </View>
  )
}
