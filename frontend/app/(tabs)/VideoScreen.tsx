import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const VideoScreen = () => {
  useEffect(() => {
    // Set audio mode
    const setAudioMode = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    };

    // Create a new instance of the Audio.Sound class
    const sound = new Audio.Sound();

    const loadAndPlay = async () => {
      try {
        console.log('Loading Sound');
        await setAudioMode();
        await sound.loadAsync(require('../../assets/audio/fart-01.mp3'));
        console.log('Playing Sound');
        const playbackStatus = await sound.playAsync();
        console.log('Playback Status', playbackStatus);

        if (!playbackStatus.isPlaying) {
          console.log('Sound is not playing - check playback status for details');
        }
      } catch (error) {
        console.error('Failed to load and play the sound', error);
      }
    };

    loadAndPlay();

    return () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Your additional screen content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default VideoScreen;
