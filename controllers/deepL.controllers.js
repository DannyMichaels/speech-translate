const config = require('../config/deepL.config');
// const api = config.api;

const deepl = require('deepl-node');

const deepLTranslate = async (req, res) => {
  try {
    const translator = new deepl.Translator(config.authKey);

    const { text, sourceLanguage = null, targetLanguage } = req.body;

    // deepl is smart enough to not need a source language, but doesn't hurt to make sure...
    // https://www.deepl.com/docs-api
    const translations = await translator.translateText(
      text,
      sourceLanguage,
      targetLanguage
    );

    return res.status(200).json(translations);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  deepLTranslate,
};
