import IntegrationSelection from './IntegrationSelection';
import TasksList from './TasksList';

export default [
  {
    path: '/',
    component: TasksList,
    exact: true,
  },
  {
    path: '/integration-selection',
    component: IntegrationSelection,
    exact: true,
  },
];
