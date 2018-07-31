import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './toolbar.scss';

import { logout } from '../../service/redux/reducers/account';
import { set as setToolbar } from '../../service/redux/reducers/toolbar';
import * as Conf from '../../service/conf';

class Toolbar extends Component {
  state = { };

  testLogOut = (event) => {
    if (event) { event.stopPropagation(); }

    localStorage.removeItem(Conf.LOCAL_ACCESS_TOKEN);
    this.props.logoutAccount();

  };

  moveTo = (event) => {
    if (event) { event.stopPropagation(); }

    this.props.history.replace(this.props.toolbar.parentUrl);
    // this.props.history.replace('/projectList/cotsell@gmail.com');
    // this.props.history.goBack();
  };

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    let backButton;
    if (this.props.toolbar.showBackButton) {
      backButton = (
        <div id={css.icon}
          onClick={this.moveTo}
          >
          <i className={'material-icons'}>arrow_back</i>
        </div>
      );
    }

    return (
      <div id={css.background}>
        
        <div>
          {backButton}
        </div>

        <div id={css.where}>
          {this.props.toolbar.title}
        </div>

        <div id={css.center}>
          Project Note
        </div>

        <div id={css.profile}
          onClick={this.testLogOut}
          >
          LogOut
        </div>
      </div>
    );
  }
}

const stateToProps = (state) => (
  {
    account: state.account,
    toolbar: state.toolbar,
  }
);

const dispatchToProps = (dispatch) => (
  {
    logoutAccount: () => { dispatch(logout()); },
    setToolbar: (value) => { dispatch(setToolbar(value)) },
  }
);

export default connect(stateToProps, dispatchToProps)(Toolbar);