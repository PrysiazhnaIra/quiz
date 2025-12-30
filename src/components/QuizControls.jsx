import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import styles from './QuizControls.module.css';

const QuizControls = ({ isFirst, isLast, onNext, onPrev, isSubmitting }) => {
  return (
    <div className={styles.controls}>
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={styles.backButton}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <button
        onClick={onNext}
        disabled={isSubmitting}
        className={styles.nextButton}
      >
        {isSubmitting ? (
          'Processing...'
        ) : isLast ? (
          <>Complete Quiz <CheckCircle size={20} /></>
        ) : (
          <>Next <ArrowRight size={20} /></>
        )}
      </button>
    </div>
  );
};

export default QuizControls;
