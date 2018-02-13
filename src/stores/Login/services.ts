import { xios } from '../axios';
import { ICaptchaResult, ILoginBody, ILoginQueryResult, ILoginResult } from './interfaces';

/******************************
 *           Captcha
 ******************************/

// https://api.vmatrix.org.cn/#/captcha/get_api_captcha
export function fetchCaptcha() {
  return xios.get<ICaptchaResult>(`/api/captcha`);
}

/******************************
 *           Login
 ******************************/

// https://api.vmatrix.org.cn/#/user/get_api_users_login
export function fetchUserLoginState() {
  return xios.get<ILoginQueryResult>('/api/users/login');
}

// https://api.vmatrix.org.cn/#/user/post_api_users_login
export function loginPost(body: ILoginBody) {
  return xios.post<ILoginResult>('/api/users/login', body);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_logout
export function logoutPost() {
  return xios.post('/api/users/logout');
}

export function fetchAvatar(username: string) {
  return xios.get<Blob>(`/api/users/profile/avatar?username=${username}`, { responseType: 'blob' });
}
