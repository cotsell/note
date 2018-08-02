import React, { Component } from 'react';
import { connect } from 'react-redux';
import { decode } from 'jsonwebtoken';
import * as network from '../../service/network';
import css from './itemDetail.scss';
import marked from 'marked';
import prism from 'prismjs';

// Reducers..
import { set as toolbarSetState } from '../../service/redux/reducers/toolbar';
import { insert, deleteAll, changeState } from '../../service/redux/reducers/itemDetail';

// Components..
import Tag from '../../components/Tag/tag';
import CheckBoxList from '../../components/checkBoxList/checkBoxList';

class ItemDetail extends Component {
  state = {
    item: undefined,
    itemState: 'none',
    editable: false,
    textEditMode: false,
    tempTextValue: '',
    tempTitleValue: '',
  };

  // -----------------------------------------------------------
  // ---- TagList 관련 함수 시작
  isWriter = () => {
    const item = this.state.item;
    const loggedIn = this.props.account.loggedIn;

    if (loggedIn && item !== undefined) {
      const writerId = this.state.item.writerId;
      const userId = decode(this.props.account.accessToken)['userId'];

      return writerId === userId ? true : false;
    } else {
      return false;
    }
  }

  sendNewTag = (tag) => {
    if (this.isWriter()) {
      const accessToken = this.props.account.accessToken;
      const itemHisId = this.state.item.historyId;

      network.Item.sendNewTag(accessToken, itemHisId, tag)
      .then(result => {
        if (result.data.result) {
          this.setState({ item: Object.assign(
            {},
            this.state.item,
            { tagList: [
              ...this.state.item.tagList,
              tag
            ] })
          });
        } else {
          console.error(result.data.msg);
        }
      });
    } else {
      alert(`문서 작성자만 태그를 추가할 수 있어요.`);
    }
  }

  deleteTag = (tag) => {
    // console.log(`deleteTag: ${tag}`);
    if (this.isWriter()) {
      const accessToken = this.props.account.accessToken;
      const itemHisId = this.state.item.historyId;

      network.Item.deleteTag(accessToken, itemHisId, tag)
      .then(result => {
        if (result.data.result) {
          const changedTagList = this.state.item.tagList.filter(value => {
            return value === tag ? false : true;
          });

          this.setState({ item: Object.assign(
            {},
            this.state.item,
            { tagList: changedTagList })
          });
        } else {
          console.error(result.data.msg);
        }
      });
    } else {
      alert(`문서 작성자만 태그를 추가할 수 있어요.`);
    }
  }
  // ---- TagList 관련 함수 끝
  // -----------------------------------------------------------

  sendModifiedText = (event) => {
    if (event) { event.stopPropagation(); }

    let item = this.state.item;
    item.title = this.state.tempTitleValue;
    item.text = this.state.tempTextValue;

    const accessToken = this.props.account.accessToken;
    network.Item.modifyItem(accessToken, item)
    .then(result => {
      if (result.data.result) {
        // TODO 성공.
        // console.log(result.data.payload);
        this.setState({ item: result.data.payload,
                        itemState: 'done',
                        textEditMode: false,
                        editable: this.checkEditable(),
                      });
      } else {
        // TODO 실패.
        console.error(result.data.msg);
      }
    });
  }

  changeDateToLocale = (date) => {
    const now = new Date(date);
    return now.toLocaleString();
  };

  changeTextEditMode = (event) => {
    if (event) { event.stopPropagation(); }

    let condition;
    if (!this.state.textEditMode) {
      condition = { textEditMode: true,
                    tempTextValue: this.state.item.text,
                    tempTitleValue: this.state.item.title,
                    editable: false,
                  };
    }
    else {
      condition = { textEditMode: false,
                    tempTextValue: '',
                    tempTitleValue: '',
                    editable: this.checkEditable(),
                  };
    }
    this.setState(condition);
  };

  // 현재 문서를 수정할 권한이 있는지 체크해서 알려줘요.
  // item에 값을 넣으면 그 값을 기준으로 체크,
  // 넣지 않으면, this.state의 item을 기준으로 체크해요.
  checkEditable = () => {
    let item = this.state.item;

    if (item !== undefined &&
        item.writerId !== undefined &&
        this.props.account.loggedIn &&
        this.props.account.accessToken !== undefined) {
      const userId = decode(this.props.account.accessToken)['userId'];
      return userId === item.writerId ? true : false;
    }
    return false;
  };

  changeTempTextValue = (event) => {
    this.setState({ tempTextValue: event.target.value });
  };

  changeTempTitleValue = (event) => {
    this.setState({ tempTitleValue: event.target.value });
  };

  // 아이템의 텍스트(마크다운)을 HTML 형태로 변환해요.
  // HTML태그지만, react의 {}로는 일반 스트링처럼 출력되기 때문에,
  // dangerouslySetInnerHTML을 이용해서 출력시켜줘야 해요.
  markedText = () => {
    if (this.state.item) {
      return marked(this.state.item.text);
    }
  }

  async getSubject(accessToken, subjHisId) {
    // 툴바를 위해서 필요, projectId를 알기 위해서도 필요.
    return await network.Subject.getSubjectOne(accessToken, subjHisId)
  }

  async getItemDetail(accessToken, historyId) {
    return await network.Item.getItemDetail(accessToken, historyId);
  }

  async firstSetting() {
    // -----------------------------------------------------------
    // ---- 정리용도 함수 모음 시작
    const getSubject = async () => {
      const subjHisId = itemResult.data.payload.subjectId;
      const subjResult = await this.getSubject(accessToken, subjHisId);
      let toolbarOpt = {};

      if (subjResult.data.result) {
        toolbarOpt = {
          title: subjResult.data.payload.title,
          mode: 'itemDetail',
          parentUrl: `/subjectList/${subjResult.data.payload.parentId}`,
          showBackButton: true,
        };

      } else {
        toolbarOpt = {
          title: '',
          mode: 'itemDetail',
          parentUrl: '',
          showBackButton: false,
        };
      }

      this.props.toolbarSetState(toolbarOpt);
    };
    // ---- 정리용도 함수 모음 끝
    // -----------------------------------------------------------

    const historyId = this.props.match.params.itemHisId;
    const accessToken = this.props.account.accessToken;

    const itemResult = await this.getItemDetail(accessToken, historyId);
    if (itemResult.data.result) {
      // console.log(itemResult.data);
      const item = itemResult.data.payload;
      // let stateOpt = { item: item };
      let stateOpt = {};


      // 수정 권한 설정.
      if (this.props.account.loggedIn) {
        const userId = decode(accessToken)['userId'];
        stateOpt.editable = item.writerId === userId ? true : false;
      }

      this.setState(stateOpt);
      this.props.insertItem(item);
      getSubject();

    }
    else {
      if (itemResult.data.code === 14) {
        // 검색 결과 없음 오류.
      }
      if (itemResult.data.code === 15) {
        // 비공개 문서라 거절.
      }
      console.error(itemResult.data.msg);
    }
  }

  componentDidMount() {
    this.firstSetting();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // this.markedText();
    prism.highlightAll();
    console.log(this.state);
  }

  componentWillUnmount() {
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    if (nextProps.itemDetail.reduxState === 'changed') {
      nextProps.changeState('done');
      return { item: nextProps.itemDetail.itemDetail };
    }
    else {
      return null;
    }
  }

  render() {
    // console.log(`render()`);
    let titleEle;

    // 타이틀 관련
    if (this.state.textEditMode) {
      titleEle = (
        <div id={css.titleEditDiv}>
          <input
            type="text"
            value={this.state.tempTitleValue}
            onChange={this.changeTempTitleValue}
            />
        </div>
      );
    } else {
      titleEle = (
        <div id={css.titleDiv}>
          {this.state.item ? this.state.item.title : ''}
        </div>
      );
    }

    // 본문 관련
    const makingTextElement = () => {
      if (this.state.textEditMode) {
        // textEle = (
        return (
          <div id={css.textEditDiv}>
            <div >
              <textarea
                value={this.state.tempTextValue}
                onChange={this.changeTempTextValue}
                ></textarea>
            </div>
            <div id={css.buttons}>
              <button
                type="reset"
                onClick={this.changeTextEditMode}
                >
                취소하기
              </button>
              <button
                type="button"
                onClick={this.sendModifiedText}
                >
                저장하기
              </button>
            </div>
          </div>
        );
      }
      else {
        // textEle = (
        return (
          <div id={css.textDiv}
            dangerouslySetInnerHTML={ {__html: this.state.item ? this.markedText() : ''} }
            >
          </div>
        );
      }

    }

    // 체크박스 리스트 컴포넌트 출력 여부
    const makingCheckBoxList = () => {
      if (this.state.item === undefined) {
        return ;
      }
      else {
        return (
          <CheckBoxList
            itemHisId={this.state.item.historyId}
            checkBoxList={this.state.item.checkBoxList}
            />
        );
      }
    }

    return (
      <div id={css.background}>
        <div id={css.mainDiv}>

          {titleEle}

          <div id={css.timeAndButton}>
            <div id={css.time}>
              {this.state.item ? this.changeDateToLocale(this.state.item.updatedTime) : ''}
            </div>
            <div id={css.modifyButton}>
              <button
                className={this.state.editable ? css.show : css.hide}
                type="button"
                onClick={this.changeTextEditMode}
                >
                수정하기
              </button>
            </div>
          </div>

          {makingTextElement()}

          <div id={css.checkBoxListDiv}>
            <div></div>
            <div id={css.title}>Checkbox List</div>
            { makingCheckBoxList() }
          </div>

          <div id={css.tagListDiv}>
            <div id={css.title}>Tag List</div>
            <Tag
              tagList={this.state.item ? this.state.item.tagList : []}
              newFunc={this.sendNewTag}
              deleteFunc={this.deleteTag}
              />
          </div>

        </div>
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    account: state.account,
    toolbar: state.toolbar,
    itemDetail: state.itemDetail,
  };
}

const dispatchToProps = (dispatch) => {
  return {
    toolbarSetState: (value) => { dispatch(toolbarSetState(value)) },
    insertItem: (value) => { dispatch(insert(value)) },
    deleteItem: () => { dispatch(deleteAll()) },
    changeState: (value) => { dispatch(changeState(value)) },
  };
}

export default connect(stateToProps, dispatchToProps)(ItemDetail);