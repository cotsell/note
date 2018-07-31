/* 
  showModal: true, false. on, off
  changeModalState: 종료 함수.
  projHisId
  subjHisId
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as network from '../../service/network';
import css from './newItemModal.scss';
import { add } from '../../service/redux/reducers/itemList';

class NewItemModal extends Component {
  state = { 
    showModal: false,
    subjHisId: undefined,
    titleValue: '',
  };

  sendNewItem = (event) => {
    const accessToken = this.props.account.accessToken;
    const item = {
      title: this.state.titleValue,
      private: true,
      projectId: this.props.projHisId,
      subjectId: this.props.subjHisId
    };

    network.Item.sendNewItem(accessToken, item)
    .then(result => {
      if (result.data.result) {
        console.log(result.data.payload);
        this.closeModal(undefined);
        this.props.addNewItem(result.data.payload);
      } else {
        console.error(result.data.msg);
      }
    });
  };

  changeTitleValue = (event) => {
    this.setState({ titleValue: event.target.value });
  };

  closeModal = (event) => {
    if (event) { event.stopPropagation(); }

    this.props.changeModalState(event);
  }

  stopPropagation = (event) => {
    if (event) { event.stopPropagation(); }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = null;
    if (nextProps.showModal) {
      state = { showModal: nextProps.showModal, subjHisId: nextProps.subjHisId };
    } else {
      state = { showModal: nextProps.showModal, subjHisId: undefined };
    }

    return state;
  }

  render() {
    const sw = this.state.showModal;

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
              value={this.state.titleValue}
              onChange={this.changeTitleValue}
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
  }
};

const dispatchToProps = (dispatch) => {
  return {
    addNewItem: (value) => { dispatch(add(value)); }
  };
}
export default connect(stateToProps, dispatchToProps)(NewItemModal);