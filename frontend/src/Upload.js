import React, { useState } from "react";
import axios from "axios";

function Upload() {
    const [upperFile, setUpperFile] = useState(null);
    const [lowerFile, setLowerFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState("");

    const handleUpload = async () => {
        if (!upperFile || !lowerFile) {
            setError("Please select both STL files.");
            return;
        }

        const formData = new FormData();
        formData.append("upper_file", upperFile);
        formData.append("lower_file", lowerFile);

        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("Response:", response.data); // ✅ Debugging output
            setPrediction(response.data);
            setError("");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setError("Failed to process files. Check the server.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Upload STL Files</h2>
            <input type="file" accept=".stl" onChange={(e) => setUpperFile(e.target.files[0])} />
            <input type="file" accept=".stl" onChange={(e) => setLowerFile(e.target.files[0])} />
            <button className="btn btn-primary mt-3" onClick={handleUpload}>Upload & Predict</button>
            {error && <p className="text-danger">{error}</p>}
            {prediction && (
                <div>
                    <h3>Prediction Results</h3>
                    <pre>{JSON.stringify(prediction, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Upload;
