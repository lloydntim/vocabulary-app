import React, { useState } from 'react';
import { string, func, bool, number, object, shape, arrayOf, oneOfType } from 'prop-types';
import { useTranslation } from 'react-i18next';

import './Input.scss';
import IconButton from '../IconButton/IconButton';
import Message from '../Message/Message';

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const resolveError = (value, files, props) => {
  const {
    t,
    type,
    pattern,
    required,
    minLength,
    maxLength,
    patternErrorMessage,
    requiredErrorMessage,
    minLengthErrorMessage,
    maxLengthErrorMessage,
  } = props;

  let error;
  const fileList = files || [];
  const isFileListPatternValid = fileList.length > 0 && fileList[0].name.match(pattern);
  if (type === 'file') {
    if (required && fileList.length < 1) {
      error = requiredErrorMessage || t(`messages_error_input_${type}_required`);
    } else if (fileList.length > 0 && !isFileListPatternValid) {
      error = patternErrorMessage || t(`messages_error_input_${type}_pattern`);
    }
  } else if (required && value.length < 1) {
    error = requiredErrorMessage || t(`messages_error_input_${type}_required`);
  } else if (minLength && (value.length > 0 && value.length < minLength)) {
    error = minLengthErrorMessage || t(`messages_error_input_${type}_minLength`, { minLength });
  } else if (maxLength && (value.length > maxLength)) {
    error = maxLengthErrorMessage || t(`messages_error_input_${type}_maxLength`, { maxLength });
  } else if (type === 'email' && !value.match(emailPattern)) {
    error = t(`messages_error_input_${type}_pattern`);
  } else if (pattern && !value.match(pattern)) {
    error = patternErrorMessage || t(`messages_error_input_${type}_pattern`);
  } else {
    error = '';
  }
  return error;
};

/* eslint-disable react/jsx-props-no-spreading */
const Input = (props) => {
  const {
    inputRef,
    label,
    autoComplete,
    dataList,
    name,
    type,
    placeholder,
    value,
    pattern,
    required,
    minLength,
    maxLength,
    patternErrorMessage,
    requiredErrorMessage,
    minLengthErrorMessage,
    maxLengthErrorMessage,
    onChange,
    onFocus,
    onBlur,
    onDataListClick,
  } = props;
  const { t } = useTranslation();
  const isTypePassword = type === 'password';
  const [inputType, setInputType] = useState('password');
  const [fileName, setFileName] = useState('');
  const [isDataListVisible, setDataListVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputTypeName = isTypePassword ? inputType : type;
  const validationProps = {
    t,
    type,
    value,
    pattern,
    required,
    minLength,
    maxLength,
    patternErrorMessage,
    requiredErrorMessage,
    minLengthErrorMessage,
    maxLengthErrorMessage,
  };
  return (
    <label className={`input input-type-${inputTypeName} input-is-${!errorMessage ? 'valid' : 'invalid'}`} htmlFor={name}>
      <span className="input-label">{label}</span>
      <input
        ref={inputRef}
        required={required}
        className="input-element"
        autoComplete={autoComplete}
        name={name}
        type={inputTypeName}
        placeholder={placeholder}
        value={value}
        onChange={({ target: { value, files } }) => {
          const error = resolveError(value, files, validationProps);
          if (type === 'password' || type === 'file') setErrorMessage(error);
          if (dataList) setDataListVisibility(true);
          if (files) setFileName(files[0].name);
          onChange({ value, files, error, required, name });
        }}
        onFocus={onFocus}
        onBlur={({ target: { value, files } }) => {
          const error = resolveError(value, files, validationProps);

          setErrorMessage(error);
          if (onBlur) onBlur({ value, files, error, required, name });
        }}
      />
      {type === 'password' && (
        <IconButton
          icon="view"
          type="primary"
          onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
        />
      )}

      {(dataList && isDataListVisible && dataList.length > 1) && (
        <ul className="datalist">
          {
            dataList
              .filter((item) => value.length > 0 && item.text.toLowerCase().startsWith(value.toLowerCase()))
              .map((item, index) => {
                const boldText = item.text.substring(0, value.length);
                const normalText = item.text.substring(value.length);
                return (
                  <li key={index} className="datalist-item">
                    <button
                      type="button"
                      className="datalist-item-button"
                      onClick={() => {
                        setDataListVisibility(false);
                        onChange({ value: dataList[dataList.indexOf(item)].text, name, selectedDataListItem: dataList.indexOf(item) });
                        onDataListClick({ ...item, index });
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
      {(!errorMessage) && fileName && <Message type="info" content={fileName} />}
      {errorMessage && <Message type="error" content={errorMessage} />}
    </label>
  );
};

Input.defaultProps = {
  inputRef: null,
  label: '',
  autoComplete: '',
  dataList: null,
  type: 'text',
  placeholder: '',
  value: '',
  pattern: null,
  required: false,
  minLength: null,
  maxLength: null,
  patternErrorMessage: '',
  requiredErrorMessage: '',
  minLengthErrorMessage: '',
  maxLengthErrorMessage: '',
  onChange: null,
  onFocus: null,
  onBlur: null,
  onDataListClick: null,
};

Input.propTypes = {
  inputRef: object,
  label: string,
  autoComplete: string,
  dataList: arrayOf(shape({
    value: oneOfType([string, number, bool]),
    text: string,
  })),
  type: string,
  name: string.isRequired,
  placeholder: string,
  value: string,
  pattern: object,
  required: bool,
  minLength: number,
  maxLength: number,
  patternErrorMessage: string,
  requiredErrorMessage: string,
  minLengthErrorMessage: string,
  maxLengthErrorMessage: string,
  onChange: func,
  onFocus: func,
  onBlur: func,
  onDataListClick: func,
};

export default Input;
