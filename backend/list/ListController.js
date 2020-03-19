const { resolve } = require('path');
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import dotEnv from 'dotenv';
import xlsx from 'node-xlsx';
import { TranslationServiceClient } from '@google-cloud/translate';
import List from './ListModel';

dotEnv.config();

const {
  NODE_ENV,
  GOOGLE_APPLICATION_CREDENTIALS,
} = process.env;

const checkTextString = (string, {
  minStringLength = 2,
  maxStringLength = 25,
  match = '',
  errorMessage = 'Invalid String',
} = {}) => {
  const re = new RegExp(match,'g');
  const stringLength = string.length;
  const isStringValid = match ? re && (stringLength < minStringLength) : stringLength < minStringLength

   if (isStringValid) return errorMessage;
   else if (stringLength > maxStringLength) return string.substr(0, maxStringLength);
   else return string.trim();
};

const sanitizeList = (list) => list
  .filter((list) => (list.length === 4) && list.every((l) => typeof l === 'string'))
  .map((filteredList) => {
    const maxPhraseLength = 150;
    const languageStringValidation = { maxStringLength: maxPhraseLength, match: '^[aA-Za-zÀ-ÖØ-öø-ÿ ]' };
    const [srcLangData, srcTextData, tgtLangData, tgtTextData] = filteredList;
    const srcLang = checkTextString(srcLangData, languageStringValidation);
    const srcText = checkTextString(srcTextData);
    const tgtLang = checkTextString(tgtLangData);
    const tgtText = checkTextString(tgtTextData, languageStringValidation);

    return [srcLang, srcText, tgtLang, tgtText]
  });

export const getListVocabTranslation = async (parent, args, { currentUser }) => {
  // if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const projectId = 'norse-case-271518';
    const location = 'global';
    const { sourceLanguage, targetLanguage, sourceText } = args;
    const translationClient = new TranslationServiceClient({
      projectId: 'norse-case-271518',
      keyFilename: resolve(__dirname,'../config/vocapp.json'),
    });
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [sourceText],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);

    return { targetText: response.translations[0].translatedText };
  } catch (error) {
    throw new ApolloError(error);
    // throw new ApolloError('This text could not be translated');
  }
};
export const getList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { id, name } = args;
    return id ? await List.findById(id) : await List.findOne({ name });
  } catch (error) {
    throw new Error(`List with id ${id} could not be retrieved`);
  }
};

export const getLists = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { creatorId } = args;
    return await List.find({ creatorId });
  } catch (error) {
    throw new Error('Lists could not be retrieved');
  }
};

export const addList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { file, name, data, creatorId } = args;
    const listData = data || [];

    if (!file || typeof file === 'undefined') {
      return await List.create({ name, data: listData, creatorId });
    } else {
      const { createReadStream } = await file;
      const bufferArray = [];
      return await new Promise((res) => (
        createReadStream()
          .on('data', (chunk) => {
            bufferArray.push( chunk );
          })
          .on('error', (error) => {
            throw new Error(error);
          })
          .on('end', () => {
            console.info('File successfully processed');
            const buffer = Buffer.concat(bufferArray);
            const [ list ] = xlsx.parse(buffer);
            res(List.create({ name, data: sanitizeList(list.data), creatorId }));
          })
          .on('close', (e) => {
            console.log('File stream closed.')
          })
        )
      );
    }
  } catch (error) {
    throw new Error ('List could not be added.');
  };
};

export const updateList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    let $set = {};
    const { id, name, data, file } = args;
    if (name) $set.name = name;
    if (file) {
      const { createReadStream } = await file;
      const bufferArray = [];
      const { data: listData } = await List.findById(id);
      const existingData = listData || [];

      $set.data = file ? await new Promise((res) => (
        createReadStream()
          .on('data', (chunk) => {
            bufferArray.push( chunk );
          })
          .on('error', (error) => {
            throw new Error(error);
          })
          .on('end', () => {
            console.info('File successfully processed');
            const buffer = Buffer.concat(bufferArray);
            const [ list ] = xlsx.parse(buffer);
            res(existingData.concat(sanitizeList(list.data)));
          })
          .on('close', (e) => {
            console.log('File stream closed.')
          })
        )) : data;
    }
    if (data) {
      $set.data = data;
    }
    return await List.findByIdAndUpdate(id, { $set }, { new: true });
  } catch (error) {
    throw new Error('List could not be updated');
  };
};

export const removeList = async (parent, args, { currentUser }) => {
  if (!currentUser.loggedIn) throw new AuthenticationError('User must be logged in!');
  try {
    const { id: _id , creatorId } = args;
    return creatorId ? await List.deleteMany({ creatorId }) : await List.findOneAndDelete({ _id });
  } catch (error) {
    throw new Error('List could not be removed');
  };
};

export default {
  getList,
  getLists,
  addList,
  updateList,
  removeList
};
