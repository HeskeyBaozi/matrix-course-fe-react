import { notification } from 'antd';
import axios, { AxiosResponse } from 'axios';
import React from 'react';

const xconfig = {
  timeout: 5000,
  xsrfCookieName: 'X-CSRF-Token',
  xsrfHeaderName: 'X-CSRF-Token'
};

export const xios = axios.create(xconfig);

export const xiosSilence = axios.create(xconfig);

xios.interceptors.response.use(
  (response) => response,
  (error): Promise<never | AxiosResponse<any>> => {
    const { request, response, config, code } = error;
    const message = <span><strong>{ (config.method as string).toUpperCase() }</strong> { config.url }</span>;

    // Timeout
    if (code && code === 'ECONNABORTED') {
      notification.error({
        description: '请求超时',
        message
      });
      return Promise.reject(error);
    }

    notification.error({
      description: response && response.data && response.data.msg || `请求错误`,
      message
    });
    return Promise.reject<AxiosResponse<any>>(response);
  }
);

export interface IMatrixResponse<T, P = {}> {
  data: T;
  msg: string;
  status: string;
  paramData: P;
  time: string;
}
