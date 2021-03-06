import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';

// Components
import Message from '../components/atoms/Message';

const zolJobsList = [
  'Dev Front',
  'Dev Back',
  'Conseil',
  'UX',
  'GP',
  'UI',
  'Data - Chef',
  'Data - Expert SEO',
  'Data - Web Analyst',
];

const IntegrationSelection = () => {
  const [values, setValues] = useState({
    apiUrl: '',
    apiKey: '',
    job: '',
  });
  const [isConnectionValid, setIsConnectionValid] = useState(false);
  const [requestState, , error, { testFirstConnection }] = useRedmineApi();
  const history = useHistory();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.selectedOptions[0].value,
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    testFirstConnection(
      values.apiUrl.replace(/\/$/, ''),
      values.apiKey,
      values.job,
    ).then((res) => res && res.status === 200 && setIsConnectionValid(true));
  };

  const isValidationBtnDisabled = () => !values.apiUrl || !values.apiKey || requestState === 'loading';

  const handleStartClick = () => history.push('/');

  return (
    <div className="h-screen flex flex-col h-full justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error ? (
          <Message colorScheme="error">
            Oops ! Seems your information aren&apos;t correct, please double
            check !
          </Message>
        ) : null}
        <label
          htmlFor="job"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Occupied Job :
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="job"
            name="job"
            value={values.job}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select Job
            </option>
            {zolJobsList.map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
          </select>
        </label>
        <label
          htmlFor="apiUrl"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          API url :
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border-b-4 border-grey-700 focus:outline-none focus:border-blue-300"
            type="text"
            placeholder="https://redminedomain.com"
            name="apiUrl"
            value={values.apiUrl}
            onChange={handleChange}
          />
        </label>
        <label
          htmlFor="apiKey"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          API Key :
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border-b-4 border-grey-700 focus:outline-none focus:border-blue-300"
            type="text"
            name="apiKey"
            placeholder="000aa0000aaa00a00a000a000a0a000aaa00000a"
            value={values.apiKey}
            onChange={handleChange}
          />
        </label>

        {isConnectionValid ? (
          <button
            className={`
              mt-2 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-green-700 hover:border-green-500
              ${
                isValidationBtnDisabled()
                  ? ' opacity-50 cursor-not-allowed'
                  : ''
              }
              `}
            type="button"
            onClick={handleStartClick}
            disabled={isValidationBtnDisabled()}
          >
            Start tracking
          </button>
        ) : (
          <button
            className={`
              mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-blue-700 hover:border-blue-500
              ${
                isValidationBtnDisabled()
                  ? ' opacity-50 cursor-not-allowed'
                  : ''
              }
              `}
            type="button"
            onClick={handleOnSubmit}
            disabled={isValidationBtnDisabled()}
          >
            Test connection
          </button>
        )}
      </form>
    </div>
  );
};

export default IntegrationSelection;
