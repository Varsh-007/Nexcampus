import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0f172a] overflow-hidden flex items-center justify-center">

      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 top-10 left-10"
      />

      <motion.div
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-30 bottom-10 right-10"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 text-center shadow-2xl"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          NexCampus
        </h1>

        <p className="text-blue-200 text-lg mb-6">
          Smart Unified Campus Platform
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all duration-300 hover:scale-110 shadow-lg shadow-blue-500/50"
        >
          Enter Platform
        </button>
      </motion.div>
    </div>
  );
}

export default Home;
