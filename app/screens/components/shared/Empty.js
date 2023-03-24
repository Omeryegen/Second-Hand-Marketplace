import { StyleSheet, View } from 'react-native'
import React from 'react'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
export default function Empty() {
  return (
    <View style={styles.container} >
        {  
           <FontAwesomeIcon size={80}  color='gray' icon={faTrashCan}/>
 
        }
     
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        height: '80%'
    }
})