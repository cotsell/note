import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './passModal.scss';

// Reducers..
import { setPassModal } from '../../../service/redux/reducers/profile';

// Service..
import * as network from '../../../service/network';

class PassModal extends Component {
  state = {
    show: false,
    oldPass: '',
    newPass: ''
  };

  changeValue = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closeModal = (event) => {
    if (event) { event.stopPropagation(); }

    this.setState({ oldPass: '', newPass: '' });
    this.props.setPassModal({ show: false });
  };

  changePassword = (event) => {
    event.stopPropagation();

    const accessToken = this.props.account.accessToken;
    const oldPass = this.state.oldPass;
    const newPass = this.state.newPass;

    network.Account.changePassword(accessToken, oldPass, newPass)
    .then(result => {
      if (result.data.result) {
        console.log(`비밀번호 변경 성공했어요.`);
        this.closeModal(undefined);
        alert(`비밀번호 변경 성공했어요.`)
      }
      else {
        console.error(result.data.msg);
        this.setState({ oldPass: '', newPass: '' });
        alert(`비밀번호가 틀렸어요.`)
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(this.state);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.profile.passModal.show !== prevState.show) {
      return nextProps.profile.passModal;
    }

    return null;
  }

  render() {
    return (
      <div id={css.backgroundDiv} className={this.state.show ? css.show : css.hide}>
        <div id={css.mainDiv}>
          <div id={css.title}>
            비밀번호 변경
          </div>
          <div id={css.oldPass}>
            <input type="password"
              name="oldPass"
              placeholder="Old Password"
              value={this.state.oldPass}
              onChange={this.changeValue}
              />
          </div>
          <div id={css.newPass}>
            <input type="password"
              name="newPass"
              placeholder="New Password"
              value={this.state.newPass}
              onChange={this.changeValue}
              />
          </div>
          <div id={css.btns}>
            <div id={css.cancel}
              onClick={this.closeModal}
              >
              cancel
            </div>
            <div id={css.ok}
              onClick={this.changePassword}
              >
              ok
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PassModal.defaultProps = {

};

const stateToProps = (state) => {
  return {
    account: state.account,
    profile: state.profile,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    setPassModal: (object) => { dispatch(setPassModal(object)) },
  };
};

export default connect(stateToProps, dispatchToProps)(PassModal);
