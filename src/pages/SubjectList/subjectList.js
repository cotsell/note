import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './subjectList.scss';
import { decode } from 'jsonwebtoken';

import { insertAll, modifyState as modifySubjState, deleteAll as subjDeleteAll } from '../../service/redux/reducers/subjectList';
import { setFilter } from '../../service/redux/reducers/subjectPage';
import { set as setToolbar } from '../../service/redux/reducers/toolbar';
import * as network from '../../service/network';

import SubjectArticle from '../../components/SubjectArticle/subjectArticle';
import SubjectModal from '../../components/modals/subjectModal/subjectModal';
import ItemModal from '../../components/modals/itemModal/itemModal';

class SubjectList extends Component {
  state = {
    subjectList: [],
    editable: false,
    project: {}, // 툴바에 이용될 프로젝트 정보.
  };

  // -----------------------------------------------------------
  // ---- Subject Article Component에게 넘겨줄 함수.
  goToItem = (itemId) => {
    // this.props.history.replace(itemId);
    this.props.history.push(itemId);
  }
  // ---- subject Article Component에게 넘겨줄 함수 끝
  // -----------------------------------------------------------

  // 해당 서브젝트의 프로젝트 데이터를 가져와요.
  // 프로젝트 데이터는, 서브젝트 요청자가 수정 권한이 있는지와 툴바의 부가 기능을
  // 지원하는데 사용돼요.
  async getProjectOne(accessToken, projHisId) {
    return await network.Project.getProjectOne(accessToken, projHisId);
  };

  // 서브젝트 리스트를 가져와요.
  // 서브젝트에 해당하는 아이템의 정보는 안가져와요.
  getSubjectList = (accessToken, projHisId) => {
    this.props.modifySubjState('pending');

    network.Subject.getSubjectList(accessToken, projHisId)
    .then(result => {
      if (result.data.result) {
        this.props.insertSubjectList(result.data.payload);
      } 
      else {
        console.error(result.data.msg);
        this.props.modifySubjState('done');
      }
    });
  };

  async firstSetting() {
    const projHisId = this.props.match.params.projHisId;
    const accessToken = this.props.account.accessToken;
    let stateOpt = {};
    let toolbarOpt = {};
    
    const projResult = await this.getProjectOne(accessToken, projHisId);

    if (projResult.data.result) {
      stateOpt.project = projResult.data.payload;

      // 타이틀바의 네비게이션에 데이터 갱신
      toolbarOpt = {
        title: projResult.data.payload.title,
        mode: 'subject',
        parentUrl: `/projectList/${projResult.data.payload.writerId}`,
        showBackButton: true,
      };

      if (this.props.account.loggedIn) {
        const userId = decode(accessToken)['userId'];
        
        // 가져온 프로젝트의 writerId를 비교해서, 새로운 글이나, 수정 권한을 부여해요.
        if (stateOpt.project.writerId === userId) {
          stateOpt.editable = true;
        }
      } 
    } 
    else {
      // if (projResult.data.code === 13) {
      //   alert(`projResult.data.msg`);
      // }

      console.error(projResult.data.msg);

      stateOpt.editable = false;

      toolbarOpt = {
        title: '',
        mode: 'subject',
        parentUrl: '',
        showBackButton: false,
      };

    }
    
    this.props.setToolbar(toolbarOpt);
    this.setState(stateOpt);

    this.getSubjectList(accessToken, projHisId);
  }

  // Filter입력할때 값을 state에 입력해주는 함수.
  changeFilterValue = (event) => {
    this.props.setFilter({ value: event.target.value });
  }

  componentDidMount() {
    this.firstSetting().then();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let something = undefined;

    if (nextProps.subjectList.reduxState === 'done' &&
        nextProps.subjectList.list.length > 0 &&
        nextProps.subjectList.list.length !== prevState.subjectList.length) {
      something = Object.assign({}, something, { subjectList: nextProps.subjectList.list });
    }
    // else if () {

    // }

    return something === undefined ? null : something;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(this.state);
  }

  componentWillUnmount() {
    this.props.subjDeleteAll();
  }

  render() {
    // console.log(`render()`);
    let newSubject;
    // const subjectList = this.props.subjectList.list.map(value => {
    const subjectList = this.state.subjectList.map(value => {
      return (
        <SubjectArticle
          key={value._id}
          newMode={false}
          subject={value}
          goToItemFunc={this.goToItem}
          />
      );
    });

    // 새로운 서브젝트 생성 표기. 수정 권한이 있을때만 
    if (this.state.editable) {
      newSubject = (
        <SubjectArticle
          key="new"
          newMode={true}
          projectId={this.props.match.params.projHisId}
          />
      );
    }

    // 필터 관련.
    const filter = () => {
      let ele = (
        <div id={css.filterDiv}
          className={this.props.subjectPage.filter.show ? 
            css.showFilter : css.hideFilter}
          >
          <div>
            <input type="text" 
              placeholder="filter" 
              onChange={this.changeFilterValue}
              value={this.state.filterValue}
              />
          </div>
        </div>
      );

      return ele;
    }

    return (
      <div id={css.background}>

        {filter()}
        
        <div id={css.listDiv}>
          {subjectList}
          {newSubject}
          <SubjectModal />
          <ItemModal />
        </div>
      </div>
    );
  }
}

const stateToProps = (state) => (
  {
    account: state.account,
    projectList: state.projectList,
    subjectList: state.subjectList,
    subjectPage: state.subjectPage,
  }
);

const dispatchToProps = (dispatch) => (
  {
    insertSubjectList: (value) => { dispatch(insertAll(value)); },
    modifySubjState: (value) => { dispatch(modifySubjState(value)); },
    subjDeleteAll: () => { dispatch(subjDeleteAll()); },
    setToolbar: (value) => { dispatch(setToolbar(value)); },
    setFilter: (value) => { dispatch(setFilter(value)); },
  }
);

SubjectList.defaultProps = {

};

export default connect(stateToProps, dispatchToProps)(SubjectList);