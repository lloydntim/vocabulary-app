import React, { useState } from 'react';
import {
  string,
  func,
  arrayOf,
} from 'prop-types';

import './AutoComplete.scss';

/* eslint-disable react/jsx-props-no-spreading */
const AutoComplete = ({
  value,
  placeholder,
  dataList,
  onClick,
  onChange,
  onFocus,
}) => {
  const [isDataListVisible, setDataListVisibility] = useState(false);
  return (
    <div className="auto-complete">
      <input
        placeholder={placeholder}
        className="auto-complete-input"
        type="text"
        value={value}
        onChange={(event) => {
          setDataListVisibility(true);
          onChange(event);
        }}
        onFocus={onFocus}
      />

      {(isDataListVisible && dataList.length > 1) && (
        <ul className="auto-complete-datalist">
          {
            dataList
              .filter(
                (item) => value.length > 0 && item.toLowerCase().startsWith(value.toLowerCase()),
              )
              .map((item, index) => {
                const boldText = item.substring(0, value.length);
                const normalText = item.substring(value.length);
                return (
                  <li
                    key={index}
                    className="auto-complete-datalist-item"
                  >
                    <button
                      type="button"
                      className="auto-complete-datalist-item-button"
                      onClick={() => {
                        setDataListVisibility(false);
                        onClick(item);
                      }}
                    >
                      <span>{boldText}</span>
                      {normalText && <span>{normalText}</span>}
                    </button>
                  </li>
                );
              })
          }
        </ul>
      )}
    </div>
  );
};

AutoComplete.defaultProps = {
  placeholder: '',
  onFocus: () => null,
};

AutoComplete.propTypes = {
  value: string.isRequired,
  placeholder: string,
  dataList: arrayOf(string).isRequired,
  onClick: func.isRequired,
  onChange: func.isRequired,
  onFocus: func,
};

export default AutoComplete;
