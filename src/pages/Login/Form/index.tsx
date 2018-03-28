import { Button, Form, Icon, Input, notification, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { action, autorun, computed, IReactionDisposer, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import defaultAvatarUrl from '../../../assets/images/avatar.jpg';
import Loading from '../../../components/common/Loading';
import { ILoginStore } from '../../../stores/Login';
import { ILoginBody } from '../../../stores/Login/interfaces';
import styles from './index.module.less';

const Item = Form.Item;

interface ILoginFormProps extends RouteConfigComponentProps<{}>, FormComponentProps {
  $Login?: ILoginStore;
}

@inject('$Login')
@observer
class LoginForm extends React.Component<ILoginFormProps> {

  @observable
  username = '';

  disposer: IReactionDisposer | undefined;

  @action
  handleUsernameChange = (e: SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.username = e.currentTarget.value;
  }

  handleCaptchaChange = () => {
    return this.props.$Login!.LoadCaptchaAsync();
  }

  handleSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { form: { validateFields } } = this.props;
    validateFields({ force: true }, async (error, values: ILoginBody) => {
      if (!error) {
        const { $Login } = this.props;

        // Login Flow
        const result = await $Login!.LoginAsync(values);

        // When login success...
        if (result && result.status === 'OK') {
          const realname = result.data && result.data.realname;
          notification.success({
            description: realname && `欢迎你, ${realname}` || `欢迎你`,
            message: '登录成功'
          });

          // When login with wrong captcha or wrong password...
        } else if (result && (result.status === 'WRONG_CAPTCHA'
          && $Login!.captchaUrl || result.status === 'WRONG_PASSWORD')) {
          notification.error({
            description: result.msg || '登录错误',
            message: '登录失败'
          });
        }

        // Refresh captcha
        if (result && result.data && result.data.captcha) {
          await $Login!.LoadCaptchaAsync();
        }
      }
    });
  }

  @computed
  get AvatarArea() {
    const { $Login } = this.props;
    return (
      <Item className={ styles.avatarWrapper }>
        <Loading loading={ $Login!.$loading.get('LoadAvatarAsync') } />
        <img src={ $Login!.avatarUrl || defaultAvatarUrl } />
      </Item>
    );
  }

  @computed
  get UserName() {
    const { form: { getFieldDecorator } } = this.props;
    const input = (
      getFieldDecorator('username', {
        rules: [ { required: true, message: '请输入用户名' } ]
      })(
        <Input
          onChange={ this.handleUsernameChange }
          placeholder={ 'Username' }
          prefix={ <Icon type={ 'user' } /> }
        />
      )
    );
    return <Item>{ input }</Item>;
  }

  @computed
  get Password() {
    const { form: { getFieldDecorator } } = this.props;
    const input = (
      getFieldDecorator('password', {
        rules: [ { required: true, message: '请输入密码' } ]
      })(<Input type={ 'password' } placeholder={ 'Password' } prefix={ <Icon type={ 'lock' } /> } />)
    );
    return <Item>{ input }</Item>;
  }

  @computed
  get Captcha() {
    const { $Login } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    const input = (
      getFieldDecorator('captcha', {
        rules: [ { required: Boolean($Login!.captchaUrl), message: '请输入验证码' } ]
      })(<Input placeholder={ 'Captcha' } prefix={ <Icon type='edit' /> } />)
    );

    return (
      <Item className={ !$Login!.captchaUrl && styles.hidden || void 0 }>
        <div className={ styles.captchaWrapper }>
          { input }
          <Tooltip title={ '点击以更换验证码' } trigger={ 'hover' }>
            <div className={ styles.captchaImageWrapper }>
              <Loading loading={ $Login!.$loading.get('LoadCaptchaAsync') } />
              <img
                onClick={ this.handleCaptchaChange }
                className={ styles.captcha }
                src={ $Login!.captchaUrl }
              />
            </div>
          </Tooltip>
        </div>
      </Item>
    );
  }

  @computed
  get SubmitArea() {
    const { $Login } = this.props;
    return (
      <div className={ styles.container }>
        <Button
          loading={ $Login!.$loading.get('LoginAsync') }
          className={ styles.submit }
          type={ 'primary' }
          htmlType={ 'submit' }
        >
          LOGIN
        </Button>
      </div>
    );
  }

  componentDidMount() {
    const { $Login } = this.props;
    this.disposer = autorun(() => {
      if (this.username.length > 5) {
        $Login!.LoadAvatarAsync(this.username);
      }
    }, { delay: 1500 });
  }

  componentWillUnmount() {
    if (this.disposer) {
      this.disposer();
    }
  }

  render() {
    return (
      <Form onSubmit={ this.handleSubmit }>
        { this.AvatarArea }
        { this.UserName }
        { this.Password }
        { this.Captcha }
        { this.SubmitArea }
      </Form>
    );
  }
}

export default Form.create({})(LoginForm);
