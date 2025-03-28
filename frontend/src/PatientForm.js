import React from "react";

function PatientForm() {
    return (
        <div className="container mt-5">
            <h2>Add Patient</h2>
            <form>
                <div className="mb-3">
                    <label className="form-label">Patient Name</label>
                    <input type="text" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default PatientForm;
