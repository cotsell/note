/*
  props
  newMode: 새로운 서브젝트 입력 받는 모드인지 아닌지 구분.
  projectId: newMode일때만.
  subject: newMode 아닐때만.
  goToItemFunc:
  itemDelMode: 아이템 아티클의 딜리트 모드.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './subjectArticle.scss';
import { decode } from 'jsonwebtoken';

import * as network from '../../service/network';
import { addList as addItemList, changeState as changeItemState } from '../../service/redux/reducers/itemList';
import { addSubjState, reset as resetSubjMenu, modifySubjMenu, addItem, removeItem, removeAllItem, toggleSubjModal, toggleItemModal, closeAllSubjMenu, toggleItemChoiceMode } from '../../service/redux/reducers/subjectPage';

import MiniMenu from './miniMenu/miniMenu';

class SubjectArticle extends Component {

  constructor(props) {
    super(props);
    this.addNewSubjectStateToRedux();
  }

  state = {
    editable: false,
    itemChoiceMode: false,
  };

  // 서브젝트 모달 열기.
  toggleSubjModal = (event) => {
    if (event) { event.stopPropagation(); }

    this.props.toggleSubjModal({
      show: true,
      mode: 'new',
      projHisId: this.props.projectId }
    );
  };

  // 아이템 모달 열기.
  changeNewItemModalState = (event) => {
    if (event) { event.stopPropagation(); }

    this.props.toggleItemModal({
      show: true,
      projHisId: this.props.subject.parentId,
      subjHisId: this.props.subject.historyId,
      title: '',
      private: true,
    });
  }

  // -----------------------------------------------------------
  // ---- Subject Menu 관련 함수 시작
  openSubjMenu = (event) => {
    if (event) { event.stopPropagation(); }

    // 모든 메뉴를 닫기 전에, 해당 메뉴의 상태를 미리 챙겨놔요.
    // 그래야, 모든 메뉴를 닫고나서, 해당 메뉴를 열것인지 닫을 것인지를
    // 알 수 있어요.
    const show = this.props.subjectPage.eachArticleState.find(value => {
      return value.id === this.props.subject.historyId;
    }).menu.show;

    this.props.closeAllSubjMenu();

    if (show) {
      this.props.removeAllItem();
      this.props.toggleItemChoiceMode({ id: this.props.subject.historyId, itemChoiceMode: false });
    }

    this.props.modifySubjMenu({
      id: this.props.subject.historyId,
      show: !show,
      mode: 'subject'
    });
  }
  // ---- Subject Menu 관련 함수 끝
  // -----------------------------------------------------------

  // 사용자가 선택한 아이템을 보러 이동해요.
  goToItemDetail = (itemId) => {
    return (event) => {
      if (event) { event.stopPropagation(); }

      const historyId = itemId;
      this.props.goToItemFunc(`/itemDetail/${historyId}`);
    };
  }

  // 해당 서브젝트의 아이템 리스트를 가져와요.
  // 아이템의 모든 정보를 가져오지는 않고, historyId와 title정도만 가져와요.
  getItemListFromServ = () => {
    const accessToken = this.props.account.accessToken;
    const subjHisId = this.props.subject.historyId;

    this.props.changeItemState('pending');

    network.Item.getItemTitleList(accessToken, subjHisId)
    .then(result => {
      if (result.data.result) {
        // console.log(result.data.payload);
        this.props.addItemList(result.data.payload);
      }
      else {
        console.error(result.data.msg);
      }
    });
  };

  stopPropagation = (event) => {
    if (event) { event.stopPropagation(); }
  };

  // 수정권한을 결정해요.
  setEditable = () => {
    if (this.props.subject && this.props.account.loggedIn) {
      const userId = decode(this.props.account.accessToken)['userId'];
      if (this.props.subject.writerId === userId) {
        this.setState({ editable: true })
      }
    }
  }

  // 각각의 Subject Atricle이 생성될 때, 메뉴 관리를 리덕스로 하기 위해서,
  // 리덕스에 Subject의 HistoryId를 기준으로 값을 생성해요.
  addNewSubjectStateToRedux = () => {
    if (this.props.subject && !this.props.newMode) {
      this.props.addSubjState(this.props.subject.historyId);
    }
  }

  // 아이템 선택 모드에서 아이템에 체크박스를 누르면 subjectPage의 itemList에
  // 아이템을 넣거나 뺍니다.
  addCheckedItem = (subjHisId) => {
    return (event) => {
      if (event) { event.stopPropagation(); }

      if (event.target.checked) {
        this.props.addItem(subjHisId);
      }
      else {
        this.props.removeItem(subjHisId);
      }
    }
  }

  componentDidMount() {
    this.setEditable();
    if (!this.props.newMode && this.props.itemList.reduxState === 'none') {
      this.getItemListFromServ();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // -----------------------------------------------------------
    // ---- 정리용도 함수 모음 시작
    const setItemChoiceMode = () => {
      // itemChoiceMode를 state로 이동.
      const subject = nextProps.subjectPage.eachArticleState.find(value => {
        const subjId = nextProps.subject.historyId;
        return value.id === subjId ? true : false;
      });
      // 아직 해당 서브젝트의 상태가 업데이트되지 않았을 수도 있다.
      if (subject !== undefined && prevState.itemChoiceMode !== subject.itemChoiceMode) {
        // console.error(`getDerivedStateFromProps()`);
        // return { itemChoiceMode: subject.itemChoiceMode };
        return Object.assign({}, state, { itemChoiceMode: subject.itemChoiceMode });
      }
      else {
        return null;
      }
    }
    // ---- 정리용도 함수 모음 끝
    // -----------------------------------------------------------


    let state = undefined;

    if (!nextProps.newMode) {
      state = setItemChoiceMode();
    }

    return state === undefined ? null : state;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevState.itemChoiceMode !== this.state.itemChoiceMode) {
    //   console.log(this.state);
    // }
  }

  componentWillUnmount() {
    this.props.resetSubjMenu();
  }

  render() {
    let modeEle = (<div></div>);

    // 아이템을 각 서브젝트와 비교해서 필터링 해줘요.
    const makingItemArticleEle = () => {
      let itemArticleEle;

      if (this.props.subject) {
        // 서브젝트와 관련된 아이템 거르기.
        const tempList = this.props.itemList.list.filter(item => {
          return item.subjectId === this.props.subject.historyId ? true : false;
        });

        // 필터링...
        let filted;
        if (this.props.subjectPage.filter.value !== '') {
          filted = tempList.filter(value => {
            const result = value.title.indexOf(this.props.subjectPage.filter.value);
            return result !== -1 ? true : false;
          })
        }
        else {
          filted = tempList;
        }

        if (this.state.itemChoiceMode) {
          itemArticleEle = filted.map(item => {
            return (
              <div id={css.choiceItemTitle}
                key={item.historyId}
                >
                <div>
                  <input type="checkbox" onChange={this.addCheckedItem(item.historyId)}/>
                </div>
                <div>
                  {item.title}
                </div>
              </div>
            );
          });
        }
        else {
          itemArticleEle = filted.map(item => {
            return (
              <div id={css.itemTitle}
                key={item.historyId}
                onClick={this.goToItemDetail(item.historyId)}
                >
                {item.title}
              </div>
            );
          });
        }
      }

      return itemArticleEle;
    }

    // 새로운 아이템 입력 화면을 보여줄지 결정.
    const newItemArticle = () => {
      let element;

      if (this.state.editable) {
        element = (
          <div id={css.newItemTitle}
            onClick={this.changeNewItemModalState}
            >
            click me to make new item.
          </div>
        );
      }

      return element;
    }

    const showMiniMenu = () => {
      if (this.state.editable) {
        return (
          <div id={css.menuDiv}
            onClick={this.openSubjMenu}
            >
            <i className={'material-icons'}>menu</i>
          </div>
        );
      }
      else {
        return ;
      }
    }

    // New Mode or Normal Mode
    if (this.props.newMode) {
      modeEle = (
        <div id={css.background}>
          <div id={css.newTitle}
            onClick={this.toggleSubjModal}
            >
            click me to make new subject.
          </div>
        </div>
      );
    } else {
      modeEle = (
        <div id={css.background}>

          <div id={css.titleDiv}>
            <div id={css.title}>
              {this.props.subject.title}
            </div>

            <div id={css.option}>
              { showMiniMenu() }
            </div>
          </div>

          {/* { showMiniMenu() } */}
          <MiniMenu
            subjId={this.props.subject.historyId}
            />

          {/* Item Articles */}
          <div id={css.itemContainer}>
            {makingItemArticleEle()}
            {newItemArticle()}
          </div>

        </div>
      );
    }

    return (
      <div>
        {modeEle}
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    account: state.account,
    itemList: state.itemList,
    subjectPage: state.subjectPage,
  }
}

const dispatchToProps = (dispatch) => {
  return {
    addItemList: (value) => { dispatch(addItemList(value)) },
    changeItemState: (value) => { dispatch(changeItemState(value)) },
    resetSubjMenu: () => { dispatch(resetSubjMenu()) },
    addSubjState: (subjectId) => { dispatch(addSubjState(subjectId)) },
    modifySubjMenu: (object) => { dispatch(modifySubjMenu(object)) },
    addItem: (itemId) => { dispatch(addItem(itemId)) },
    removeItem: (itemId) => { dispatch(removeItem(itemId)) },
    removeAllItem: () => { dispatch(removeAllItem()) },
    toggleSubjModal: (value) => { dispatch(toggleSubjModal(value)) },
    toggleItemModal: (value) => { dispatch(toggleItemModal(value)) },
    closeAllSubjMenu: () => { dispatch(closeAllSubjMenu()) },
    toggleItemChoiceMode: (value) => { dispatch(toggleItemChoiceMode(value)) },
  }
}

SubjectArticle.defaultProps = {
  newMode: false,
  projectId: undefined,
  subject: undefined,
  goToItemFunc:undefined,
  itemChoiceMode: false,
}

export default connect(stateToProps, dispatchToProps)(SubjectArticle);