require("dotenv").config();
const mysql = require("mysql2/promise");
const { translateText } = require("./src/Services/translationService");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const migratePosts = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Database Connected Successfully.");

    // 1. LIMIT పెట్టాం: ఒకేసారి వందల పోస్టులు కాకుండా కేవలం 10 పోస్టులు మాత్రమే తీసుకుంటుంది
    const [posts] = await connection.execute(
      `
      SELECT * FROM Posts 
      WHERE Title_Hi IS NULL OR Title_Hi = '' 
      OR Title_Te IS NULL OR Title_Te = ''
      LIMIT 10
      `
    );

    if (posts.length === 0) {
      console.log("Everything is up to date! No pending translations found.");
      await connection.end();
      return;
    }

    console.log(`Found ${posts.length} posts to translate in this batch.`);

    for (const post of posts) {
      try {
        console.log(`--- Processing Post ID: ${post.PostId} ---`);

        const englishTitle = post.Title || post.Title_En || "";
        const englishContent = post.Content || post.Content_En || "";

        if (!englishTitle && !englishContent) {
          console.log(`Skipping empty post ID: ${post.PostId}`);
          continue;
        }
        console.log("Translating Title to Hindi...");
        const titleHi = await translateText(englishTitle, "hi");
        await new Promise((r) => setTimeout(r, 2000)); 

        console.log("Translating Title to Telugu...");
        const titleTe = await translateText(englishTitle, "te");
        await new Promise((r) => setTimeout(r, 2000));

        console.log("Translating Content to Hindi...");
        const contentHi = await translateText(englishContent, "hi");
        await new Promise((r) => setTimeout(r, 2000));

        console.log("Translating Content to Telugu...");
        const contentTe = await translateText(englishContent, "te");
        await connection.execute(
          `
          UPDATE Posts 
          SET 
            Title_En = ?, 
            Title_Hi = ?, 
            Title_Te = ?, 
            Content_En = ?, 
            Content_Hi = ?, 
            Content_Te = ? 
          WHERE PostId = ?
          `,
          [englishTitle, titleHi, titleTe, englishContent, contentHi, contentTe, post.PostId]
        );

        console.log(`Successfully updated database for Post ID: ${post.PostId}`);
        console.log("Waiting 5 seconds before the next post to bypass Google rate limits...");
        await new Promise((r) => setTimeout(r, 5000));

      } catch (postError) {
        console.error(`Error translating post ID ${post.PostId}:`, postError.message);
        console.log("API might be throttled. Waiting 20 seconds before checking next available item...");
        await new Promise((r) => setTimeout(r, 20000));
      }
    }

    console.log("Batch Migration Completed successfully.");
    await connection.end();

  } catch (error) {
    console.log("Migration Critical Error:", error);
  }
};

migratePosts();