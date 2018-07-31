/* 
  showModal: true, false. on, off
  changeModalState: 종료 함수.
  projHisId
  subjHisId
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as network from '../../../service/network';
import css from './itemModal.scss';
import { add } from '../../../service/redux/reducers/itemList';
import { toggleItemModal } from '../../../service/redux/reducers/subjectPage';

class ItemModal extends Component {
  state = { 
    show: false,
    subjHisId: undefined,
    projHisId: undefined,
    title: '',
    private: true,
  };

  // 작성한 새로운 아이템을 서버로 전송해요.
  sendNewItem = (event) => {
    const accessToken = this.props.account.accessToken;
    const item = {
      title: this.state.title,
      private: this.state.private,
      projectId: this.state.projHisId,
      subjectId: this.state.subjHisId
    };

    network.Item.sendNewItem(accessToken, item)
    .then(result => {
      if (result.data.result) {
        console.log(result.data.payload);
        this.closeModal(undefined);
        this.props.addNewItem(result.data.payload);
      } 
      else {
        console.error(result.data.msg);
      }
    });
  };

  // 입력되는 중인 타이틀을 state에 넣어줘요.
  changeTitle = (event) => {
    this.setState({ title: event.target.value });
  };

  // 모달을 닫아요.
  closeModal = (event) => {
    if (event) { event.stopPropagation(); }

    // this.props.changeModalState(event);
    this.props.toggleItemModal({
      show: false,
      subjHisId: '',
      projHisId: '',
      title: '',
      private: true,
    });
  }

  stopPropagation = (event) => {
    if (event) { event.stopPropagation(); }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(this.state);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const modal = nextProps.subjectPage.itemModal;

    if (prevState.show !== modal.show) {
      return modal;
    }

    return null;
  }

  render() {
    const sw = this.state.show;

    return (
      <div id={css.background}
        className={sw ? css.displayOn : css.displayOff}
        onClick={this.closeModal}
        >
        <div id={css.modalDiv}
          onClick={this.stopPropagation}
          >

          <div id={css.icon}>Icons</div>
          <div id={css.input}>
            <input
              type="text"
              placeholder="Title.."
              value={this.state.title}
              onChange={this.changeTitle}
              />
          </div>
          <div> </div>
          <div id={css.buttons}>
            <button 
              type="button"
              onClick={this.sendNewItem}
              >확인</button>
            <button
              type="reset"
              onClick={this.closeModal}
              >취소</button>
          </div>

        </div>

      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    account: state.account,
    subjectPage: state.subjectPage,
  }
};

const dispatchToProps = (dispatch) => {
  return {
    addNewItem: (value) => { dispatch(add(value)); },
    toggleItemModal: (value) => { dispatch(toggleItemModal(value)) },
  };
}
export default connect(stateToProps, dispatchToProps)(ItemModal);