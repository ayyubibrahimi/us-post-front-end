import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useHover } from './HoverContext'; // Adjust the path as necessary
import styles from './agencyCard.module.scss'; // Adjust the path as necessary

const AgencyCard = ({ agency }) => {
  const { name, slug } = agency;
  const { hoveredIndex, setHoveredIndex } = useHover();

  const handleMouseEnter = () => {
    setHoveredIndex(slug);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Link href={`/agency/${slug}`} passHref>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={styles.agencyCard__container}
      >
        <AnimatePresence>
          {hoveredIndex === slug && (
            <motion.div
              className={styles.agencyCard__hoverBackground}
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
            />
          )}
        </AnimatePresence>
        <div className={`${styles.agencyCard__content} ${styles['agencyCard__content--dark']}`}>
          <div className={styles.agencyCard__header}>
            <h4>{name}</h4>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AgencyCard;
