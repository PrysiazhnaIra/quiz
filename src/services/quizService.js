import { createClient } from 'contentful';
import algoliasearch from 'algoliasearch';

const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = import.meta.env.VITE_ALGOLIA_API_KEY;

// Contentful Setup 
let contentfulClient = null;
if (SPACE_ID && ACCESS_TOKEN) {
  contentfulClient = createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN,
  });
} else {
  console.warn('VITE_CONTENTFUL_SPACE_ID or VITE_CONTENTFUL_ACCESS_TOKEN is missing in .env');
}

// Algolia Setup 
let algoliaIndex = null;
if (ALGOLIA_APP_ID && ALGOLIA_API_KEY) {
  const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  algoliaIndex = algoliaClient.initIndex('quiz_results');
}

export const fetchQuizData = async () => {
  if (contentfulClient) {
    try {
      const entries = await contentfulClient.getEntries({
        content_type: 'quizStep',
        order: 'fields.order',
        include: 2,
      });

      if (!entries.items.length) {
        console.warn('Connected to Contentful but found no entries.');
        return [];
      }

      return entries.items.map((item) => ({
        id: item.sys.id,
        title: item.fields.title,
        questions: (item.fields.questions || []).map((q) => ({
          id: q.sys.id,
          text: q.fields.questionText || 'Untitled Question',
          type: q.fields.type || 'text',
          options: q.fields.options || [],
        })),
      }));
    } catch (error) {
      console.error('Failed to fetch from Contentful:', error);
      return [];
    }
  } else {
    console.warn('No Contentful client available.');
    return [];
  }
};

export const submitToAlgolia = async (answers) => {

  const score = Object.values(answers).filter(val => {
    if (Array.isArray(val)) return val.length > 0;
    return val && val.trim().length > 0;
  }).length;

  let profile = "Novice Explorer";
  const experienceAnswer = Object.values(answers).find(a => 
    ['Beginner', 'Intermediate', 'Advanced', 'Professional'].includes(a)
  );
  
  if (experienceAnswer === 'Advanced' || experienceAnswer === 'Professional') {
    profile = "Code Master";
  } else if (experienceAnswer === 'Intermediate') {
    profile = "Rising Star";
  }

  const resultPayload = {
    profile,
    score: Math.min(100, Math.round((score / 5) * 100)), 
    recommendations: [
      'Check out your answers by clicking on the "My Answers" button',
      'Share your answers with your friends by clicking on the "Share Answers" button',
      'Retake the quiz to see how your skills have improved'
      
    ],
    answers,
    submittedAt: new Date().toISOString(),
  };

  if (algoliaIndex) {
    try {
      await algoliaIndex.saveObject({
        ...resultPayload,
        objectID: Date.now().toString(),  
      });
    } catch (error) {
      console.error('Failed to save to Algolia:', error);
    }
  }

  return resultPayload;
};
