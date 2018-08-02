import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './checkBoxArticle.scss';

// Reducers..
import { modifyCheckOne } from '../../service/redux/reducers/itemDetail';

// Service..
import * as network from '../../service/network';

class CheckBoxArticle extends Component {
  state = {
    pending: false,
  }; 

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  // 체크박스의 체크 상태를 변경해요.
  changeCheckState = (event) => {
    event.stopPropagation();

    if (this.props.account.reduxState === 'done' &&
        this.props.account.loggedIn === true) {
        // TODO 문서 작성자와 로그인 사용자의 아이디가 동일 한지 예외 처리.
      this.setState({ pending: true });

      const accessToken = this.props.account.accessToken;
      const itemHisId = this.props.itemHisId;
      const checkBoxId = this.props.checkBoxData._id;
  
      network.Item.changeCheckState(accessToken, itemHisId, checkBoxId)
      .then(result => {
        if (result.data.result) {
          // 서버에서는 성공시 결과값을 돌려주지 않으므로, 이렇게 처리..
          const checked = !this.props.checkBoxData.checked;
          this.props.modifyCheckOne({ _id: checkBoxId, checked: checked });
        }
        else {
          console.error(result.data.msg);
        }

        this.setState({ pending: false }); // 처리 중 모달 화면에서 제거.
      });
    }
    else {
      console.error(`로그인이 필요하거나, 글 작성자만 변경이 가능해요.`);
    }

  };

  deleteCheckBox = (event) => {
    console.error(`체크박스 삭제하기.`);
  };

  render() {
    return (
      <div id={css.containerDiv}>
        <div id={css.backgroundDiv}>
          <div
            onClick={this.changeCheckState}
            >
            <i className="material-icons">
              {this.props.checkBoxData.checked ? 'check' : 'check_box_outline_blank'}
            </i>  
            {/* <input 
              type="checkbox" 
              checked={props.checkBoxData.checked}
              onClick={changeCheckState}
              /> */}
          </div>
          <div id={css.title}
            className={this.props.checkBoxData.checked ? css.completeArticle : ''}
            >
            {this.props.checkBoxData.title}
          </div>
          <div id={css.icon}
            onClick={this.deleteCheckBox}
            >
            <i className="material-icons">close</i>
          </div>
        </div>
  
        {/* PendingModal */}
        <div id={css.pendingModal} 
          className={this.state.pending ? css.pmShow : css.pmHide}
          onClick={this.stopPropagation}
          >
          <div id={css.msg}>
            <i className="material-icons">sync</i> 적용 중 이에요..
          </div>
        </div>
      </div>
    );
  };
}

const stateToProps = (state) => {
  return {
    account: state.account,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    modifyCheckOne: (value) => { dispatch(modifyCheckOne(value)) },
  };
};

CheckBoxArticle.defaultProps = {
  checkBoxData: undefined,
  itemHisId: '',
};

export default connect(stateToProps, dispatchToProps)(CheckBoxArticle);