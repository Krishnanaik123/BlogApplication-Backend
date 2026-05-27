const {
  translate
} = require(
  "@vitalets/google-translate-api"
);


// Delay Function

const delay = (ms) =>

  new Promise((resolve) =>

    setTimeout(resolve, ms)

  );


// Translation Function

const translateText = async (

  text,

  targetLanguage

) => {

  try {

    // Delay

    await delay(7000);


    // Strong Translation Prompt

    let finalText = text;


    // Hindi Strict Translation

    if (targetLanguage === "hi") {

      finalText =

        `Translate the following text strictly into Hindi language using only Devanagari Hindi script.

Do not use English words.
Do not transliterate.
Return only pure Hindi translation.

Text:
${text}`;

    }


    // Telugu Strict Translation

    if (targetLanguage === "te") {

      finalText =

        `Translate the following text strictly into Telugu language using only Telugu script.

Do not use English words.
Return only Telugu translation.

Text:
${text}`;

    }


    // Translate

    const result =

      await translate(

        finalText,

        {

          to: targetLanguage,

        }

      );


    return result.text;


  } catch (error) {

    console.log(

      "Translation Error:",

      error

    );

    return text;

  }

};


module.exports = {

  translateText,

};