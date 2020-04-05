import { useState, useEffect, useRef } from 'react';

const useForm = (inputNames) => {
  /* eslint-disable no-param-reassign */
  const formDefaultData = inputNames.reduce((inputObject, inputName) => {
    inputObject[inputName] = {
      ref: useRef(),
      value: '',
      error: '',
      selectedDataListItem: 0,
      files: [],
      name: inputName,
    };
    return inputObject;
  }, {});
  const [formData, setFormData] = useState(formDefaultData);
  const [isFormValid, setFormValidation] = useState(null);

  const validateFormData = (inputNames, formData, type) => {
    const results = inputNames
      .map((inputName) => {
        const input = formData[inputName];
        const inputRef = input.ref.current;
        if (type === 'submit') {
          // triggers focus and blur event on each input to highlight empty required fields
          inputRef.focus();
          inputRef.blur();
        }
        if (!inputRef) return true;
        const inputEntryType = inputRef.type === 'file' ? 'files' : 'value';
        const inputEntry = input[inputEntryType];
        const isInputEntryEmpty = inputEntry.length < 1;
        const isRequiredInputValid = inputRef.required ? !isInputEntryEmpty : true;
        /* const hasError = input.error !== '';
        console.log('=============================');
        console.log('inputEntryType', inputEntryType);
        console.log('inputEntry', inputEntry);
        console.log('inputEntryTypeLength', inputEntry.length);
        console.log('input required', inputRef.required);
        console.log('isInputEntryEmpty', isInputEntryEmpty);
        console.log('isRequiredInputValid', isRequiredInputValid);
        console.log('error', input.error);
        console.log('hasError', hasError); */

        // checks whether required field have been filled out, and no inputs have errors
        return (!input.error && isRequiredInputValid);
      });
    // checks whether required field have been filled out, and no inputs have errors and returns the result
    const formValidation = results.every((result) => result);
    // console.log(results);
    setFormValidation(formValidation);
  };
  const updateFormData = ({ value, files, error, name, selectedDataListItem }) => {
    const inputData = { [name]: { value, files, error, selectedDataListItem } };
    const mergedInputData = { ...formData[name], ...inputData[name] };
    const updatedFormData = { ...formData, ...{ [name]: mergedInputData } };
    validateFormData(inputNames, updatedFormData);
    setFormData(updatedFormData);
  };
  const resetFormData = () => setFormData(formDefaultData);

  useEffect(() => () => resetFormData(), []);

  return {
    formData,
    isFormValid,
    updateFormData,
    setInitFormData: (formFieldEntries) => {
      const updatedFormData = Object.entries(formFieldEntries).reduce((input, entry) => {
        const [name, value] = entry;
        input[name].value = value;
        return input;
      }, formData);
      setFormData(updatedFormData);
    },
    resetFormData,
    validateFormData,
  };
};

export default useForm;
