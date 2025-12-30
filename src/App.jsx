import { Layout } from './components/Layout';
import StepWizard from './components/StepWizard';
import styles from './App.module.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Layout>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Dev<span className={styles.gradientText}>Quiz</span>
        </h1>
        <p className={styles.subtitle}>
          Discover your developer personality through our interactive assessment.
        </p>
      </header>
      
      <StepWizard />
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}

export default App;
