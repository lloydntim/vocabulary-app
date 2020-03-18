import React from 'react';
import {
  number,
  string,
  arrayOf,
  func,
} from 'prop-types';

import { IconButton, Checkbox } from '../../components';

const VocabListEditBody = ({
  list,
  selectedVocabs,
  onVocabCheckboxChange,
  onVocabEditButtonClick,
}) => (
  <ul className="list">
    {list.map((item, index) => {
      const [sourceLanguage, targetLanguage, sourceText, targetText] = item;
      return (
        <li className="list-item" key={index}>
          <Checkbox
            name={`checkbox-${index + 1}`}
            checked={selectedVocabs.indexOf(index) !== -1}
            onChange={() => onVocabCheckboxChange(index, item)}
          />

          <div className="vocab-content">
            <small>{sourceLanguage}</small>
            <span>{sourceText}</span>
            <small>{targetLanguage}</small>
            <span>{targetText}</span>
          </div>

          <IconButton
            type="secondary"
            icon="edit"
            onClick={() => onVocabEditButtonClick(index, item)}
          />
        </li>
      );
    })}
  </ul>
);

VocabListEditBody.propTypes = {
  list: arrayOf(arrayOf(string)).isRequired,
  selectedVocabs: arrayOf(number).isRequired,
  onVocabCheckboxChange: func.isRequired,
  onVocabEditButtonClick: func.isRequired,
};

export default VocabListEditBody;
