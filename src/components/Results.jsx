import { useState } from 'react';
import { Share2, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import styles from './Results.module.css';

const Results = ({ results, onRetry, answers, steps }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  const formatAnswer = (val) => {
    if (Array.isArray(val)) return val.join(', ');
    return val ? val.toString() : 'Skipped';
  };

  const handleShareAnswers = () => {
    let text = `My Dev Quiz Results: ${results.profile} (${Math.round(results.score)}%)\n\n`;
    
    steps.forEach(step => {
      text += `--- ${step.title} ---\n`;
      step.questions.forEach(q => {
        const val = answers[q.id];
        if (val !== undefined && val !== null) {
          text += `Q: ${q.text}\n`;
          text += `A: ${formatAnswer(val)}\n\n`;
        }
      });
    });

    const shareData = {
      title: 'My Dev Quiz Answers',
      text: text,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Answers copied to clipboard!');
    }
  };

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.header}>
        <h2 className={styles.profileTitle}>
          {results.profile}
        </h2>
        <p className={styles.subtitle}>Your Developer Profile</p>
      </div>

      <div className={styles.chartContainer}>
        <svg className={styles.svg}>
          <circle
            cx="96"
            cy="96"
            r="88"
            className={styles.circleBg}
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            className={styles.circleProgress}
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - results.score / 100)}
          />
          <defs>
             <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="#ff9a9e" />
               <stop offset="100%" stopColor="#fecfef" />
             </linearGradient>
           </defs>
        </svg>
        <div className={styles.chartLabel}>
          <span className={styles.percentage}>{Math.round(results.score)}%</span>
          <span className={styles.matchLabel}>Match</span>
        </div>
      </div>

      <div className={styles.recommendationsCard}>
        <h3 className={styles.recHeader}>
          Recommended Next Steps
        </h3>
        <ul className={styles.recList}>
          {results.recommendations.map((rec, i) => (
            <li key={i} className={styles.recItem}>
              <div className={styles.bullet} />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <button
          onClick={onRetry}
          className={styles.retryButton}
        >
          <RefreshCw size={20} />
          Retake Quiz
        </button>
        
        {answers && steps && (
          <button
            onClick={() => setShowAnswers(true)}
            className={styles.reviewButton}
          >
            <Eye size={20} />
            My Answers
          </button>
        )}


      </div>

      <Modal
        isOpen={showAnswers}
        onClose={() => setShowAnswers(false)}
        title="Your Answers"
      >
        <div className={styles.answersList}>
          {steps && steps.map((step) => (
            <div key={step.id} className={styles.stepSection}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              {step.questions.map((q) => {
                const val = answers[q.id];
                if (val === undefined || val === null) return null;
                return (
                  <div key={q.id} className={styles.answerItem}>
                    <p className={styles.questionText}>{q.text}</p>
                    <p className={styles.answerText}>{formatAnswer(val)}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.modalActions}>
           <button
             onClick={handleShareAnswers}
             className={styles.shareButton}
             style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
           >
             <Share2 size={20} />
             Share Answers
           </button>
        </div>
      </Modal>
    </div>
  );
};

export default Results;
