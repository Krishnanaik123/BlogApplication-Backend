// const translate = require('translate').default || require('translate');
// translate.engine = 'google';

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// const translateText = async (text, targetLanguage) => {
//   try {
//     await delay(500);
//     const result = await translate(text, { to: targetLanguage });
//     return result;
//   } catch (error) {
//     console.log("TRANSLATION MESSAGE =>", error?.message);
//     return text;
//   }
// };

// module.exports = { translateText };



const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateText = async (text, targetLanguage) => {
  try {
    await delay(500);
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: `en|${targetLanguage}`
      }
    });
    return response.data.responseData.translatedText;
  } catch (error) {
    console.log("TRANSLATION ERROR =>", error?.message);
    return text;
  }
};

module.exports = { translateText };