import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';

export default function TabOneScreen() {
  const navigation = useNavigation();

  const handlePressOk = () => {
    navigation.navigate('VideoScreen');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://www.clker.com/cliparts/a/b/1/0/1260065522493659183deaf-symbol.svg.med.png' }} 
        style={styles.imageIcon}
      />
      <Text style={styles.title}>HI!</Text>
      <Text style={styles.subtitle}>I am deaf.</Text>
      <Text style={styles.additionalText}>Film me to converse.</Text>
      <TouchableOpacity style={styles.button} onPress={handlePressOk}>
        <Text style={styles.buttonText}>LET'S GO!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  imageIcon: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 30,
    color: 'black',
    marginBottom: 5,
  },
  additionalText: {
    fontSize: 30,
    color: 'black',
    marginBottom: 25,
  },
  button: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
