import { IMatrixResponse } from '../axios';

export interface ICaptchaResult {
  data: {
    captcha: string;
  };
}

// User
export interface ILoginQueryResult extends IMatrixResponse<ILoginSuccessData | {}> {
  status: 'OK' | 'NOT_AUTHORIZED';
}

export interface ILoginBody {
  username: string;
  password: string;
  captcha?: string;
}

export interface ILoginErrorData {
  captcha?: boolean;
}

export interface ILoginSuccessData {
  realname: string;
}

export interface ILoginResult extends IMatrixResponse<ILoginErrorData | ILoginSuccessData> {
  status: 'WRONG_PASSWORD' | 'WRONG_CAPTCHA' | 'OK';
}
