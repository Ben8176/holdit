## holdit

## Inspiration 💡

- How can a mute student, seated in a lecture hall of hearing ones, ask a question that can be heard around the room?
- Why would we expect a hard-of-hearing athlete to supply their own interpreter with them to the Olympic podium?
- What prepares a deaf child for losing sight of her mother in a public space with no ASL speaker in sight?

The inspiration for our CruzHacks project came studying alongside a bright, inquisitive student who happened to be mute. His eagerness to learn and interact was hindered not by his ability, but by the barriers in our communication systems. This sparked a realization. Communication is more than just words; it's about connection, emotion, and understanding.

That's why we've taken CruzHacks as an opportunity to train our own machine learning model to bridge the gap between mute communities and able-bodied individuals. It's more than just a mobile tool; it's the next step towards inclusive conversation. So if someone passes you the phone, just _holdit_!

## What it does 🌟

Our app simplifies communication between diverse individuals who communicate using American Sign Language (ASL) and those who don't. We maintain conversational integrity by allowing facial expressions, ease of use, and native language communication for both parties.

The _holdit!_ app offers the ability to:
- Unobtrusively record the signing motions of an ASL speaker for the duration of a conversation
- Accurately convert these signs to their English language equivalent via a custom-trained deep learning model
- Clearly speak natural-language speech aloud for listening parties

... without the need for pen, paper, or outside interpreters!

## Why it's a game-changer 🚀

Safeguarding the intimacy and accuracy of conversation is vital for conversations ranging from exhilarating to traumatic to academic. A personal interpreter is not always a tenable option, and an equitable solution is lacking from the market. 

For ASL users traveling abroad, opening up a new modality of communication serves as a lifeline. Despite English being the most widely spoken language globally, American Sign Language ranks only as the 8th most used sign language. _Holdit!_ bridges this gap by opening up a new avenue of communication via English, the world's largest pidgin language.

For someone whose first (and only) dialect is ASL, written English is literally a second language. This can result in less fluency in written language. Additionally, children whose hearing loss is identified late may miss critical periods for language acquisition, affecting their ability to learn and master written language.

## How we built it 🛠️

_This is not just an API call -- we built and trained the model very deliberately from the ground up._

Our phone app is built using React Native running on Expo for the frontend, a Long Short Term Memory model (LSTM) implemented with TensorFlow with OpenCV and MediaPipe image processing for the backend, and a Flask server in between to connect the two. 

Unlike other ASL interpretation projects that translate unmoving static images (e.g. ASL alphabet), our objective was to build a model that could learn and infer entire dynamic gestures and movements -- live. To do this, we utilized a TensorFlow LSTM and trained it with our own custom dataset, which involved signing in front of a camera for several hours. We all had a great time learning some basic ASL words and phrases. Yes our forearms are totally beat!

We decided on React Native for its cross-platform compatibility and our previous familiarity with React. We knew we wanted to build a portable solution, so mobile was the obvious choice. Using Expo, we were able to quickly prototype and test our UI + pipeline. 

## Challenges we ran into 🤯

Training the LSTM neural network and producing the training dataset was definitely the most tedious and time-consuming task. If you walked by our hacking table, you would have seen us laughing about the grueling training process. We initially thought that training the network by meticulously signing with perfect motions would produce the highest accuracy. However, this approach later proved to struggle in real-time testing when the camera setup and angles were not ideal. We then introduced some variability in the dataset, posing with different angles and slightly different hand movements for each sign, which dramatically improved our real-time results. 

Another challenge we experienced was recording and sending the video of the signing over the network from React Native to Flask. We wanted to implement a streaming solution using sockets and WebRTC for near real-time translation, which was a tall task given our time constraints. We settled on sending short video clips of sentences and phrases which are then processed as a batch by our backend.

## Accomplishments we're proud of 👏

The frontend development challenge using React Native and Expo was a novel and rewarding experience; what does the user experience look like for a conversation of 2 different modalities? Our final UI/UX feels intuitive and appropriate for the task at hand. We also were able achieve close to 90% accuracy for classifying signs by our LSTM neural network for our short dictionary of words. Combining both a user-friendly frontend with a sophisticated ML backend was something we had never done before, and we definitely think the technical difficulty was well worth the end product.

## What we learned 📚
- ASL is a language full of expression and complicated gestures that can convey elaborate ideas
- React Native and Expo are must-haves for hackathon mobile app development, especially given our prior web dev experience
- Audio and video playback and sending files over the network can be an unexpected challenge, and is something worth practicing
- Never forget the value of accounting for latency between different services
- Deep learning is hard!
- Aiming for higher volumes of data with some variability is ideal for training deep learning models

## What's next for _holdit_! 📱
There were two major limitations of our project: our dictionary size and the latency between recording the signs and interpreting them. To address the first limitation, we would need to implement a much larger and more complex deep learning model (like transformers on the ChatGPT scale) in order to be able to classify thousands of signs so it could be used feasibly in real life. We can also use it to interpolate language and build more natural sounding language from fewer ASL signs. As for the second limitation, streaming the camera feed to the server and accelerating our vision pipeline for near-instant translation would be the next steps in the right direction.

As we move forward, our primary objective is to introduce _holdit!_ to the public and commence more testing with its intended user groups. This phase is crucial for refining our technology to suit real-world applications, specifically focusing on enhancing the technical robustness and user experience of the app. We're psyched about the idea of optimizing our deep learning models for greater sign language recognition capabilities and reducing latency even further. Our dictionary will also grow and grow. Our vision is to see _holdit!_ evolve into a tool that not only connects people but empowers them, fostering a more inclusive and understanding world.
