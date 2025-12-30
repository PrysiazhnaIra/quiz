import styles from './Layout.module.css';

export const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export const ProgressBar = ({ current, total }) => {
  const progress = Math.min(100, (current / total) * 100);
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <span>Step {current} of {total}</span>
        <span>{Math.round(progress)}% Completed</span>
      </div>
      <div className={styles.track}>
        <div 
          className={styles.bar}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
