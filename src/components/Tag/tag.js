/* 
  tagList: itemDetail이 갖고 있는 tagList를 전달 받아요.
  newFunc: 부모로부터 받는 함수. 새로운 태그를 추가해요.
  deleteFunc: 부모로부터 받는 함수. 태그를 삭제해요.
*/

import React, { Component } from 'react';
import css from './tag.scss';

class Tag extends Component {
  state = {
    tagValue: '',
  }

  // -----------------------------------------------------------
  // ---- 태그 전송 관련 함수 시작
  changeTagValue = (event) => {
    this.setState({ tagValue: event.target.value });
  }

  newTag = (event) => {
    if (event.charCode === 13) {
      this.props.newFunc(this.state.tagValue);
      this.setState({ tagValue: '' });
    }
  };

  makingDeleteTag = (value) => {
    return (event) => {
      if (event) { event.stopPropagation(); }
      this.props.deleteFunc(value);
    };
  }
  // ---- 태그 전송 관련 함수 끝
  // -----------------------------------------------------------

  render() {
    let tagList = <div id={css.belowDiv}></div>;
  
    // 태그 리스트 설정.
    if (this.props.tagList.length > 0) {
      tagList = this.props.tagList.map(value => {
        return (
          <div key={value} id={css.tagArticle}>
            <div>{value}</div>
            <div id={css.icon}
              onClick={this.makingDeleteTag(value)}
              >
              <i className={'material-icons'}>close</i>
            </div>
          </div>
        );
      });
    }
  
    return (
      <div id={css.background}>
        <div id={css.aboveDiv}>
          <input type="text"
            value={this.state.tagValue}
            onChange={this.changeTagValue}
            onKeyPress={this.newTag}
            placeholder="write down tag and enter"
            />
        </div>
  
        <div id={css.belowDiv}>
          {tagList}
        </div>
      </div>
    );
  }
}

Tag.defaultProps = {
  tagList: [],
  newFunc: (value) => { console.log(value); },
  deleteFunc: (value) => { console.log(value); },
}

export default Tag; 