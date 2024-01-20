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
  const [textFromServer, setTextFromServer] = useState(''); // State to store the text


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

    // Fetch text from Flask server
    useEffect(() => {
      const fetchText = async () => {
        try {
          const response = await fetch('http://your-flask-server.com/api/video-to-text');
          const data = await response.json();
          setTextFromServer(data.text); // Assuming the response has a 'text' key
        } catch (error) {
          console.error('Error fetching text:', error);
        }
      };
  
      fetchText();
    }, []);


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
    <SafeAreaView style={styles.container}>
      {/* Display the fetched text */}
      <Text>{textFromServer}</Text>

      {/* Existing UI for video recording */}
      <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Button title={isRecording ? "Stop Recording" : "Record"} onPress={isRecording ? stopRecording : recordVideo} />
        </View>
      </Camera>
    </SafeAreaView>
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
