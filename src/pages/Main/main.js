import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import css from './main.scss';
import { decode } from 'jsonwebtoken';

const Main = (props) => {
  // console.log(props);

  const show = () => {
    if (props.account.loggedIn) {
      const userId = decode(props.account.accessToken)['userId'];
      return (<Link to={`/projectList/${userId}`}>프로젝트 화면으로 이동</Link>);
    }
    else {
      return (<Link to={'/login'}>로그인 화면으로 이동</Link>);
    }
  }

  return (
    <div id={css.background}>
      {/* {show()} */}
    </div>
  );
}

const stateFromProps = (state) => {
  return {
    account: state.account,
  };
};

const dispatchFromProps = (dispatch) => {
  return {};
}

export default connect(stateFromProps, dispatchFromProps)(Main);
// export default Main;