import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ATSScoreGauge = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to actual score over 1.5 seconds
    let startTime;
    const duration = 1500;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setDisplayScore(Math.floor(easeProgress * score));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  // Determine color based on score
  let pathColor = '#ef4444'; // Red for < 40
  if (displayScore >= 70) pathColor = '#10b981'; // Green for >= 70
  else if (displayScore >= 40) pathColor = '#f59e0b'; // Amber for 40-69

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-48 h-48 sm:w-64 sm:h-64 mx-auto relative drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
    >
      <CircularProgressbar
        value={displayScore}
        text={`${displayScore}`}
        strokeWidth={8}
        styles={buildStyles({
          textColor: '#111827',
          pathColor: pathColor,
          trailColor: '#f3f4f6',
          strokeLinecap: 'round',
          textSize: '24px',
        })}
      />
      <div className="absolute top-[65%] left-0 w-full text-center text-gray-500 text-sm font-medium">
        ATS Score
      </div>
    </motion.div>
  );
};

export default ATSScoreGauge;
