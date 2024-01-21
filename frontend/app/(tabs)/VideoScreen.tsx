import { Audio } from 'expo-av';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button } from 'react-native';
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
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);
  

  // Fetch text from Flask server
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch('/api/video-to-text');
        const data = await response.json();
        setTextFromServer(data.text); // Assuming the response has a 'text' key
      } catch (error) {
        console.error('Error fetching text:', error);
      }
    };

    fetchText();
  }, []);

    // Create a new instance of the Audio.Sound class
    const sound = new Audio.Sound();
  

  // Function to play audio
    const playAudio = async () => {
      try {
        console.log('Loading Sound');
        // await setAudioMode();
        await sound.loadAsync(require('../../assets/audio/ily_andro.mp3'));
        console.log('Playing Sound');
        const playbackStatus = await sound.playAsync();

        if (playbackStatus.isLoaded) {
          // Check if the audio is playing
          if (playbackStatus.isPlaying) {
            console.log('Sound is playing');
          } else {
            console.log('Sound loaded but not playing');
          }
        } else {
          if (playbackStatus.error) {
            console.log(`Playback Error: ${playbackStatus.error}`);
          }
        }
      } catch (error) {
        console.error('Failed to load and play the sound', error);
      }
    };

    playAudio(); // Play audio after fetching the text


  let recordVideo = async () => {
    if (!isRecording) {
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
    }
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

    return (
      <SafeAreaView>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <Button title="Discard" onPress={() => setVideo(undefined)} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Display the fetched text */}
      <Text>{textFromServer}</Text>

      {/* UI for video recording */}
      <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={isRecording ? stopRecording : recordVideo}
            style={isRecording ? styles.stopButton : styles.startButton}
          >
            <Text style={styles.buttonText}>{isRecording ? "STOP" : "START"}</Text>
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
