// screens/VideoScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VideoScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Video Screen</Text>
      {/* Your screen content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoScreen;
