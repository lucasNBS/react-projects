import { Route, Routes } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Price";
import { About } from "./pages/About";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
