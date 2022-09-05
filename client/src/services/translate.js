import api from './apiConfig';

export default async function translate({
  text,
  sourceLanguage,
  targetLanguage,
}) {
  try {
    // source_lang is optional, it'll be automatically detected without it, but it's more relaible like this
    const response = await api.post(`/translate`, {
      text,
      sourceLanguage,
      targetLanguage,
    });

    return response.data.text;
  } catch (err) {
    throw err;
  }
}
