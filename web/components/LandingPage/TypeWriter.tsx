import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/utils/cn";
import styles from './TypeWriter.module.scss';

export const TypewriterEffectSmooth = ({ words, className, cursorClassName }) => {
  const containerRef = useRef(null);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setIsComponentVisible(true);
    }
  }, []);

  const wordsArray = words.map(word => ({
    ...word,
    text: word.text.split(""),
  }));

  const renderWords = () => {
    return wordsArray.map((word, idx) => (
      <div key={`word-${idx}`} className="inline-block">
        {word.text.map((char, index) => (
          <span
            key={`char-${index}`}
            className={cn(styles.black, word.className)}
            style={{ color: word.textColor || styles.black }}
          >
            {char}
          </span>
        ))}
        &nbsp;
      </div>
    ));
  };

  return (
    <div className={cn("flex space-x-1 my-6", className, styles.typewriterBase)} ref={containerRef}>
      {isComponentVisible && (
        <motion.div
          className="overflow-hidden pb-2"
          initial={{ width: "0%" }}
          animate={{ width: "fit-content" }}
          transition={{ duration: 2, ease: "linear", delay: 0.5 }}
        >
          <div className={`text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold ${styles.black}`} style={{ whiteSpace: "nowrap" }}>
            {renderWords()}{" "}
          </div>{" "}
        </motion.div>
      )}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className={cn("block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-blue-500", cursorClassName)}
      ></motion.span>
    </div>
  );
};