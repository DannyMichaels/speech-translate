import create from 'zustand';

export const useLanguageStore = create((set) => ({
  sourceLanguage: 'EN',
  targetLanguage: 'ES',

  setSourceLanguage: (payload) => set((state) => ({ sourceLanguage: payload })),
  setTargetLanguage: (payload) => set((state) => ({ targetLanguage: payload })),
}));
