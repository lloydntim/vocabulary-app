const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');
const dotEnv = require('dotenv');
const { TranslationServiceClient } = require('@google-cloud/translate');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
dotEnv.config();

const {
  GCS_PROJECT_ID,
  GCS_PROJECT_LOCATION,
  GCS_PRIVATE_KEY,
  GCS_CLIENT_EMAIL,
} = process.env;

const projectId = GCS_PROJECT_ID;
const location = GCS_PROJECT_LOCATION;
const translationClient = new TranslationServiceClient({
  projectId,
  credentials: {
    client_email: GCS_CLIENT_EMAIL,
    private_key: GCS_PRIVATE_KEY,
  }
});

const translateFile = async (inputPath) => {
  try {
    const languages = ['de', 'es', 'pt', 'fr'];

    const jsonFile = await readFile(inputPath, 'utf-8');
    const content = JSON.parse(jsonFile);

    const contentKeys = Object.keys(content);
    const contentValues = Object.values(content);

    languages.forEach(async (language) => {
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: contentValues,
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: language,
      };
      const [response] = await translationClient.translateText(request);
      const { translations } = response;
      const translatedContent = translations
        .map(({ translatedText }) => translatedText)
        .reduce((object, value, index) => {
          const keyName = contentKeys[index];
          object[keyName] = value;
          return object;
        }, {});
      await writeFile(resolve(__dirname, `../locales/${language}/translation.json`), JSON.stringify(translatedContent, null, 2), { flag: 'w', encoding: 'utf-8' });
    });
  } catch (error) {
    throw error;
  }
};

translateFile(resolve(__dirname, '../locales/en/translation.json'));
