import styles from './Question.module.css';

const Question = ({ data, value, onChange, error }) => {
  const handleChange = (val) => {
    onChange(data.id, val);
  };

  return (
    <div className={styles.questionContainer}>
      <h3 className={styles.title}>
        {data.text}
      </h3>
      
      {data.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type your answer..."
          className={styles.input}
        />
      )}

      {data.type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tell us more..."
          rows={4}
          className={styles.textarea}
        />
      )}

      {data.type === 'single-choice' && (
        <div className={styles.optionsGrid}>
          {data.options.map((option) => (
            <button
              key={option}
              onClick={() => handleChange(option)}
              className={`${styles.optionButton} ${value === option ? styles.selected : ''}`}
            >
              <span className={styles.optionText}>{option}</span>
              <div className={`${styles.radioCircle} ${value === option ? styles.selected : ''}`}>
                {value === option && (
                  <div className={styles.radioDot} />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {data.type === 'multiple-choice' && (
        <div className={styles.optionsGrid}>
          {data.options.map((option) => {
            const isSelected = Array.isArray(value) && value.includes(option);
            return (
              <button
                key={option}
                onClick={() => {
                   let newValue = Array.isArray(value) ? [...value] : [];
                   if (isSelected) {
                     newValue = newValue.filter(v => v !== option);
                   } else {
                     newValue.push(option);
                   }
                   handleChange(newValue);
                }}
                className={`${styles.optionButton} ${styles.optionButtonMulti} ${isSelected ? styles.selected : ''}`}
              >
                <div className={`${styles.checkboxSquare} ${isSelected ? styles.selected : ''}`}>
                  {isSelected && (
                    <svg className={styles.checkIcon} fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={styles.optionText}>{option}</span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Question;
