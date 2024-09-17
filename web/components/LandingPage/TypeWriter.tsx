import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Word {
  text: string;
  className?: string;
  textColor?: string;
}

interface TypewriterEffectSmoothProps {
  words: Word[];
  className?: string;
  cursorClassName?: string;
}

export const TypewriterEffectSmooth: React.FC<TypewriterEffectSmoothProps> = ({ words, className, cursorClassName }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const baseStyle = {
    fontFamily: '"SF Pro"',
    fontWeight: 'normal' as const,
    color: '#ddd',
  };

  const renderWords = () => {
    return wordsArray.map((word, idx) => (
      <div key={`word-${idx}`} style={{ display: 'inline-block' }}>
        {word.text.map((char, index) => (
          <span
            key={`char-${index}`}
            style={{
              ...baseStyle,
              color: word.textColor || baseStyle.color,
            }}
          >
            {char}
          </span>
        ))}
        &nbsp;
      </div>
    ));
  };

  const containerStyle = {
    ...baseStyle,
    display: 'flex',
    margin: '1.5rem 0',
  };

  const textContainerStyle = {
    ...baseStyle,
    whiteSpace: 'nowrap' as const,
    fontSize: 'clamp(1rem, 3vw, 3rem)',
  };

  const cursorStyle = {
    display: 'block',
    width: '4px',
    height: 'clamp(4rem, 3vw, 3rem)',
    backgroundColor: '#3b82f6',
    borderRadius: '2px',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {isComponentVisible && (
        <motion.div
          style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}
          initial={{ width: "0%" }}
          animate={{ width: "fit-content" }}
          transition={{ duration: 2, ease: "linear", delay: 0.5 }}
        >
          <div style={textContainerStyle}>
            {renderWords()}{" "}
          </div>
        </motion.div>
      )}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        style={cursorStyle}
      ></motion.span>
    </div>
  );
};