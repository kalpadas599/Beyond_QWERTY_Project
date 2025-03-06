import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex rounded-2xl items-center justify-center min-h-[83vh] bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl text-center backdrop-blur-md bg-white/10 p-10 rounded-2xl shadow-xl border border-white/20"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-5xl font-extrabold text-white mb-4"
        >
          Welcome to{" "}
          <span className="text-white">VaaniFill</span>  
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="text-lg text-gray-200 mb-3"
        >
          A seamless platform to create, fill, and manage forms effortlessly.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="text-lg text-gray-200 mb-6"
        >
          Get started by signing up or logging in below.
        </motion.p>

        <div className="flex justify-center gap-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="px-6 py-3 text-white bg-gradient-to-br from-pruple-100 via-blue-700  rounded-lg shadow-md shadow-black transition-all duration-300 hover:shadow-2xl"
            >
              Sign Up
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="px-6 py-3 text-white bg-transparent rounded-lg shadow-md shadow-black transition-all duration-300 hover:shadow-2xl"
            >
              Log In
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
