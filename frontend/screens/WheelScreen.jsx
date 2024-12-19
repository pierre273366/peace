import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, TextInput, ScrollView, Dimensions, SafeAreaView, Alert, Platform,StatusBar } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import FontAwesome from "react-native-vector-icons/FontAwesome";


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(screenWidth - 32, screenHeight * 0.5); // Ajusté pour éviter le débordement vertical


const WheelPage = ({ navigation }) => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);


  
  const addOption = () => {
    if (newOption.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer une option');
      return;
    }
    setOptions(prevOptions => [...prevOptions, newOption.trim()]);
    setNewOption('');
  };

  const removeOption = (index) => {
    setOptions(prevOptions => {
      const newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      return newOptions;
    });
  };

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const spinWheel = () => {
    if (spinning || options.length < 2) return;
    
    setSpinning(true);
    rotateAnim.setValue(0);
    
    const randomDegrees = getRandomInt(0, 360);
    const selectedIndex = Math.floor(randomDegrees / (360 / options.length));

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 6000,
      easing: Easing.bezier(0.2, 0.6, 0.1, 1),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);
      setSelectedItem(options[options.length - 1 - selectedIndex]);
    });
  };

  const createWheel = () => {
    if (options.length < 2) return null;

    let paths = [];
    let texts = [];
    const radius = WHEEL_SIZE / 2 - 10;
    const centerX = WHEEL_SIZE / 2;
    const centerY = WHEEL_SIZE / 2;
    const anglePerItem = 360 / options.length;

    options.forEach((option, index) => {
      const startAngle = (index * anglePerItem * Math.PI) / 180;
      const endAngle = ((index + 1) * anglePerItem * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const path = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
      
      paths.push(
        <Path
          key={`path-${index}`}
          d={path}
          fill={`hsl(${(360 / options.length) * index}, 70%, 50%)`}
          stroke="#fff"
          strokeWidth="2"
        />
      );

      const textAngle = startAngle + (anglePerItem / 2 * Math.PI) / 180;
      const textRadius = radius * 0.6;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);
      
      texts.push(
        <SvgText
          key={`text-${index}`}
          x={textX}
          y={textY}
          fill="white"
          textAnchor="middle"
          fontSize={WHEEL_SIZE * 0.04}
          transform={`rotate(${(index * anglePerItem) + (anglePerItem / 2)}, ${textX}, ${textY})`}
        >
          {option}
        </SvgText>
      );
    });

    return [...paths, ...texts];
  };

  const renderOptions = () => {
    if (options.length <= 3) {
      return options.map((option, index) => (
        <View key={index} style={styles.optionItem}>
          <Text style={styles.optionText} numberOfLines={1}>
            {option}
          </Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeOption(index)}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ));
    } else {
      return (
        <View style={styles.optionsGrid}>
          {options.map((option, index) => (
            <View key={index} style={styles.optionItemCompact}>
              <Text style={styles.optionTextCompact} numberOfLines={1}>
                {option}
              </Text>
              <TouchableOpacity 
                style={styles.removeButtonCompact}
                onPress={() => removeOption(index)}
              >
                <Text style={styles.removeButtonTextCompact}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }
  };

  const interpolatedRotateAnimation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 * 16}deg`],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.iconContainer}
            >
              <FontAwesome
                name={"arrow-circle-left"}
                size={35}
                color="rgb(255, 139, 228)"
              />
            </TouchableOpacity>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            value={newOption}
            onChangeText={setNewOption}
            placeholder="Entrez une option"
            placeholderTextColor="#666"
            onSubmitEditing={addOption}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addOption}
          >
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsList}>
          {renderOptions()}
        </View>

        {options.length >= 2 ? (
          <View style={styles.wheelContainer}>
            <Animated.View
              style={[
                styles.wheel,
                { transform: [{ rotate: interpolatedRotateAnimation }] }
              ]}
            >
              <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
                <G>{createWheel()}</G>
              </Svg>
            </Animated.View>
            <View style={styles.pointer} />
            
            <TouchableOpacity
              style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
              onPress={spinWheel}
              disabled={spinning}
            >
              <Text style={styles.spinButtonText}>
                {spinning ? 'En cours...' : 'Tourner la roue'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.instructionText}>
            Ajoutez au moins 2 options pour faire apparaître la roue
          </Text>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
  },
  inputSection: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 16,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: Platform.OS === 'android' ? 46 : 40,
  },
  addButton: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsList: {
    marginBottom: 16,
    maxHeight: screenHeight * 0.3,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  optionItemCompact: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    minHeight: 40,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  optionTextCompact: {
    flex: 1,
    fontSize: 14,
    marginRight: 4,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonCompact: {
    padding: 2,
  },
  removeButtonText: {
    color: '#FF5252',
    fontSize: 24,
    fontWeight: 'bold',
  },
  removeButtonTextCompact: {
    color: '#FF5252',
    fontSize: 20,
    fontWeight: 'bold',
  },
  wheelContainer: {
    alignItems: 'center',
    marginVertical: Platform.OS === 'android' ? 12 : 16,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: WHEEL_SIZE / 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pointer: {
    position: 'absolute',
    top: 10,
    width: 20,
    height: 40,
    backgroundColor: '#FF5252',
    zIndex: 1,
    borderRadius: 5,
    elevation: 6,
  },
  spinButton: {
    backgroundColor: '#4CAF50',
    padding: Platform.OS === 'android' ? 12 : 15,
    borderRadius: 25,
    marginTop: 20,
    minWidth: 150,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  spinButtonDisabled: {
    backgroundColor: '#999',
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    padding: 16,
  },
  resultContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1976D2',
  },
});

export default WheelPage;