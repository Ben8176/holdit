import { Audio } from 'expo-av';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera, FlashMode } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

// const newWords = ['good', 'hello', 'hungry', 'ily', 'im', 'null', 'sleepy', 'thankyou', 'you'];
const newWords = ['good', 'hello'];

const soundFiles = {
  'hello_male': require('../../assets/audio/hello_male.mp3'),
  'hello_female': require('../../assets/audio/hello_female.mp3'),
  'hello_andro': require('../../assets/audio/hello_andro.mp3'),
  'iam_male': require('../../assets/audio/im_male.mp3'),
  'iam_female': require('../../assets/audio/im_female.mp3'),
  'iam_andro': require('../../assets/audio/im_andro.mp3'),
  'hungry_male': require('../../assets/audio/hungry_male.mp3'),
  'hungry_female': require('../../assets/audio/hungry_female.mp3'),
  'hungry_andro': require('../../assets/audio/hungry_andro.mp3'),
  '__male': require('../../assets/audio/null_male.mp3'),
  '__female': require('../../assets/audio/null_female.mp3'),
  '__andro': require('../../assets/audio/null_andro.mp3'),
  'good_male': require('../../assets/audio/good_male.mp3'),
  'good_female': require('../../assets/audio/good_female.mp3'),
  'good_andro': require('../../assets/audio/good_andro.mp3'),
  'iloveyou_male': require('../../assets/audio/ily_male.mp3'),
  'iloveyou_female': require('../../assets/audio/ily_female.mp3'),
  'iloveyou_andro': require('../../assets/audio/ily_andro.mp3'),
  'you_male': require('../../assets/audio/you_male.mp3'),
  'you_female': require('../../assets/audio/you_female.mp3'),
  'you_andro': require('../../assets/audio/you_andro.mp3'),
  'tired_male': require('../../assets/audio/sleepy_male.mp3'),
  'tired_female': require('../../assets/audio/sleepy_female.mp3'),
  'tired_andro': require('../../assets/audio/sleepy_andro.mp3'),
  'thanks_male': require('../../assets/audio/thankyou_male.mp3'),
  'thanks_female': require('../../assets/audio/thankyou_female.mp3'),
  'thanks_andro': require('../../assets/audio/thankyou_andro.mp3'),
};

const VideoScreen = () => {
  const route = useRoute();
  console.log('whats the route param: '+route.params?.chosenVoice);
  const chosenVoice = route.params?.chosenVoice || 'andro';
  console.log('selected in videoscreen: '+chosenVoice);

  let cameraRef = useRef();

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [textFromServer, setTextFromServer] = useState(""); // State to store the text

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  // Fetch text from Flask server
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch("/api/video-to-text");
        const data = await response.json();
        setTextFromServer(data.text); // Assuming the response has a 'text' key
      } catch (error) {
        console.error("Error fetching text:", error);
      }
    };//

  }, []);

  // Create a new instance of the Audio.Sound class
  const sound = new Audio.Sound();

  // Function to play audio
  const playAudio = async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('../../assets/audio/hungry_male.mp3')); // Replace with your audio file
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const playSoundsSequentially = async (soundFiles, newWords, chosenVoice) => {
    console.log('play sound seq');
    for (const newWord of newWords) {
      const soundKey = `${newWord}_${chosenVoice}`;
      const file = soundFiles[soundKey];
      console.log('key: ' + soundKey);
      console.log('file: ' + file);

      if (file) {
        try {
          const sound = new Audio.Sound();
          await sound.loadAsync(file);
          await sound.playAsync();
          console.log('promise');

          await new Promise((resolve) => {
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.didJustFinish) {
                sound.unloadAsync();
                resolve();
              }
            });
          });
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };
  // Usage example - to play only sounds that match the chosenVoice and newWords
  // playSoundsSequentially(soundFiles, newWords, chosenVoice);
  
  let recordVideo = async () => {
    if (!isRecording) {
      // playAudio();
      playSoundsSequentially(soundFiles, newWords, chosenVoice);
      setIsRecording(true);

      let options = {
        quality: "1080p",
        maxDuration: 60,
        mute: true,
      };

      cameraRef.current.recordAsync(options).then((recordedVideo) => {
        setVideo(recordedVideo);
        setIsRecording(false);
      });

    }
  };

  let stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      cameraRef.current.stopRecording();
    }
  };

  //send video to flask server
  const uploadVideo = async (video) => {
    try {
      let formData = new FormData();

      const uriParts = video.uri.split(".");
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

      console.log("Video upload response:", response.data.result);

        //declare an array consisting of an array of the 

      playSoundsSequentially(soundFiles, response.data.result, chosenVoice);

    } catch (error) {
      console.error("Video upload error:", error);
    }
  };

  if (video) {
    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    //display video
    return (
      <SafeAreaView>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
        <Button title="Discard" onPress={() => setVideo(undefined)} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={saveVideo} />
        ) : undefined}
        <Button title="Send 2 flask" onPress={() => uploadVideo(video)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Display the fetched text */}
      <Text>{textFromServer}</Text>

      {/* UI for video recording */}
      <Camera
        style={styles.container}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={isRecording ? stopRecording : recordVideo}
            style={isRecording ? styles.stopButton : styles.startButton}
          >
            <Text style={styles.buttonText}>
              {isRecording ? "STOP" : "START"}
            </Text>
          </TouchableOpacity>
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
  },  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  startButton: {
    backgroundColor: "black",
    paddingHorizontal: 30,  // Reduced for less margin
    paddingVertical: 20,   // Increased for larger button vertically
    borderRadius: 30,      // Rounded corners
    opacity: 1,
  },
  stopButton: {
    backgroundColor: "darkred",
    paddingHorizontal: 30,  // Reduced for less margin
    paddingVertical: 20,   // Increased for larger button vertically
    borderRadius: 30,      // Rounded corners
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",     // Bolder text
    fontSize: 20,           // Increased font size
    textAlign: "center",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  }
});

export default VideoScreen;
