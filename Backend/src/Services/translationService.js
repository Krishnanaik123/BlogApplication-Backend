const translate = require('translate').default || require('translate');
translate.engine = 'google';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const translateText = async (text, targetLanguage) => {
  try {
    await delay(500);
    const result = await translate(text, { to: targetLanguage });
    return result;
  } catch (error) {
    console.log("TRANSLATION MESSAGE =>", error?.message);
    return text;
  }
};

module.exports = { translateText };