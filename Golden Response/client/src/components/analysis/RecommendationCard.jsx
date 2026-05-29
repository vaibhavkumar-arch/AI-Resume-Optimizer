import { motion } from 'framer-motion';

const RecommendationCard = ({ title, icon, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center">
        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
