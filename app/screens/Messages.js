import { FlatList, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { auth } from '../../firebase'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Context } from '../../Context'

export default function Messages({navigation}) {
 const{chats,getChats} = useContext(Context)
 
 useEffect(()=>{
    getChats()
}, [])
  return (
    <View style={{flex: 1}}>  
      <FlatList data={chats} renderItem={({item})=> {
        return(
            <TouchableOpacity onPress={()=>{navigation.navigate('Message', {chat:item.chat})}} style={{backgroundColor:'white', flexDirection: 'row', alignItems:'center', padding:18, justifyContent:'space-between'}}>
                <View>
                    <Text style={{fontWeight: 'bold', marginBottom: 5, fontSize: 18}}>{item.chat[0].to !== auth.currentUser.displayName ? item.chat[0].to : item.chat[0].from}</Text>
                    <Text style={{color: 'black', fontSize: 16}}> {item.chat[item.chat.length -1].message}</Text>
                </View>
                <View  >
                    <FontAwesomeIcon size={20}  icon={faArrowRight}/>
                </View>
            </TouchableOpacity> 
        ) 
      }}/>
    </View>
  )
}

