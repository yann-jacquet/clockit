import React, { useState } from 'react';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';

// Components
import Message from '../components/atoms/Message';

const IntegrationSelection = () => {
  const [values, setValues] = useState({
    apiUrl: '',
    apiKey: '',
  });
  const [requestState, , error, { testFirstConnection }] = useRedmineApi();

  const handleChange = (e) => setValues(
    { ...values, [e.target.name]: e.target.value },
  );
  const handleOnSubmit = (e) => {
    e.preventDefault();
    testFirstConnection(values.apiUrl, values.apiKey);
  };
  const isValidationBtnDisabled = () => (
    !values.apiUrl
    || !values.apiKey
    || requestState === 'loading'
  );
  return (
    <div className="flex flex-col h-full justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error
          ? <Message colorScheme="error">Oops ! Seems your information aren't correct, please double check !</Message>
          : null}
        <label htmlFor="apiUrl" className="block text-gray-700 text-sm font-bold mb-2">
          API url :
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border-b-4 border-grey-700 focus:outline-none focus:border-blue-300"
            type="text"
            placeholder="API URL"
            name="apiUrl"
            value={values.apiUrl}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="apiKey" className="block text-gray-700 text-sm font-bold mb-2">
          API Key :
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border-b-4 border-grey-700 focus:outline-none focus:border-blue-300"
            type="text"
            name="apiKey"
            placeholder="API Key"
            value={values.apiKey}
            onChange={handleChange}
          />
        </label>
        <button
          className={`
          mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-blue-700 hover:border-blue-500
          ${isValidationBtnDisabled() ? ' opacity-50 cursor-not-allowed' : ''}
          `}
          type="button"
          onClick={handleOnSubmit}
          disabled={isValidationBtnDisabled()}
        >
          Test & submit
        </button>
      </form>
    </div>
  );
};

export default IntegrationSelection;
