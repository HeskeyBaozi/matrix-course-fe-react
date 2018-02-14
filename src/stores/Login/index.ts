import { flow, onSnapshot, types } from 'mobx-state-tree';
import { LoadingStore } from '../Loading';
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

const LoginStore = types
  .compose(LoginState, LoadingStore)
  .actions((self: ILoginState) => {
    return {
      /**
       * Every time query the user login status.
       */
      QueryLoginStatusAsync: flow(function* QueryLoginStatusAsync() {
        const { data }: { data: ILoginQueryResult } = yield fetchUserLoginState();
        self.isLogin = data.status === 'OK';
        return data as ILoginQueryResult;
      }),

      /**
       * Login and free previous captcha & avatar URL.
       */
      LoginAsync: flow(function* LoginAsync(body: ILoginBody) {
        const { data }: { data: ILoginResult } = yield loginPost(body);
        if (data.status === 'OK') {
          self.isLogin = true;
          URL.revokeObjectURL(self.avatarUrl);
          URL.revokeObjectURL(self.captchaUrl);
        }
        return data;
      }),

      /**
       * Load avatar and free previous avatar URL.
       */
      LoadAvatarAsync: flow(function* LoadAvatarAsync(username: string) {
        const { data }: { data: Blob } = yield fetchAvatar(username);
        if (self.avatarUrl) {
          URL.revokeObjectURL(self.avatarUrl);
        }
        self.avatarUrl = URL.createObjectURL(data);
        return data;
      }),

      /**
       * Load captcha and free previous captcha URL.
       */
      LoadCaptchaAsync: flow(function* LoadCaptchaAsync() {
        const { data: { data: { captcha } } } = yield fetchCaptcha();
        const svg = new Blob([ captcha ], { type: 'image/svg+xml' });
        if (self.captchaUrl) {
          URL.revokeObjectURL(self.captchaUrl);
        }
        self.captchaUrl = URL.createObjectURL(svg);
        return captcha;
      })
    };
  });

type ILoginStoreType = typeof LoginStore.Type;

export interface ILoginStore extends ILoginStoreType {
}

export const loginStore: ILoginStore = LoginStore.create();
