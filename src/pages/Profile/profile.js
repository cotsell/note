import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './profile.scss';
import { decode } from 'jsonwebtoken';

// Reducers..
import { setPassModal } from '../../service/redux/reducers/profile';
import { set as setToolbar } from '../../service/redux/reducers/toolbar';

// Components..
import PassModal from '../../components/modals/PassModal/passModal';

// Service..


class Profile extends Component {
  state = {
    passModal: { show: false },
  };

  constructor(props) {
    super(props);

    if (!this.props.account.loggedIn) {
      console.error(`로그인이 필요한 페이지에요.`);
      this.props.history.replace('/login');
    }

  }

  openPasswordModal = (event) => {
    event.stopPropagation();

    this.props.setPassModal({ show: true });
  }

  firstSetting = () => {
    const userId = decode(this.props.account.accessToken)['userId'];

    this.props.setToolbar({
      title: 'back to project',
      mode: 'profile',
      showBackButton: true,
      parentUrl: `/projectList/${userId}`
    });
  };

  componentDidMount() {
    if (this.props.account.loggedId) {
      this.firstSetting();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const passModal = nextProps.profile.passModal;
    if (passModal.show !== prevState.passModal.show) {
      return passModal;
    }

    return null;
  }

  render() {
    const getUserId = () => {
      if (this.props.account.loggedIn) {
        return decode(this.props.account.accessToken)['userId'];
      }
      return ;
    }

    return (
      <div id={css.backgroundDiv}>
        <div id={css.mainDiv}>
          <div id={css.img}>
            <i className="material-icons">image</i>
          </div>
          <div id={css.id} className={css.Col2Grid}>
            <div>ID</div>
            <div className={css.right}>
              {getUserId()}
            </div>
          </div>
          <div id={css.password} className={css.Col2Grid}>
            <div>
              Password
            </div>
            <div className={`${css.right} ${css.hover}`}
              onClick={this.openPasswordModal}
              >
              변경
            </div>
            
          </div>
        </div>
        <PassModal />
      </div>
    );
  }
}

Profile.defaultProps = {

};

const stateToProps = (state) => {
  return {
    account: state.account,
    profile: state.profile
  };
};

const dispatchToProps = (dispatch) => {
  return {
    setPassModal: (object) => { dispatch(setPassModal(object)) },
    setToolbar: (object) => { dispatch(setToolbar(object)) },
  };
}

export default connect(stateToProps, dispatchToProps)(Profile);