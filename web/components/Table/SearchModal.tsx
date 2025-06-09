import type React from "react";
import { useEffect, useState } from "react";
import styles from "./SearchModal.module.scss";

interface Filters {
  lastName: string;
  middleName: string;
  firstName: string;
  agencyName: string;
  uid: string;
  startDate: string;
  endDate: string;
  columnFilters?: Record<string, unknown>;
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.backdrop}
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Close modal"
      />

      <div className={styles.modal}>
        <h2 className={styles.title}>Search</h2>

        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={localFilters.firstName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={localFilters.lastName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="agencyName" className={styles.label}>
              Agency
            </label>
            <input
              id="agencyName"
              name="agencyName"
              type="text"
              value={localFilters.agencyName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="uid" className={styles.label}>
              UID
            </label>
            <input
              id="uid"
              name="uid"
              type="text"
              value={localFilters.uid}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.dateGroup}>
            <div className={styles.field}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={localFilters.startDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="endDate" className={styles.label}>
                End Date
              </label>
              <input
                id="endDate"
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
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
