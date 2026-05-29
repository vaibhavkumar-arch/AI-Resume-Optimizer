import { motion } from 'framer-motion';

const ScoreBreakdown = ({ breakdown }) => {
  // Map breakdown object to an array for easier mapping
  const categories = Object.keys(breakdown || {}).map(key => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // camelCase to Title Case
    score: breakdown[key].score,
    maxScore: breakdown[key].maxScore,
    details: breakdown[key].details
  }));

  if (categories.length === 0) return null;

  return (
    <div className="space-y-6 w-full">
      {categories.map((cat, index) => {
        const percentage = Math.round((cat.score / cat.maxScore) * 100);
        let barColor = 'bg-red-500';
        if (percentage >= 70) barColor = 'bg-green-500';
        else if (percentage >= 40) barColor = 'bg-amber-500';

        return (
          <motion.div 
            key={cat.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-gray-700">{cat.name}</span>
              <span className="text-xs font-bold text-gray-900">{cat.score} / {cat.maxScore}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                className={`h-2.5 rounded-full ${barColor}`}
              ></motion.div>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{cat.details}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScoreBreakdown;
