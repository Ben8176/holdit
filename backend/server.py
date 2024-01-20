from flask import Flask, request, jsonify, send_file
from elevenlabs import generate, save

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    """
    TTS with ElevenLabs
    Request format: {"text": "Hello World!", "voice": "Grace"}
    """
    try:
        text, voice = request.json["text"], request.json["voice"]
        audio_bytes = generate(text=text, voice=voice)
        save(audio_bytes, "speech.mp3")
        return send_file("./speech.mp3", as_attachment=False)
    except Exception as e:
        return jsonify({'Error': str(e)}), 500