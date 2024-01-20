from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/video-to-text', methods=['POST'])
def video_to_text():
    try:
        video_file = request.files['video']
        video_path = f'./video/{video_file.filename}'
        video_file.save(video_path)
        text = video_to_text(video_path)

        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'Error': str(e)}), 500