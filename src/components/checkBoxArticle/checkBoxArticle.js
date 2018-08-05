import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './checkBoxArticle.scss';

// Reducers..
import { modifyCheckOne, deleteCheckOne } from '../../service/redux/reducers/itemDetail';

// Service..
import * as network from '../../service/network';

class CheckBoxArticle extends Component {
  state = {
    pending: false, // 처리중 모달 화면에 표시 여부.
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

  // 체크박스 삭제.
  deleteCheckBox = (event) => {
    console.error(`체크박스 삭제하기.`);
    event.stopPropagation();

    if (this.props.account.reduxState === 'done' &&
        this.props.account.loggedIn === true) {
        // 서버에서는 성공시 결과값을 돌려주지 않으므로, 이렇게 처리..
      this.setState({ pending: true });

      const accessToken = this.props.account.accessToken;
      const itemHisId = this.props.itemHisId;
      const checkBoxId = this.props.checkBoxData._id;

      network.Item.deleteCheckBox(accessToken, itemHisId, checkBoxId)
      .then(result => {
        if (result.data.result) {
          // console.log(result.data.msg);
          this.props.deleteCheckOne(checkBoxId);
        }
        else {
          console.error(result.data.msg);
        }

        // setState가 실행되기 전에, 타이밍상 리덕스에서 항목을 삭제했을 가능성이 높다.
        // 높은 확률로 실행되지 않고 오류가 발생하기 때문에 주석처리.
        // this.setState({ pending: false });
      });
    }
  };

  render() {
    return (
      <div id={css.containerDiv}>
        <div id={css.backgroundDiv}>
          <div id={css.checkBox}
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

          {/* X버튼 */}
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
    deleteCheckOne: (checkBoxId) => { dispatch(deleteCheckOne(checkBoxId)) },
  };
};

CheckBoxArticle.defaultProps = {
  checkBoxData: undefined,
  itemHisId: '',
};

export default connect(stateToProps, dispatchToProps)(CheckBoxArticle);