import React, { useState } from 'react';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';

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
  return (
    <div>
      <form>
        {error
          ? <span>{error}</span>
          : null}
        <input
          type="text"
          placeholder="API URL"
          name="apiUrl"
          value={values.apiUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          name="apiKey"
          placeholder="API Key"
          value={values.apiKey}
          onChange={handleChange}
        />
        <button type="button" onClick={handleOnSubmit} disabled={requestState === 'loading'}>
          Valider
        </button>
      </form>
    </div>
  );
};

export default IntegrationSelection;
