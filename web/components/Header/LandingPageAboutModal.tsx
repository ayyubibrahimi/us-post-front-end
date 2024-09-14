import React, { useEffect, useCallback } from 'react';
import styles from './LandingPageModal.module.scss';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const teamMembers: TeamMember[] = [
  {
    name: "cabra",
    role: "Chief Public Records Officer",
    bio: "esta cabra es indigenous a las montanas de peru",
    photoUrl: "https://storage.googleapis.com/jlabs-images/goat.jpg"
  },
  {
    name: "cabra",
    role: "Has called POST more than anyone alive",
    bio: "esta cabra es indigenous a las montanas de chile",
    photoUrl: "https://storage.googleapis.com/jlabs-images/goat2.jpg"
  },
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className={styles.teamMemberCard}>
    {member.photoUrl && (
      <img
        src={member.photoUrl}
        alt={`${member.name}'s photo`}
        className={styles.teamMemberPhoto}
      />
    )}
    <div className={styles.teamMemberInfo}>
      <h3 className={styles.teamMemberName}>
        {member.name}
      </h3>
      {member.role && <p className={styles.teamMemberRole}>{member.role}</p>}
      <p className={styles.teamMemberBio}>{member.bio}</p>
    </div>
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