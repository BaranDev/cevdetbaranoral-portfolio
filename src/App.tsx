import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { initAnalytics, trackPageView } from "./utils/analytics";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();

    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path, document.title);
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <AnalyticsTracker />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
