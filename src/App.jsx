import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AIDemos from "./pages/AIDemos";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-demos" element={<AIDemos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
