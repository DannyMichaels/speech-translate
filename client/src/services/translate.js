import api from './apiConfig';

export default async function translate({ text, sourceLanguage, targetLanguage }) {
  try {
    // source_lang is optional, it'll be automatically detected without it, but it's more relaible like this
    const response = await api.post(`/translate?text=${text}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`)
    console.log({response});

    return response.translations.text;
  }catch (err) {
    throw err;
  }
}