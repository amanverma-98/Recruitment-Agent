import { create } from 'zustand';

interface GenerationState {
  topics: string[];
  difficulties: string[];
  questionType: 'MCQ' | 'Coding';
  questionsPerTopic: number;
  additionalInstructions: string;
  
  // Actions
  setTopics: (topics: string[]) => void;
  setDifficulties: (difficulties: string[]) => void;
  setQuestionType: (type: 'MCQ' | 'Coding') => void;
  setQuestionsPerTopic: (num: number) => void;
  setAdditionalInstructions: (text: string) => void;
  resetForm: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  topics: ['SQL', 'HTML', 'CSS'], // Default selections
  difficulties: ['Easy', 'Medium'],
  questionType: 'MCQ',
  questionsPerTopic: 10,
  additionalInstructions: '',

  setTopics: (topics) => set({ topics }),
  setDifficulties: (difficulties) => set({ difficulties }),
  setQuestionType: (type) => set({ questionType: type }),
  setQuestionsPerTopic: (num) => set({ questionsPerTopic: num }),
  setAdditionalInstructions: (text) => set({ additionalInstructions: text }),
  resetForm: () => set({
    topics: [],
    difficulties: [],
    additionalInstructions: '',
    questionsPerTopic: 10
  }),
}));