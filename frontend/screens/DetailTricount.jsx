import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

export default function DetailTricount({ navigation, route }) {
  const userToken = useSelector((state) => state.users.user.token);
  const [selectedOption, setSelectedOption] = useState('depenses');
  const [tricountData, setTricountData] = useState(null);
  const tricountId = route.params.tricountId;
  const [userId, setUserId] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchTricountData();
      fetchUserId(userToken);
    }, [userToken])
  );

  const fetchTricountData = () => {
    fetch(`http://10.9.1.137:3000/tricount/tricountExpense/${tricountId}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setTricountData(data.tricount);
        }
      })
      .catch(error => {
        console.error("Erreur lors du chargement des données:", error);
      });
  };

  const fetchUserId = async (token) => {
    try {
      const response = await fetch(`http://10.9.1.105:3000/tricount/user/${token}`);
      const data = await response.json();
      setUserId(data.userId);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID utilisateur:", error);
    }
  };

  const ExpenseCards = () => {
    if (!tricountData || !tricountData.expense) {
      return <Text>Aucune dépense</Text>;
    }

    const sortedExpenses = [...tricountData.expense].sort((a, b) => {
      return new Date(b.expense_date) - new Date(a.expense_date);
    });

    return sortedExpenses.map((expense, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.containerContent}>
          <Text style={{fontSize: 30}}>💳</Text>
          <View>
            <Text style={{fontSize: 18, fontWeight: '500'}}>{expense.description}</Text>
            <Text style={{fontSize: 12, fontWeight: '300'}}>Payé par {expense.user.username}</Text>
          </View>
        </View>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{expense.amount}€</Text>
      </View>
    ));
  };

  const DepensesView = () => {
    const totalExpenses = tricountData?.expense?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const myExpenses = tricountData?.expense?.reduce((acc, curr) => {
      if (curr.user._id === userId) {
        return acc + curr.amount;
      }
      return acc;
    }, 0) || 0;
  
    return (
      <View style={styles.containerDepenseView}>
        <View style={styles.containerDepenses}>
          <View style={styles.depense}>
            <Text>Mes Dépenses</Text>
            <Text style={{fontWeight: 'bold'}}>{myExpenses}€</Text>
          </View>
          <View style={styles.depense}>
            <Text>Total des Dépenses</Text>
            <Text style={{fontWeight: 'bold'}}>{totalExpenses}€</Text>
          </View>
        </View>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ExpenseCards />
        </ScrollView>
      </View>
    );
  };

  const EquilibreView = () => {
    const [balances, setBalances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useFocusEffect(
      React.useCallback(() => {
        fetchBalances();
      }, [])
    );
  
    const fetchBalances = () => {
      fetch(`http://10.9.1.137:3000/tricount/balances/${tricountId}`)
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            setBalances(data.balances);
          }
        })
        .catch(error => {
          console.error("Erreur lors du chargement des balances:", error);
        })
        .finally(() => setIsLoading(false));
    };
  
    if (isLoading) {
      return <Text>Chargement...</Text>;
    }
  
    return (
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.equilibreContainer}>
          {balances.map((user, index) => (
            <View key={index} style={styles.balanceCard}>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                {user.userId === userId && <Text style={styles.subtitleText}>Moi</Text>}
              </View>
              <Text style={[
                styles.amount,
                user.balance >= 0 ? styles.positive : styles.negative
              ]}>
                {user.balance >= 0 ? '+' : ''}{user.balance.toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerView}>
        <View style={styles.containerBtnTitle}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Tricount')}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{route.params.tricountTitle}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.Add} 
            onPress={() => navigation.navigate("TricountAddExpense", { 
              tricountId: route.params.tricountId 
            })}
          >
            <Text style={styles.white}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.containerChoice}>
        <TouchableOpacity 
          style={[styles.choice, selectedOption === 'depenses' && styles.activeChoice]}
          onPress={() => setSelectedOption('depenses')}
        >
          <Text style={selectedOption === 'depenses' ? styles.activeText : styles.inactiveText}>
            Dépenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.choice, selectedOption === 'equilibre' && styles.activeChoice]}
          onPress={() => setSelectedOption('equilibre')}
        >
          <Text style={selectedOption === 'equilibre' ? styles.activeText : styles.inactiveText}>
            Équilibre
          </Text>
        </TouchableOpacity>
      </View>

      {selectedOption === 'depenses' ? <DepensesView /> : <EquilibreView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  containerView: {
    width: '100%',
    padding: 16,
  },
  containerBtnTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  Add: {
    backgroundColor: 'black',
    borderRadius: 50,
    height: 56,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  white: {
    color: 'white',
    fontSize: 26
  },
  containerChoice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#F7F7FF',
    borderRadius: 10,
    width: '75%'
  },
  choice: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeChoice: {
    backgroundColor: '#5F6095', 
  },
  inactiveText: {
    color: '#666',
  },
  activeText: {
    color: '#FFF',
    fontWeight: '600',
  },
  containerDepenseView: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  containerDepenses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 10,
    width: '65%',
    marginTop: 15
  },
  depense: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F7F7FF',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  containerContent: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center'
  },
  equilibreContainer: {
    width: '100%',
    padding: 16,
    gap: 8,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  subtitleText: {
    color: '#808080',
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#4CD964',
  },
  negative: {
    color: '#FF3B30',
  },
});