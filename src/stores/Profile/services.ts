/******************************
 *           Profile
 ******************************/
import { xios } from '../axios';
import { IProfile, IUpdateProfileBody } from './interfaces';

// https://api.vmatrix.org.cn/#/user/get_api_users_profile
export function fetchProfile() {
  return xios.get<{ data: IProfile }>(`/api/users/profile`);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_profile
export function updateProfile(body: IUpdateProfileBody, avatar: File) {
  //
}
