import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const generateWaveLetters = (text, direction = "left") => {
  const length = text.length;
  return text.split("").map((char, index) => ({
    char,
    id: `${char}-${index}`,
    delay: direction === "left" ? (length - index) * 0.1 : index * 0.1,
  }));
};

const RandomAnimatedText = ({
  text,
  styling = "text-green-500 font-semibold dorsa-regular text-[3em] w-full text-center flex justify-center gap-1",
}) => {
  const [direction, setDirection] = useState("right");
  const [letters, setLetters] = useState(generateWaveLetters(text, "right"));

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((prev) => {
        const next = prev === "right" ? "left" : "right";
        setLetters(generateWaveLetters(text, next));
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <h4 className={styling}>
      {letters.map(({ char, id, delay }) => (
        <motion.span
          key={id}
          initial={{ opacity: 0.4 }}
          animate={{
            opacity: [0.4, 1, 0.4],
            textShadow: [
              "0px 0px 0px #22c55e",
              "0px 0px 8px #22c55e",
              "0px 0px 0px #22c55e",
            ],
          }}
          transition={{
            delay,
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="inline-block cursor-not-allowed"
        >
          {char}
        </motion.span>
      ))}
    </h4>
  );
};

export default RandomAnimatedText;
