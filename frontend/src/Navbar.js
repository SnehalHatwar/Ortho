import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Upload from "./Upload";
import Results from "./Results";
import PatientForm from "./PatientForm";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Upload />} />
                <Route path="/results" element={<Results />} />
                <Route path="/patient-form" element={<PatientForm />} />
            </Routes>
        </Router>
    );
}

export default App;

