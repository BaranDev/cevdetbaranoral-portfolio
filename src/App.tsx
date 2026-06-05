import { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Loader from "./components/ui/Loader";
import { initAnalytics, trackPageView } from "./utils/analytics";

// Lazy-loaded: pulls in TensorFlow.js + face-api.js, which would otherwise
// bloat the main bundle for visitors who never open /ai-demos.
const AIDemos = lazy(() => import("./pages/AIDemos"));

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
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-demos" element={<AIDemos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
