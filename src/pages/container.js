import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import css from './container.scss';

// Reducers..
import { set } from '../service/redux/reducers/account';

// Components..
import Toolbar from '../components/Toolbar/toolbar';
import Login from './Login/login';
import ProjectList from './ProjectList/projectList';
import SubjectList from './SubjectList/subjectList';
import ItemDetail from './ItemDetail/itemDetail';
import Profile from './Profile/profile';

// Service..
import * as network from '../service/network';
import * as conf from '../service/conf';


class Container extends Component {

  // 로그인
  checkLoggedInAndTryLogIn() {
    // -----------------------------------------------------------
    // ---- 정리용도 함수 모음 시작
    const failedLogin = () => {
      localStorage.removeItem(conf.LOCAL_ACCESS_TOKEN);

      this.props.accountSet({ reduxState: 'done' });

      // if (this.props.location.pathname.indexOf('/item/') > -1) {
      //   // TODO 그냥 아무것도 안해도 되긴 하는데 뭔가 허전해서..
      // } else {
      //   // this.props.history.replace('/login');
      // }
    };
    // ---- 정리용도 함수 모음 끝
    // -----------------------------------------------------------

    const accessToken = localStorage.getItem(conf.LOCAL_ACCESS_TOKEN);

    if (accessToken !== null && accessToken !== undefined) {

      this.props.accountSet({ reduxState: 'pending' });

      // accessToken으로 로그인 시도.
      network.Account.checkAccessToken(accessToken)
      .then(result => {
        if (result.data.result) {
          this.props.accountSet(
            { loggedIn: true,
              accessToken: accessToken,
              reduxState: 'done'
            });

        } else {
          // 엑세스 토큰이 문제가 있음.
          console.error(result.msg);
          failedLogin();
        }
      });

    } else {
      // accessToken이 없는 경우.
      console.error(`엑세스 토큰이 없어요.`);
      failedLogin();
    }
  }

  componentDidMount() {
    this.checkLoggedInAndTryLogIn();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  render() {
    let login;
    if (this.props.account.reduxState === 'done') {
      login = (
        <div>
          <Route path="/" component={Toolbar} />
          {/* <Route path="/" render={() => <div><Toolbar test={'tteesstt'}/></div>} /> */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/projectList/:userId" component={ProjectList} />
          <Route exact path="/subjectList/:projHisId" component={SubjectList} />
          <Route exact path="/itemDetail/:itemHisId" component={ItemDetail} />
          <Route exact path="/profile" component={Profile} />
        </div>
      );
    } else {
      login = (
        <div style={{ textAlign: 'center' }}>
          로그인 중이에요.
        </div>
      );
    }

    return (
      <div id={css.background}>
        {login}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return { account: state.account };
};

const mapDispatchToProps = (dispatch) => {
  return { accountSet: (state) => dispatch(set(state)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);