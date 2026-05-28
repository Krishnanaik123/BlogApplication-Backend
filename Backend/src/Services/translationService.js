const { translate } = require("@vitalets/google-translate-api");
const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

// Translation Function
const translateText = async (text,targetLanguage) => {
  try {
    await delay(2000);
    const result = await translate(text,
        { to: targetLanguage,}
      );
    return result.text;
  } catch (error) {
    console.log( "Translation Error:",error);
    return text;
  }
};
module.exports = {translateText,};