from flask import Flask, request, jsonify
import trimesh
import numpy as np
import os
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

def load_stl(file_path):
    """ Load STL file and return vertices """
    try:
        mesh = trimesh.load_mesh(file_path)
        return mesh.vertices
    except Exception as e:
        print(f"❌ Error loading STL file: {e}")
        return None

def resample_points(points, target_size):
    """ Resample points to ensure both STL files have the same shape """
    num_points = len(points)
    if num_points > target_size:
        indices = np.random.choice(num_points, target_size, replace=False)
        return points[indices]
    elif num_points < target_size:
        # Duplicate some points to match the size
        additional_indices = np.random.choice(num_points, target_size - num_points, replace=True)
        additional_points = points[additional_indices]
        return np.vstack((points, additional_points))
    return points

def extract_features(upper_file, lower_file):
    """ Extract orthodontic features from STL files """
    upper_points = load_stl(upper_file)
    lower_points = load_stl(lower_file)

    if upper_points is None or lower_points is None:
        return {"error": "Failed to read STL files"}

    # Match the number of points in both STL files
    target_size = min(len(upper_points), len(lower_points))
    upper_points = resample_points(upper_points, target_size)
    lower_points = resample_points(lower_points, target_size)

    try:
        features = {
            "Upper_Alignment": float(np.std(upper_points)),
            "Lower_Alignment": float(np.std(lower_points)),
            "Occlusal_Contacts": float(np.mean(upper_points[:, 2] - lower_points[:, 2])),
            "Overjet": float(np.max(upper_points[:, 0]) - np.max(lower_points[:, 0])),
        }
        print(f"✅ Extracted Features: {features}")
        return features
    except Exception as e:
        print(f"❌ Error processing features: {e}")
        return {"error": "Feature extraction failed"}

@app.route("/predict", methods=["POST"])
def predict():
    """ API endpoint to process STL files and return extracted features """
    print("📩 Received prediction request...")

    if "upper_file" not in request.files or "lower_file" not in request.files:
        print("❌ Missing STL files in request!")
        return jsonify({"error": "Missing STL files"}), 400

    upper_file = request.files["upper_file"]
    lower_file = request.files["lower_file"]

    upper_path = "temp_upper.stl"
    lower_path = "temp_lower.stl"
    upper_file.save(upper_path)
    lower_file.save(lower_path)
    print("✅ STL files saved successfully!")

    features = extract_features(upper_path, lower_path)

    # Remove temp files after processing
    os.remove(upper_path)
    os.remove(lower_path)

    return jsonify(features)

if __name__ == "__main__":
    print("🚀 Starting Flask server on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)
