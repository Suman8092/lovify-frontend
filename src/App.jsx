import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Surprise from "./pages/Surprise";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/s/:slug" element={<Surprise />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
