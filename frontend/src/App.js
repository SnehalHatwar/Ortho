import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Upload from "./Upload";
import Results from "./Results";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
