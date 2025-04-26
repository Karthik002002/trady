import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const GlowingCard = ({ children }) => {
  const controls = useAnimation();

  const generateShadow = () => {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const blur = 20 + Math.random() * 20;
    return `${x}px ${y}px ${blur}px 5px rgba(34,197,94,0.6)`; // green-500 glow
  };

  useEffect(() => {
    const animateGlow = async () => {
      while (true) {
        await controls.start({
          boxShadow: generateShadow(),
          transition: { duration: 0.8, ease: "easeInOut" },
        });
      }
    };
    animateGlow();
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className="bg-white min-h-[70vh] max-w-xl min-w-lg rounded-lg shadow-2xl hover:scale-[1.005] transition-all duration-300 flex flex-col items-center py-3"
    >
      {children}
    </motion.div>
  );
};

export default GlowingCard;
