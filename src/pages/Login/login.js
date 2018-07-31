import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './login.scss';
import { decode } from 'jsonwebtoken';

import { set } from '../../service/redux/reducers/account';
import * as network from '../../service/network';
import * as Conf from '../../service/conf';

class Login extends Component {

  state = {
    mode: 'login',
    email: '',
    password: '',
    confirm: '',
    nickName: '',
    idAfterSign: '',
    nickAfterSign: '',
  };

  componentDidMount() {
    // console.log(this.props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const account = this.props.account;
    if (account.loggedIn &&
        account.accessToken !== undefined &&
        account.reduxState === 'done') {
      console.log('로그인 되어있으므로, 메인 페이지로 이동해요.');
      const userId = decode(account.accessToken)['userId'];
      this.props.history.replace(`/projectList/${userId}`);
    }
  }

  changeMode = (event) => {
    event.stopPropagation();

    let mode = this.state.mode === 'login' ? 'sign' : 'login';

    this.setState(
      {
        mode: mode,
        email: '',
        password: '',
        confirm: '',
        nickName: ''
      });
  }

  changeValue = (event) => {
    // console.log(event.target);
    const key = event.target.name;
    const value = event.target.value;
    // console.log(`${key}, ${value}`);
    this.setState({[key]: value});
    // console.log(this.state);
  }

  login = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { email, password } = this.state;
    console.log(`${email}, ${password}`);

    network.Account.login(email, password)
    .then(result => {
      if (result.data.result) {
        // TODO 로그인 성공. 로컬저장소에 엑세스토큰 저장이 우선.
        console.log(result.data);
        const payload = result.data.payload;
        
        localStorage.setItem(Conf.LOCAL_ACCESS_TOKEN, payload.accessToken);

        this.props.setAccount(
          {
            loggedIn: true,
            accessToken: payload.accessToken,
            reduxState: 'done'
          }
        );

      } else {
        // TODO 로그인 실패. 어쩐담.
      }
    });
  }

  sign = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { email, password, confirm, nickName } = this.state;
    console.log(`${email}, ${password}, ${confirm}, ${nickName}`);

    network.Account.sign(email, password, nickName)
    .then(result => {
      // console.log(result);
      if (result.data.result) {
        // TODO 가입 성공. 로컬 저장소에 엑세스토큰 저장.
        console.log(result.data.msg);
        console.log(result.data.payload);

        localStorage.setItem( Conf.LOCAL_ACCESS_TOKEN,
                              result.data.payload.accessToken);

        this.setState(
          {
            mode: 'afterSign',
            idAfterSign: result.data.payload.id,
            nickAfterSign: result.data.payload.nickName
          });
      } else {
        // TODO 가입 실패. 어쩌지
      }
    });
  }

  okBtn = (event) => {
    event.stopPropagation();

    this.props.history.replace('/');
  }

  render() {
    let what = (<div></div>);

    if (this.state.mode === 'login') {
      what = (
        <div id={css.logInDiv}>
        <form onSubmit={this.login}>
          <div id={css.title}>Login</div>
          <div id={css.email} className={css.marginBottom}>
            <input
              type="text"
              name="email"
              placeholder="E-mail"
              value={this.state.email}
              onChange={this.changeValue}
              />
          </div>
          <div id={css.password}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.changeValue}
              />
          </div>
          <div id={css.buttons}>
            <button type="submit">Login</button>
          </div>
          <div id={css.changeMode} onClick={this.changeMode}>
            Sign
          </div>
        </form>
        </div>
      );
    } else if (this.state.mode === 'sign'){
      what = (
        <div>
        <form id={css.logInDiv} onSubmit={this.sign}>
          <div id={css.title}>Sign</div>
          <div id={css.email} className={css.marginBottom}>
            <input
              type="text"
              name="email"
              placeholder="E-mail"
              value={this.state.email}
              onChange={this.changeValue}
              />
          </div>

          <div id={css.password} className={css.marginBottom}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.changeValue}
              />
          </div>

          <div id={css.password} className={css.marginBottom}>
            <input
              type="password"
              name="confirm"
              placeholder="Confirm"
              value={this.state.confirm}
              onChange={this.changeValue}
              />
          </div>

          <div id={css.nickName}>
            <input
              type="text"
              name="nickName"
              placeholder="Nickname"
              value={this.state.nickName}
              onChange={this.changeValue}
              />
          </div>

          <div id={css.buttons}>
            <button type="submit">Sign</button>
          </div>
          <div id={css.changeMode} onClick={this.changeMode}>
            login
          </div>
        </form>
        </div>
      );
    } else {
      what = (
        <div id={css.afterSign}>
          <div id={css.msgDiv}>
            <div id={css.title}>가입 완료</div>
            <div id={css.id}>ID: {this.state.idAfterSign}</div>
            <div id={css.nickName}>닉네임: {this.state.nickAfterSign}</div>
            <div id={css.Btns}>
              <button id={css.okBtn}
                type="button"
                onClick={this.okBtn}
                >
                확인
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id={css.background}>
        {what}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { account: state.account };
}

const mapDispatchToProps = (dispatch) => {
  return { setAccount: (value) => { dispatch(set(value)) } };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);