import React, { useState, useEffect } from "react";
import styles from "./SearchModal.module.scss";

interface Filters {
  lastName: string;
  middleName: string;
  firstName: string;
  agencyName: string;
  uid: string;
  startDate: string;
  endDate: string;
  columnFilters?: any;
}

interface SearchModalProps {
  open: boolean;
  initialFilters: Filters;
  onClose: () => void;
  onSearch: (filters: Filters) => void;
  onReset: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  open,
  initialFilters,
  onClose,
  onSearch,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    if (open) {
      setLocalFilters(initialFilters);
    }
  }, [open, initialFilters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSearch(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(initialFilters);
    onReset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.modal}>
        <h2 className={styles.title}>Search</h2>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>First Name</label>
            <input
              name="firstName"
              type="text"
              value={localFilters.firstName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Last Name</label>
            <input
              name="lastName"
              type="text"
              value={localFilters.lastName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Agency</label>
            <input
              name="agencyName"
              type="text"
              value={localFilters.agencyName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>UID</label>
            <input
              name="uid"
              type="text"
              value={localFilters.uid}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.dateGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Start Date</label>
              <input
                name="startDate"
                type="date"
                value={localFilters.startDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Date</label>
              <input
                name="endDate"
                type="date"
                value={localFilters.endDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleReset} className={styles.resetButton}>
            Reset
          </button>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
