// Hooks
import useApi from "./useApi"
import useFileSystem from '../useFileSystem'

const useRedmineApi = () => {
  const [requestState, payload, error, request] = useApi()
  const [, setParams] = useFileSystem({
    defaults: {
      windowBounds: { width: 800, height: 600 },
      appConfig: {
        registeredAppName: '',
        apiUrl: '',
        apiKey: '',
      },
    }
  })

  // Before saving the params, we have to test the connection
  // information given by the user. If the call succeed only
  // then we save on the computer.
  const testFirstConnection = (apiUrl, apiKey) => request(
    'GET',
    `${apiUrl}/issues.json?assigned_to_id=me`,
    null,
    { axiosOptions: { headers: { 'X-Redmine-API-Key': apiKey }}},
  )
    .then((res) => {
      if (res.status === 200) {
        setParams('appConfig', {
          registeredAppName: 'redmine',
          apiUrl,
          apiKey,
        })
      }
    })

  const getIssuesAssignedTo = (userId) => request(
    'GET',
    `/issues.json?assigned_to_id=${userId || 'me'}`,
  )

  return [
    requestState,
    payload,
    error,
    {
      testFirstConnection,
      getIssuesAssignedTo,
    },
  ]
}

export default useRedmineApi
