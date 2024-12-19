import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Platform
} from "react-native";
import { useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;





export default function GroceryListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const colocToken = useSelector((state) => state.users.coloc.token);
  const backendUrl = "http://10.9.1.105:3000";

  const fetchProducts = async (colocToken) => {
    if (!colocToken) {
      Alert.alert("Erreur", "Token de colocation manquant");
      return;
    }

    const response = await fetch(
      `${backendUrl}/product/getproducts/${colocToken}`
    );
    const data = await response.json();
    setProducts(data);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `${backendUrl}/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleCheckboxChange = (productId) => {
    setCheckedItems((prev) => {
      const newCheckedItems = new Set(prev);
      newCheckedItems.add(productId);
      return newCheckedItems;
    });

    // Suppression après 2 secondes
    setTimeout(() => {
      handleDelete(productId);
    }, 500);
  };

  useEffect(() => {
    fetchProducts(colocToken);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts(colocToken);
      setCheckedItems(new Set()); // Réinitialise les cases cochées
    });

    return unsubscribe;
  }, [navigation, colocToken]);

  const urgentProducts = products.filter((p) => p.isUrgent);
  const normalProducts = products.filter((p) => !p.isUrgent);

  const ProductItem = ({ product, isUrgent }) => {
    const isChecked = checkedItems.has(product._id);

    return (
      <View
        style={[
          isUrgent ? styles.urgentItem : styles.normalItem,
          isChecked && styles.checkedItem,
        ]}
      >
        <View style={styles.productContainer}>
          <Text style={[styles.productName, isChecked && styles.checkedText]}>
            {product.name}
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={() =>
              !isChecked && handleCheckboxChange(product._id)
            }
            disabled={isChecked}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
          {products.length} produits à acheter dont {urgentProducts.length}{" "}
          urgent
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {urgentProducts.length > 0 && (
          <View style={styles.urgentSection}>
            <Text style={styles.sectionTitle}>Urgent</Text>
            <View style={styles.urgentGrid}>
              {urgentProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  isUrgent={true}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.normalSection}>
          <Text style={styles.sectionTitle}>Autres produits</Text>
          {normalProducts.map((product) => (
            <ProductItem key={product._id} product={product} isUrgent={false} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(247, 247, 255)",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: "rgb(247, 247, 255)",
    zIndex: 1,
    paddingTop: Platform.OS === 'android' ? 10 : 16,
  },
  containerBtnTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  Add: {
    backgroundColor: "black",
    borderRadius: 28,
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  white: {
    color: "white",
    fontSize: 26,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
    marginBottom: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
  },
  urgentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  urgentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: 'space-between',
  },
  urgentItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: windowWidth * 0.42,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  normalSection: {
    flex: 1,
  },
  normalItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  productName: {
    fontSize: 16,
    flex: 1,
    paddingRight: 8,
  },
  checkbox: {
    marginLeft: 10,
  },
  checkedItem: {
    opacity: 0.5,
    backgroundColor: "#f0f0f0",
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
 });