import { coursesStore } from './Courses';
import { globalStore } from './Global';
import { loginStore } from './Login';
import { profileStore } from './Profile';

export const stores = {
  $Login: loginStore,
  $Global: globalStore,
  $Profile: profileStore,
  $Courses: coursesStore
};
