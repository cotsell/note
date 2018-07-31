/*
  이 컴포넌트는 props로 받아오는 외부데이터는 없어요. 전부 리덕스에서 가져옵니다.
  show: true, false. on, off
  mode: true, false.
  projHisId: 새로운 서브젝트 생성할 때 사용.
  subjHisId: 기존 서브젝트를 수정할 때 사용.
  title: 기존 서브젝트의 타이틀을 수정할 때 사용.
  private: 기존 서브젝트의 private를 수정할 때 사용.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as network from '../../../service/network';
import css from './subjectModal.scss';

import { toggleSubjModal, } from '../../../service/redux/reducers/subjectPage';
import { insert as insertNewSubj, modify as modifySubject, deleteOne as deleteSubjectOne } from '../../../service/redux/reducers/subjectList';
import { deleteAllWithSubjId as deleteAllItemList } from '../../../service/redux/reducers/itemList';

class SubjectModal extends Component {

  state = {
    show: false,
    mode: 'new',
    projHisId: undefined,
    subjHisId: undefined,
    title: '',
    private: true,
  };

  changeTitle = (event) => {
    this.setState({ title: event.target.value });
  };

  // 모달을 닫아요.
  closeModal = (event) => {
    if (event) { event.stopPropagation(); }

    // SubjectPage의 subjectModal 초기화.
    this.props.toggleSubjModal( { 
      show: false, 
      mode: 'new', 
      subjHisId: '', 
      projHisId: '',
      title: '',
      private: true, 
    } );
  }

  stopPropagation = (event) => {
    if (event) { event.stopPropagation(); }
  }

  // 모달을 재활용하다보니 버튼 하나로 두가지 기능을 지원하기 위해서..
  action = (event) => {
    if (event) { event.stopPropagation(); }

    this.state.mode === 'new' ?
      this.sendNewSubject(event) :
      this.modifySubject(event);
  }

  // 새로운 서브젝트를 생성해요.
  sendNewSubject = (event) => {
    const projId = this.state.projHisId;
    const accessToken = this.props.account.accessToken;
    const subject =
    {
      parentId: projId,
      title: this.state.title,
      private: this.state.private,
    };

    this.closeModal(undefined);

    network.Subject.sendNewSubject(accessToken, subject)
    .then(result => {
      if (result.data.result) {
        this.props.insertNewSubj(result.data.payload);
      } 
      else {
        console.error(result.data.msg);
      }
    });
  };

  // 서브젝트 수정.
  modifySubject = (event) => {
    const accessToken = this.props.account.accessToken;
    const subject = {
      title: this.state.title,
      private: this.state.private,
      historyId: this.state.subjHisId,
    };

    this.closeModal(undefined);

    network.Subject.modifySubject(accessToken, subject)
    .then(result => {
      if (result.data.result) {
        this.props.modifySubject(result.data.payload);
      } 
      else {
        console.error(result.data.msg);
      }
    })
  }

  // 서브젝트 삭제.
  deleteSubject = (event) => {
    if (event) { event.stopPropagation(); }

    const accessToken = this.props.account.accessToken;
    const subjHisId = this.props.subjectPage.subjectModal.subjHisId;

    this.closeModal(undefined);

    network.Subject.deleteSubject(accessToken, subjHisId)
    .then(result => {
      if (result.data.result) {
        this.props.deleteSubjectOne(subjHisId);
        this.props.deleteAllItemList(subjHisId);
      }
      else {
        console.error(result.data.msg);
      }
    });
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(`in subjectModal`);
    // console.log(this.state);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const modal = nextProps.subjectPage.subjectModal;

    // 상태가 그대로인데, 다시 랜더링 되는 경우에 무의미한 처리를 방지하기 위해..
    if (prevState.show !== modal.show) {
      if (modal.show === true) {
        if (modal.mode === 'new') {
          return modal;
        }
        else if (modal.mode === 'modify') {
          // 모달에 수정하기 위한 데이터를 세팅하기 위해 리덕스에서 찾아옵니다.
          const subject = nextProps.subjectList.list.find(value => {
            return value.historyId === modal.subjHisId;
          });

          return Object.assign(
            {},
            modal,
            { title: subject.title, private: subject.private }
          );
        }
        else if (modal.mode === 'delete') {
          // TODO Delete 모드일때 할 것.
          return modal;
        }
      }
      else {
        return modal;
      }
    }

    return null;
  }

  render() {
    const sw = this.state.show;

    const makingEachModal = () => {
      if (this.state.mode === 'new' || this.state.mode === 'modify') {
        return (
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
                onClick={this.action}
                >확인</button>
              <button
                type="reset"
                onClick={this.closeModal}
                >취소</button>
            </div>

          </div>
        );
      }
      else {
        return (
          <div id={css.modalDiv}
            onClick={this.stopPropagation}
            >

            <div id={css.icon}>
              <i className="material-icons">priority_high</i>
            </div>

            <div id={css.dltMsg}>
              서브젝트를 삭제하는게 확실한가요?
            </div>

            <div id={css.dltBtns}>
              <div>
                <button type="button"
                  onClick={this.deleteSubject}
                  >
                  확인
                </button>
              </div>
              <div>
                <button type="reset"
                  onClick={this.closeModal}>
                  취소
                </button>
              </div>
            </div>

          </div>
        );
      }
    }

    return (
      <div id={css.background}
        className={sw ? css.displayOn : css.displayOff}
        onClick={this.closeModal}
        >
        {makingEachModal()}
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    account: state.account,
    subjectPage: state.subjectPage,
    subjectList: state.subjectList,
  }
};

const dispatchToProps = (dispatch) => {
  return {
    toggleSubjModal: (value) => { dispatch(toggleSubjModal(value)); },
    insertNewSubj: (value) => { dispatch(insertNewSubj(value)); },
    modifySubject: (value) => { dispatch(modifySubject(value)); },
    deleteSubjectOne: (value) => { dispatch(deleteSubjectOne(value)); },
    deleteAllItemList: (value) => { dispatch(deleteAllItemList(value)); },
  };
}
export default connect(stateToProps, dispatchToProps)(SubjectModal);