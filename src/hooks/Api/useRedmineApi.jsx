import { format } from 'date-fns';

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

      return res;
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
    const xmlBodyStr = `<time_entry>
              <issue_id>${task.id}</issue_id>
              <spent_on>${format(task.timeTracking.startTimestamp, 'yyyy-MM-dd')}</spent_on>
              <hours>${msToHours(task.timeTracking.endTimestamp - task.timeTracking.startTimestamp)}</hours>
              <activity_id>9</activity_id>
              <comments></comments>
           </time_entry>`;

    return request(
      'POST',
      `${apiParams.apiUrl}/time_entries.xml`,
      xmlBodyStr,
      {
        axiosOptions: {
          headers: {
            'X-Redmine-API-Key': apiParams.apiKey,
            'Content-Type': 'text/xml',
          },
        },
      },
    );
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
