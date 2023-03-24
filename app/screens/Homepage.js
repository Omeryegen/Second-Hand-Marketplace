import { useContext, useEffect } from 'react'
import { Text, StyleSheet, View, FlatList, Pressable, StatusBar } from 'react-native'
import { useState } from 'react'
import Navbar from './components/shared/Navbar'
import { Context } from '../../Context'
import Card from './components/Card'
import { auth } from '../../firebase'
import { useIsFocused } from '@react-navigation/native'
import Empty from './components/shared/Empty'
export default function Homepage ({navigation, route}) {
    const {all, fetchAllItems, changeRotation} = useContext(Context)
    const [category, setCategory] = useState('All')
    const cats = ['All', 'Technology', "Sport", 'Furniture', 'Gaming', 'Decoration', 'Books', 'Clothing']
    const getCat = () =>{
      let arr= []
      all.forEach(element => {
        if(category !== 'All' && category === element.category){
          arr.push(element)
        }
      })
      return arr
    }
    
    
    useEffect(()=>{
      if(!auth.currentUser){
        navigation.replace('Login')
      }else{
        fetchAllItems()
        changeRotation('Homepage')
      }
    },[useIsFocused()])
   return (
      <View style={styles.showcase}>
       <StatusBar/>
       <View style={{height: '9%'}}>
        <FlatList  horizontal={true}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{padding: 10}}  data={cats} renderItem={({item}) => {
          return (
            <Pressable style={{marginEnd: 5}} onPress={() => setCategory(item)} >
              
              <Text style={{color: item === category ? 'orange':'white',fontWeight: 'bold',  backgroundColor:'gray', padding: 5,paddingHorizontal:10, borderRadius: 15}}>{item}</Text>
            </Pressable>
          )
        }} />
       </View>
         {
          category === 'All' || getCat().length > 0 ? 
            <FlatList showsVerticalScrollIndicator={false} style={{width: '90%', paddingHorizontal: 10, marginBottom: '15%'}}  data={category === "All" ? all: getCat()} renderItem={({item}) => {
              return (
                <Card navigation={navigation} item={item}/>
              )
            }} />
            :
            <Empty/>
            
         }
        <Navbar navigation={navigation}/>
      </View>
  )
}

const styles = StyleSheet.create({
 
  showcase: {
    flex: 1,
    display: "flex",
    alignItems: "center", 
  },
  box: {
    width: '100%',
    height: 250,
    display: 'flex',
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 15
  },
  img: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
 
  text: {
    padding: 5,
    fontWeight: 'bold',
    color: "orange"
  }
})