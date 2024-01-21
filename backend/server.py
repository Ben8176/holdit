from flask import Flask, request, jsonify
from asl import video_to_text

app = Flask(__name__)
# Set maximum upload size to 100 MB
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/video-to-text', methods=['POST'])
def video_to_text():

    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        # Save the file or process it
        file.save('vids/' + file.filename)
        print(video_to_text(file))
        result_list = video_to_text(file)
        return jsonify({'message': 'File uploaded successfully', 'result': result_list}), 200

if __name__ == '__main__':
    app.run(debug=True)