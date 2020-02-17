import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi'

const IntegrationSelection = props => {
  const [values, setValues] = useState({
    apiUrl: '',
    apiKey: '',
  })
  const [requestState, payload, error, { testFirstConnection }] = useRedmineApi()

  const handleChange = (e) => setValues(
    { ...values, [e.target.name]: e.target.value}
  )
  const handleOnSubmit = (e) => {
    e.preventDefault();
    testFirstConnection(values.apiUrl, values.apiKey)
  }
  return (
    <div>
      <form>
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
        <button type="button" onClick={handleOnSubmit}>
          Valider
        </button>
      </form>
    </div>
  )
}

IntegrationSelection.propTypes = {

}

export default IntegrationSelection
