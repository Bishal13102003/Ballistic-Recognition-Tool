# backend.py
from flask import Flask, request, jsonify
import cv2
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend communication

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def analyze_image(image_path):
    # Read image with OpenCV
    img = cv2.imread(image_path)
    
    # Basic analysis (example: detect edges)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    
    # Calculate some basic statistics
    height, width = img.shape[:2]
    edge_percentage = (np.sum(edges > 0) / (height * width)) * 100
    
    # This is a simple example - you can add more sophisticated analysis
    results = {
        'dimensions': {'width': width, 'height': height},
        'edge_percentage': round(edge_percentage, 2),
        'status': 'completed'
    }
    return results

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze the image
        try:
            results = analyze_image(filepath)
            return jsonify({
                'success': True,
                'filename': filename,
                'analysis': results
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)