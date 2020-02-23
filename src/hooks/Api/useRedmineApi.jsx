// Hooks
import useApi from './useApi';
import useFileSystem from '../useFileSystem';

// Utils
import msToHours from '../../utils/msToHours';

const useRedmineApi = () => {
  const [requestState, payload, error, request] = useApi();
  const [getParams, setParams] = useFileSystem({
    src: 'user-preferences',
    defaults: {
      windowBounds: { width: 800, height: 600 },
      appConfig: {
        registeredAppName: '',
        apiUrl: '',
        apiKey: '',
      },
    },
  });

  const apiParams = getParams('appConfig');

  // Before saving the params, we have to test the connection
  // information given by the user. If the call succeed only
  // then we save on the computer.
  const testFirstConnection = (apiUrl, apiKey) => request(
    'GET',
    `${apiUrl}/issues.json?assigned_to_id=me`,
    null,
    { axiosOptions: { headers: { 'X-Redmine-API-Key': apiKey } } },
  )
    .then((res) => {
      if (res && res.status === 200) {
        setParams('appConfig', {
          registeredAppName: 'redmine',
          apiUrl,
          apiKey,
        });
      }
    });

  const getIssuesAssignedTo = (userId) => request(
    'GET',
    `/issues.json?assigned_to_id=${userId || 'me'}`,
  );

  const getTask = (taskId) => request(
    'GET',
    `${apiParams.apiUrl}/issues.json?issue_id=${taskId}`,
    null,
    { axiosOptions: { headers: { 'X-Redmine-API-Key': apiParams.apiKey } } },
  );

  const postTimeEntry = (task) => {
    const newTimeEntry = {
      issue_id: task.id,
      spent_on: task.timeTracking.startTimestamp,
      hours: msToHours(task.timeTracking.endTimestamp - task.timeTracking.startTimestamp),
    };
    console.log(newTimeEntry);
  };

  return [
    requestState,
    payload,
    error,
    {
      testFirstConnection,
      getIssuesAssignedTo,
      getTask,
      postTimeEntry,
    },
  ];
};

export default useRedmineApi;
