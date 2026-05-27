const { translate } = require("@vitalets/google-translate-api");

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

// Translation Function
const translateText = async (text,targetLanguage) => {
  try {
    await delay(8000);
    let finalText = text;
    if (targetLanguage === "hi") {

      finalText =
        `Translate the following text strictly into Hindi language using only Devanagari Hindi script.
              Do not use English words.
              Do not transliterate.
              Return only pure Hindi translation.

      Text:
      ${text}`;

    }
    if (targetLanguage === "te") {
      finalText =
        `Translate the following text strictly into Telugu language using only Telugu script.
              Do not use English words.
              Return only Telugu translation.
              Text:
            ${text}`;
      }
    const result = await translate(finalText,
        { to: targetLanguage,}
      );
    return result.text;
  } catch (error) {
    console.log( "Translation Error:",error);
    return text;
  }
};


module.exports = {translateText,};