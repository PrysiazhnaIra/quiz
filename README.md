# DevQuiz

A premium, multi-step quiz application built with React, Vite, and TailwindCSS. It features dynamic content loading from Contentful and a results processing simulation (integratable with Algolia).

## Features

- **Dynamic Quiz Steps**: Fetches questions and steps from Contentful (or falls back to a rich mock data set).
- **Premium UI**: Dark mode, glassmorphism, and smooth animations using pure CSS and Tailwind.
- **Interactive Components**: Custom radio buttons, progress bars, and result visualizations.
- **Results System**: simulated analysis of user answers.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` and add your Contentful/Algolia keys if you have them.
    ```bash
    cp .env.example .env
    ```
    *Note: If you don't provide keys, the app will gracefully fall back to demonstration mode.*

3.  **Run Locally**:
    ```bash
    npm run dev
    ```

4.  **Build**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: UI components (Question, StepWizard, Results, etc.)
- `src/services`: Logic for fetching data (Contentful) and processing results (Algolia).
- `src/hooks`: Custom hooks (if any).
