
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
      className="flex items-center justify-center cursor-pointer"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-12 h-12 md:w-16 md:h-16"
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
          whileHover={{ scale: 1.05 }}
        />
        <motion.path
          d="M30 50 L 50 70 L 70 30"
          stroke="#7E69AB"
          strokeWidth="4"
          fill="transparent"
          variants={pathVariants}
          whileHover={{ scale: 1.1 }}
        />
      </motion.svg>
      <motion.div className="ml-2 flex flex-col">
        <motion.span
          className="text-xl font-bold text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          EGC
        </motion.span>
        <motion.span
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          Equity Growth Compass
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLogo;
