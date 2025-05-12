import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import CodeEditor from './pages/CodeEditor';
import Skills from './pages/Skills';
import CaseStudies from './pages/CaseStudies';
import Components from './pages/Components';
import Contact from './pages/Contact';
import AIDemos from './pages/AIDemos';
import ArchitectureDiagrams from './pages/ArchitectureDiagrams';
import SimpleBackground from './components/ui/SimpleBackground';
import Loader from './components/ui/Loader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    
    // Simulate assets loading
    const timer = setTimeout(() => {
      setLoading(false);
      // Restore scrolling when loading is complete
      document.body.style.overflow = 'auto';
    }, 1500);

    return () => {
      clearTimeout(timer);
      // Ensure scrolling is restored if component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <SimpleBackground />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/components" element={<Components />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-demos" element={<AIDemos />} />
          <Route path="/architecture-diagrams" element={<ArchitectureDiagrams />} />
          {/* Add more routes as you implement other pages */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
