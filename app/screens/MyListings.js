import { Button, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { Context } from '../../Context'
import { auth } from '../../firebase'
import { FlatList } from 'react-native'
import Empty from './components/shared/Empty'
import { deleteDoc, doc, collection, where, query, getDocs, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const MyListings = () => {
    const {all, fetchAllItems} = useContext(Context)
    

    const deleteItem = async (id) =>{
        const itemsRef = collection(db, "items");
        const q = query(itemsRef, where("itemId", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (res)=>{
          await deleteDoc(doc(db, "items", res.id));
          fetchAllItems()
        })
        }
      

    const getCat = () =>{
        let arr= []
        all.forEach(element => {
            if(element.ownerEmail === auth.currentUser.email){
            arr.push(element)
            }
        })
        return arr
    }

  return (
    <View>
        {
            getCat().length > 0 ? <FlatList data={getCat()} contentContainerStyle={{padding: 10}} renderItem={({item})=>{
                return(
                <View   style={styles.box} key={item.itemId} >
                    <ImageBackground borderTopLeftRadius={15} borderTopRightRadius={15} resizeMode='cover' style={styles.img} source={{uri: item.url}}/>
                    <Text style={[styles.text, {color: 'black'}]}>{item.item}</Text>
                    <Text style={[styles.text, {marginBottom: 10}]} >${item.price}</Text>
                    <Button onPress={()=> deleteItem(item.itemId)} title='Delete'/>
                </View>
                )
            }}/> : <Empty/>
        }
      
    </View>
  )
}

export default MyListings

const styles = StyleSheet.create({
 
    showcase: {
      flex: 1,
      display: "flex",
      alignItems: "center", 
    },
    box: {
      width: '100%',
      display: 'flex',
      backgroundColor: "#fff",
      marginBottom: 30,
      borderRadius: 15
    },
    img: {
      width: "100%",
      height: 120,
      marginBottom: 5,
    },
   
    text: {
      padding: 5,
      fontWeight: 'bold',
      color: "orange"
    }
  })