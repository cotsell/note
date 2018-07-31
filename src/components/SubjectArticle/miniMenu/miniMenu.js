import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './miniMenu.scss';

import { toggleSubjModal, modifySubjMenu, toggleItemChoiceMode, removeAllItem } from '../../../service/redux/reducers/subjectPage';
import { deleteItems } from '../../../service/redux/reducers/itemList';
import * as network from '../../../service/network';

class MiniMenu extends Component {

  state = {
    id: undefined,
    show: false,
    mode: undefined,
  }

  closeMiniMenu = () => {
    this.props.modifySubjMenu({
      id: this.props.subjId,
      show: false,
      mode: 'subject'
    });
  };

  toggleModifySubjModal = (event) => {
    if (event) { event.stopPropagation(); }

    this.closeMiniMenu();

    this.props.toggleSubjModal({
      show: true,
      mode: 'modify',
      subjHisId: this.props.subjId,
    });
  }

  toggleDeleteSubjModal = (event) => {
    if (event) { event.stopPropagation(); }

    this.closeMiniMenu();

    this.props.toggleSubjModal({
      show: true,
      mode: 'delete',
      subjHisId: this.props.subjId,
    });
  };

  toggleItemMode = (event) => {
    if (event) { event.stopPropagation(); }

    this.props.modifySubjMenu({ id: this.props.subjId, show: true, mode: 'item' });
    this.props.toggleItemChoiceMode({ id: this.props.subjId, itemChoiceMode: true });
  };

  // subjectPage의 itemList를 모두 비워요.
  removeAllItem = (event) => {
    if (event) { event.stopPropagation(); }

    this.props.removeAllItem();
    this.props.toggleItemChoiceMode({
      id: this.props.subjId,
      itemChoiceMode: false
    });
    this.props.modifySubjMenu({
      id: this.props.subjId,
      show: true,
      mode: 'subject'
    });
  }

  deleteItems = (event) => {
    if (event) { event.stopPropagation(); }

    const accessToken = this.props.account.accessToken;
    const items = this.props.subjectPage.itemList;

    network.Item.deleteItems(accessToken, items)
    .then(result => {
      if (result.data.result) {
        console.log(result.data.payload);
        this.removeAllItem();
        this.props.deleteItemsInItemList(items);
      }
      else {
        console.error(result.data.msg);
      }
    });
  }

  componentDidMount() {
  }

  // 이 메뉴의 상태를 리덕스에서 가져와서 state에 넣어요.
  // 리덕스에는 상태들이 array화 되어 있기 때문에, SubjectArticle로부터 받은
  // subjId로 비교해서 해당 상태를 찾아내요.
  static getDerivedStateFromProps(nextProps, prevState) {
    const menu = nextProps.subjectPage.eachArticleState.find(value => {
      return value.id === nextProps.subjId;
    });

    if (menu !== undefined &&
        (menu.menu.show !== prevState.show || menu.menu.mode !== prevState.mode)) {
      return { show: menu.menu.show, mode: menu.menu.mode };
    }

    return null;
  }

  componentDidUpdate(nextProps, prevState, snapshot) {
    // console.log(this.state);
  }

  render() {
    // console.log(`render(): ${this.props.subjId}`);
    const makingMenu = () => {
      // 미니메뉴가 서브젝트 모드일 때.
      if (this.state.mode === 'subject') {
        return (
          <div id={css.subject}>
            <div className={css.article}
              onClick={this.toggleModifySubjModal}
              >
              <div id={css.icon}>
                <i className="material-icons">create</i>
              </div>
              <div>
                서브젝트 수정
              </div>
            </div>
            <div className={css.article}
              onClick={this.toggleDeleteSubjModal}
              >
              <div id={css.icon}>
                <i className="material-icons">delete</i>
              </div>
              <div>
                서브젝트 삭제
              </div>
            </div>
            <div className={css.article}
              onClick={this.toggleItemMode}
              >
              <div id={css.icon}>
                <i className="material-icons">delete</i>
              </div>
              <div>
                아이템 선택
              </div>
            </div>
          </div>
        );
      }
      // 미니메뉴가 아이템 모드일 때. 일단 기능상 쓰이지 않을 듯 하다.
      else if (this.state.mode === 'item') {
        return (
          <div id={css.item}>
            <div className={css.article}
              onClick={this.deleteItems}
              >
              <div id={css.icon}>
                <i className="material-icons">delete</i>
              </div>
              <div>
                아이템 삭제
              </div>
            </div>
            <div className={css.article}
              onClick={this.removeAllItem}
              >
              <div id={css.icon}>
                <i className="material-icons">close</i>
              </div>
              <div>
                선택 취소
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div id={css.background}
        className={this.state.show ? css.show : css.hide}
        >
        {makingMenu()}
      </div>
    );
  }
}

MiniMenu.defaultProps = {
  subjId: undefined,
}

const stateToProps = (state) => {
  return {
    account: state.account,
    subjectPage: state.subjectPage,
  };
}

const dispatchToProps = (dispatch) => {
  return {
    toggleSubjModal: (value) => { dispatch(toggleSubjModal(value)); },
    modifySubjMenu: (value) => { dispatch(modifySubjMenu(value)); },
    toggleItemChoiceMode: (value) => { dispatch(toggleItemChoiceMode(value)); },
    removeAllItem: () => { dispatch(removeAllItem()); },
    deleteItemsInItemList: (value) => { dispatch(deleteItems(value)); },
  };
}

export default connect(stateToProps, dispatchToProps)(MiniMenu);