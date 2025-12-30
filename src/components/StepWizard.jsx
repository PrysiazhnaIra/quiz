import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchQuizData, submitToAlgolia } from '../services/quizService';
import { ProgressBar } from './Layout';
import Question from './Question';
import QuizControls from './QuizControls';
import Results from './Results';
import styles from './StepWizard.module.css';

const StepWizard = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchQuizData();
    setSteps(data);
    setLoading(false);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const currentStep = steps[currentStepIndex];
    const newErrors = {};
    let isValid = true;

    currentStep.questions.forEach(q => {
      const val = answers[q.id];
      if (!val || 
          (typeof val === 'string' && !val.trim()) ||
          (Array.isArray(val) && val.length === 0)) {
        newErrors[q.id] = 'This question is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast.error('Please fill in all required fields before proceeding.');
      return;
    }

    if (currentStepIndex === steps.length - 1) {
     
      setIsSubmitting(true);
      try {
        const resultData = await submitToAlgolia(answers);
        setResults(resultData);
        toast.success('Assessment completed! Here is your profile.');
      } catch (err) {
        console.error(err);
        toast.error('Failed to process results. Please try again.');
      }
      setIsSubmitting(false);
    } else {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => prev - 1);
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading quiz experience...</p>
      </div>
    );
  }

  if (results) {
    return <Results 
      results={results} 
      answers={answers}
      steps={steps}
      onRetry={() => {
      setResults(null);
      setCurrentStepIndex(0);
      setAnswers({});
    }} />;
  }

  const currentStep = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  return (
    <div className={styles.wizardContainer}>
      <ProgressBar current={currentStepIndex + 1} total={steps.length} />
      
      <div className={styles.card}>
        <h2 className={styles.stepHeader}>
           <span className={styles.stepIndicator}></span>
           {currentStep.title}
        </h2>

        {currentStep.questions.map(q => (
          <Question
            key={q.id}
            data={q}
            value={answers[q.id]}
            onChange={handleAnswerChange}
            error={errors[q.id]}
          />
        ))}

        <QuizControls
          isFirst={isFirst}
          isLast={isLast}
          onNext={handleNext}
          onPrev={handlePrev}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default StepWizard;
