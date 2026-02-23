import { Link } from "react-router-dom";
import { Home, MoveLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl md:text-3xl font-bold text-text">
            Page Not Found
          </p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-text/70 max-w-md mx-auto"
      >
        the page you're looking for doesn't exist. maybe it got lost in the ai
        matrix or moved to a different planet.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Home size={18} />
          go home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-outline/20 text-text rounded-xl font-medium hover:bg-card-alt transition-colors"
        >
          <MoveLeft size={18} />
          go back
        </button>
      </motion.div>

      {/* some background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-magical/5 blur-[120px] rounded-full -z-10 animate-pulse" />
    </div>
  );
};

export default NotFound;
