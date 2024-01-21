import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '@/constants/Colors';

export default function EditScreenInfo({ path }: { path: string }) {
  const [selectedVoice, setSelectedVoice] = useState('Male');
  type VoiceOption = 'male' | 'female' | 'andro';

  const handleVoiceChange = (voice: VoiceOption) => {
    setSelectedVoice(voice);
  };

  const getVoiceOptionStyle = (voice: VoiceOption) => ({
    ...styles.voiceOption,
    backgroundColor: selectedVoice === voice ? 'teal' : 'gray',
  });

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="account-voice" size={80} color={Colors.light.tint} />
      <Text style={styles.headerText}>Please Select Your Voice</Text>

      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={getVoiceOptionStyle('male')}
          onPress={() => handleVoiceChange('male')}>
          <Text style={styles.voiceText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getVoiceOptionStyle('female')}
          onPress={() => handleVoiceChange('female')}>
          <Text style={styles.voiceText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getVoiceOptionStyle('andro')}
          onPress={() => handleVoiceChange('andro')}>
          <Text style={styles.voiceText}>Androgynous</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white', // Assuming you want a white background
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white'
  },
  settingsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  voiceOption: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceText: {
    color: 'white',
    textAlign: 'center',
  },
});
