
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = () => {
  const pathVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-16 h-16"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="#9b87f5"
          strokeWidth="4"
          fill="transparent"
          variants={pathVariants}
        />
        <motion.path
          d="M30 50 L 50 70 L 70 30"
          stroke="#7E69AB"
          strokeWidth="4"
          fill="transparent"
          variants={pathVariants}
        />
      </motion.svg>
      <motion.span
        className="ml-2 text-xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        EGC
      </motion.span>
    </motion.div>
  );
};

export default AnimatedLogo;
