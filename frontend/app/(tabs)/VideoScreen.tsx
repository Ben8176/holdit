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
import axios from 'axios';
import * as FS from "expo-file-system"; // for sending mov file

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

  let recordVideo = async () => {
    setIsRecording(true);
    let options = {
      quality: "720p",
      maxDuration: 60,
      mute: true,
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });

    // Set a timer for 1 second
    setTimeout(() => {
      stopRecording(); // Call the function to stop recording after 1 second
    }, 3000); // 1000 milliseconds = 1 second
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

    //send video to flask server
    const uploadVideo = async (video) => {
      try {
        let formData = new FormData();

        const uriParts = video.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append("file", {
          uri: video.uri,
          type: `video/${fileType}`,
          name: `video.${fileType}`,
        });

        const response = await axios.post(
          "http://169.233.123.198:5000/api/video-to-text",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Video upload response:", response.data);
      } catch (error) {
        console.error("Video upload error:", error);
      }
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
      <Button title="Send 2 flask" onPress={() => uploadVideo(video)} />
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
