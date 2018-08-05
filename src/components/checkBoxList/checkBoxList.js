import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './checkBoxList.scss';

// reducers..
import { insertCheckOne } from '../../service/redux/reducers/itemDetail';

// components..
import CheckBoxArticle from '../checkBoxArticle/checkBoxArticle';

// service..
import * as network from '../../service/network';

class CheckBoxList extends Component {

  state = {
    value: '',
  };

  changeInputValue = (event) => {
    this.setState({ value: event.target.value });
  };

  pressEnter = (event) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      this.sendNewCheckBox();
    }
  };

  sendNewCheckBox = () => {

    if (this.props.account.reduxState === 'done' &&
        this.props.account.loggedIn === true) {
      // TODO 아이템 작성자와 현재 로그인 유저가 같은 사람인 경우의 예외처리 추가.

      const accessToken = this.props.account.accessToken;
      const title = this.state.value;

      network.Item.sendNewCheckBox(accessToken, this.props.itemHisId, title)
      .then(result => {
        if (result.data.result) {
          this.props.insertCheckOne(result.data.payload);
          this.setState({ value: '' });
        }
        else {
          console.error(result.data.msg);
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(this.state);
  }

  render() {
    const makingCheckBoxList = () => {
      if (this.props.checkBoxList !== undefined &&
          this.props.checkBoxList.length > 0) {
        return this.props.checkBoxList.map(value => {
          return (
            <CheckBoxArticle 
              key={value._id} 
              checkBoxData={value} 
              itemHisId={this.props.itemHisId}
              />
          );
        });
      }
      else {
        return;
      }
    };

    return (
      <div id={css.backGroundDiv}>
        {/* 새로운 체크박스 입력받기. */}
        <div id={css.input}>
          <input
            type="text"
            placeholder="write down new checkbox"
            value={this.state.value}
            onChange={this.changeInputValue}
            onKeyPress={this.pressEnter}
            />
        </div>

        {/* 체크박스 리스트 출력 */}
        {makingCheckBoxList()}
      </div>
    );
  }
};

const stateToProps = (state) => {
  return {
    account: state.account,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    insertCheckOne: (checkBox) => { dispatch(insertCheckOne(checkBox)) },
  };
};

CheckBoxList.defaultProps = {
  checkBoxList: undefined,
  itemHisId: '',
};

export default connect(stateToProps, dispatchToProps)(CheckBoxList);
