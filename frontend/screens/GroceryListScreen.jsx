import React, { useEffect, useState } from "react";
import {
 View,
 StyleSheet,
 Text,
 TouchableOpacity,
 SafeAreaView,
 Image,
} from "react-native";

export default function GroceryListScreen({ navigation }) {
 const [products, setProducts] = useState([]);
 
 const fetchProducts = async () => {
   const response = await fetch('http://10.9.1.140:3000/product/getproducts'); 
   const data = await response.json();
   setProducts(data);
 };

 useEffect(() => {
   fetchProducts();
 }, []);

 useEffect(() => {
   const unsubscribe = navigation.addListener('focus', () => {
     fetchProducts();
   });

   return unsubscribe;
 }, [navigation]);

 const urgentProducts = products.filter(p => p.isUrgent);
 const normalProducts = products.filter(p => !p.isUrgent);

 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.containerView}>
       <View style={styles.containerBtnTitle}>
         <Text style={styles.title}>Liste de Course</Text>
         <TouchableOpacity 
           style={styles.Add} 
           onPress={() => navigation.navigate("AjoutProduct")}
         >
           <Text style={styles.white}>+</Text>
         </TouchableOpacity>
       </View>

       <Text style={styles.subtitle}>
         {products.length} produits à acheter dont {urgentProducts.length} urgent
       </Text>

       {urgentProducts.length > 0 && (
         <View style={styles.urgentSection}>
           <Text style={styles.sectionTitle}>Urgent</Text>
           <View style={styles.urgentGrid}>
             {urgentProducts.map(product => (
               <View key={product._id} style={styles.urgentItem}>
                 <Text style={styles.productName}>{product.name}</Text>
               </View>
             ))}
           </View>
         </View>
       )}

       <View style={styles.normalSection}>
         {normalProducts.map(product => (
           <View key={product._id} style={styles.normalItem}>
             <Text style={styles.productName}>{product.name}</Text>
           </View>
         ))}
       </View>
     </View>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "rgb(247, 247, 255)",
 },
 containerView: {
   width: '100%',
   padding: 16,
 },
 containerBtnTitle: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 16,
 },
 Add: {
   backgroundColor: 'black',
   borderRadius: 50,
   height: 56,
   width: 56,
   justifyContent: 'center',
   alignItems: 'center',
 },
 white: {
   color: 'white',
   fontSize: 26,
 },
 title: {
   fontSize: 24,
   fontWeight: "bold",
 },
 subtitle: {
   color: 'gray',
   fontSize: 14,
   marginBottom: 20,
 },
 urgentSection: {
   marginBottom: 24,
 },
 sectionTitle: {
   fontSize: 18,
   fontWeight: '600',
   marginBottom: 12,
 },
 urgentGrid: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   gap: 12,
 },
 urgentItem: {
   backgroundColor: 'white',
   padding: 16,
   borderRadius: 8,
   width: '48%',
   marginBottom: 12,
 },
 normalItem: {
   backgroundColor: 'white',
   padding: 16,
   borderRadius: 8,
   marginBottom: 8,
 },
 productName: {
   fontSize: 16,
 },
});