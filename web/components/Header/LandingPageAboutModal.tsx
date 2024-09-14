import React, { useEffect, useCallback } from 'react';
import styles from './LandingPageModal.module.scss';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const teamMembers: TeamMember[] = [
  {
    name: "Sam Stecklow",
    role: "",
    bio: "ceo"
  },
  {
    name: "Maheen Khan",
    role: "",
    bio: "le goat"
  },
  {
    name: "Tarak Shah",
    role: "",
    bio: "la cabra"
  },
  {
    name: "Ayyub Ibrahim",
    role: "",
    bio: "papas y chorizo o papas y carne molida"
  },
  {
    name: "Lisa",
    role: "",
    bio: "?"
  },
  {
    name: "BLN",
    role: "",
    bio: "?"
  }
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className={styles.teamMemberCard}>
    <h3 className={styles.teamMemberName}>
      {member.name}
    </h3>
    {member.role && <p className={styles.teamMemberRole}>{member.role}</p>}
    <p className={styles.teamMemberBio}>{member.bio}</p>
  </div>
);

const LandingPageAboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>About the National Police Index</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>Close</button>
        </div>
        
        <div className={styles.modalDescription}>
          <p>The National Police Index is a comprehensive database that provides transparency and accountability in law enforcement. Our mission is to collect, analyze, and present data on police activities across the nation.</p>
        </div>

        <h3 className={styles.teamSectionTitle}>Our Team</h3>
        <div className={styles.teamMembersContainer}>
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPageAboutModal;