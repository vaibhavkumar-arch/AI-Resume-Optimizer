import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-indigo-900 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
