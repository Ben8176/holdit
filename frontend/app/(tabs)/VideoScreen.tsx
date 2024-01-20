// The following packages need to be installed using the following commands:
// expo install expo-camera
// expo install expo-media-library
// expo install expo-sharing
// expo install expo-av

import { Audio } from 'expo-av';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const VideoScreen = () => {

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Permission not granted</Text>;
  }

  // useEffect(() => {
  //   // const setAudioMode = async () => {
  //   //   await Audio.setAudioModeAsync({
  //   //     playsInSilentModeIOS: true,
  //   //     staysActiveInBackground: true,
  //   //   });
  //   // };

  //   (async () => {
  //     const cameraPermission = await Camera.requestCameraPermissionsAsync();
  //     const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
  //     const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

  //     setHasCameraPermission(cameraPermission.status === "granted");
  //     setHasMicrophonePermission(microphonePermission.status === "granted");
  //     setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
  //   })();
  // }, []);

  //   if (!hasCameraPermission) {
  //     return <Text>Permission for camera not granted.</Text>
  //   }

  //   let recordVideo = () => {
  //     setIsRecording(true);
  //     let options = {
  //       quality: "1080p",
  //       maxDuration: 60,
  //       mute: false
  //     };
  
  //     cameraRef.current.recordAsync(options).then((recordedVideo) => {
  //       setVideo(recordedVideo);
  //       setIsRecording(false);
  //     });
  //   };

  //   let stopRecording = () => {
  //     setIsRecording(false);
  //     cameraRef.current.stopRecording();
  //   };

  //   if (video) {
  //     let shareVideo = () => {
  //       shareAsync(video.uri).then(() => {
  //         setVideo(undefined);
  //       });
  //     };
  
  //     let saveVideo = () => {
  //       MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
  //         setVideo(undefined);
  //       });
  //     };
  
  //     return (
  //       <SafeAreaView style={styles.container}>
  //         <Video
  //           style={styles.video}
  //           source={{uri: video.uri}}
  //           useNativeControls
  //           resizeMode='contain'
  //           isLooping
  //         />
  //         <Button title="Share" onPress={shareVideo} />
  //         {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
  //         <Button title="Discard" onPress={() => setVideo(undefined)} />
  //       </SafeAreaView>
  //     );
  //   }

  //   // Create a new instance of the Audio.Sound class
  //   // const sound = new Audio.Sound();

  //   // const loadAndPlay = async () => {
  //   //   try {
  //   //     console.log('Loading Sound');
  //   //     await setAudioMode();
  //   //     await sound.loadAsync(require('../../assets/audio/fart-01.mp3'));
  //   //     console.log('Playing Sound');
  //   //     const playbackStatus = await sound.playAsync();

  //   //     if (playbackStatus.isLoaded) {
  //   //       // Check if the audio is playing
  //   //       if (playbackStatus.isPlaying) {
  //   //         console.log('Sound is playing');
  //   //       } else {
  //   //         console.log('Sound loaded but not playing');
  //   //       }
  //   //     } else {
  //   //       if (playbackStatus.error) {
  //   //         console.log(`Playback Error: ${playbackStatus.error}`);
  //   //       }
  //   //     }
  //   //   } catch (error) {
  //   //     console.error('Failed to load and play the sound', error);
  //   //   }
  //   // };

  //   // loadAndPlay();

  //   return () => {
  //     // console.log('Unloading Sound');
  //     // sound.unloadAsync();
  //     <Camera style={styles.container} ref={cameraRef}>
  //       <View style={styles.buttonContainer}>
  //         <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
  //       </View>
  //     </Camera>
  //   };

  let recordVideo = async () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: true
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
        setVideo(recordedVideo);
        setIsRecording(false);
    });
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };
    //display video
    return <SafeAreaView>
      <Video
        style={styles.video}
        source={{uri: video.uri}}
        useNativeControls
        resizeMode='contain'
        isLooping
      />
      <Button title="Discard" onPress={() => setVideo(undefined)} />
      {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
    </SafeAreaView>
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      {/* Your additional screen content goes here */}
      <View style={styles.buttonContainer}>
        <Button title={isRecording ? "Stop Recording" : "Record"} onPress={isRecording ? stopRecording : recordVideo}></Button>
      </View>
    </Camera>
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
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  }
});

export default VideoScreen;
