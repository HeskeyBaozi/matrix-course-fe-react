import { coursesStore } from './Courses';
import { globalStore } from './Global';
import { loginStore } from './Login';
import { notificationStore } from './Notification';
import { profileStore } from './Profile';
import { todosStore } from './Todos';

export const stores = {
  $Login: loginStore,
  $Global: globalStore,
  $Profile: profileStore,
  $Courses: coursesStore,
  $Notification: notificationStore,
  $Todos: todosStore
};
