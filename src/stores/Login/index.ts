import { flow, types } from 'mobx-state-tree';
import { ILoginBody, ILoginQueryResult, ILoginResult } from './interfaces';
import { fetchAvatar, fetchCaptcha, fetchUserLoginState, loginPost } from './services';

const LoginState = types
  .model('Login', {
    isLogin: false,
    avatarUrl: '',
    captchaUrl: ''
  });

type ILoginStateType = typeof LoginState.Type;

interface ILoginState extends ILoginStateType {
}

const LoginStore = LoginState
  .actions((self: ILoginState) => ({

    /**
     * Every time query the user login status.
     */
    QueryLoginStatusAsync: flow(function* () {
      const { data }: { data: ILoginQueryResult } = yield fetchUserLoginState();
      self.isLogin = data.status === 'OK';
    }),

    /**
     * Login and free previous captcha & avatar URL.
     */
    LoginAsync: flow(function* (body: ILoginBody) {
      const { data }: { data: ILoginResult } = yield loginPost(body);
      if (data.status === 'OK') {
        self.isLogin = true;
        URL.revokeObjectURL(self.avatarUrl);
        URL.revokeObjectURL(self.captchaUrl);
      }
    }),

    /**
     * Load avatar and free previous avatar URL.
     */
    LoadAvatarAsync: flow(function* (username: string) {
      const { data }: { data: Blob } = yield fetchAvatar(username);
      if (self.avatarUrl) {
        URL.revokeObjectURL(self.avatarUrl);
      }
      self.avatarUrl = URL.createObjectURL(data);
    }),

    /**
     * Load captcha and free previous captcha URL.
     */
    LoadCaptchaAsync: flow(function* () {
      const { data: { data: { captcha } } } = yield fetchCaptcha();
      const svg = new Blob([ captcha ], { type: 'image/svg+xml' });
      if (self.captchaUrl) {
        URL.revokeObjectURL(self.captchaUrl);
      }
      self.captchaUrl = URL.createObjectURL(svg);
    })
  }));

type ILoginStoreType = typeof LoginStore.Type;

export interface ILoginStore extends ILoginStoreType {
}

export const loginStore: ILoginStore = LoginStore.create();
