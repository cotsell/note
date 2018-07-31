import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './projectList.scss';
import { decode } from 'jsonwebtoken';

import ProjectArticle from '../../components/ProjectArticle/projectArticle';

import * as network from '../../service/network';
import { set as accountSet } from '../../service/redux/reducers/account';
import { insertAll, insert, setState as projSetState, deleteAll } from '../../service/redux/reducers/projectList';
import { set as setToolbar } from '../../service/redux/reducers/toolbar';
import { deleteAll as deleteAllSubjList } from '../../service/redux/reducers/subjectList';
import { deleteAll as deleteAllItemList } from '../../service/redux/reducers/itemList';
import * as conf from '../../service/conf';


class ProjectList extends Component {

  state = {
    showNewProjectModal: false,
    newProjInputValue: '',
    userId: '',
    editable: false,
  }

  // -----------------------------------------------------------
  // ---- New Project Modal Start
  changeNewProjModalState = (event) => {
    event.stopPropagation();

    this.setState({ showNewProjectModal: !this.state.showNewProjectModal });
  };

  closeNewProjModal = (event) => {
    if (event) { event.stopPropagation(); }

    this.setState({ showNewProjectModal: false });
  }

  stopPropagation = (event) => {
    if (event) { event.stopPropagation(); }
  }

  changeNewProjInputValue = (event) => {
    this.setState({ newProjInputValue: event.target.value });
  }

  sendNewProject = (event) => {
    event.stopPropagation();

    const project = {
      title: this.state.newProjInputValue,
      private: true,
    };

    network.Project.sendNewProject(this.props.account.accessToken, project)
    .then(result => {
      if (result.data.result) {

        this.closeNewProjModal(undefined);
        this.props.projInsert(result.data.payload);

      } else {
        console.error(`새로운 프로젝트 생성 실패`);
        // TODO 혹은 엣세스토큰 문제로 Login으로 보낸다거나 해야지.
      }
    });
  }
  // ---- New Project Modal End
  // -----------------------------------------------------------

  // 프로젝트 리스트 요청하기.
  getProjectList(accessToken, projUserId) {
    this.props.projSetState('pending');

    network.Project.getProjectList(accessToken, projUserId)
    .then(result => {
      if (result.data.result) {
        this.props.projInsertList(result.data.payload);
        this.props.setToolbar({ 
          title: `${projUserId}'s Projects`, 
          mode: 'project',
          showBackButton: false, 
        });
      } else {
        if (result.data.code === 14) {
          alert(`${result.data.msg}`);
        }
      }
    });
  }

  // 해당 프로젝트의 서브젝트 리스트로 이동.
  goToSubjectList = (event, historyId) => {
    if (event) { event.stopPropagation(); }

    this.props.history.push(`/subjectList/${historyId}`);
  };

  firstSetting() {
    const projWriterId = this.props.match.params.userId;
    
    if (this.props.account.loggedIn) {
      const accessToken = localStorage.getItem(conf.LOCAL_ACCESS_TOKEN);
      const userId = decode(accessToken)['userId'];
      const editable = projWriterId === userId ? true : false;
      this.setState({ editable: editable });
      this.getProjectList(accessToken, projWriterId);

    } else {
      this.getProjectList(undefined, projWriterId);
    }
  }

  componentDidMount() {
    this.firstSetting();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentWillUnmount() {
  }

  render() {
    let newProjModal;
    let newProject;
    const projectList = this.props.projectList.list.map(project => {
      return (
        <ProjectArticle
          key={project._id}
          newMode={false}
          project={project}
          goToSubjectList={this.goToSubjectList}
          />
      );
    });

    // 프로젝트 입력 모달.
    if (this.state.showNewProjectModal) {
      newProjModal = (
        <div id={css.newProjModalBackground}
          onClick={this.closeNewProjModal}
          >
          <div id={css.modal}
            onClick={this.stopPropagation}
            >
            <div id={css.icon}>Icons</div>
            <div id={css.input}>
              <input
                type="text"
                placeholder="Title.."
                value={this.state.newProjInputValue}
                onChange={this.changeNewProjInputValue}
                />
            </div>
            <div> </div>
            <div id={css.buttons}>
              <button
                type="button"
                onClick={this.sendNewProject}
                >확인</button>
              <button
                type="reset"
                onClick={this.closeNewProjModal}
                >취소</button>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.editable) {
      newProject = (
        <ProjectArticle
          newMode={true}
          openModalFunc={this.changeNewProjModalState}
          />
      );
    }

    return (
      <div id={css.background}>
        {projectList}
        {newProject}
        {newProjModal}
      </div>
    );
  }
}

const stateToProps = (state) => (
  {
    account: state.account,
    projectList: state.projectList,
    itemList: state.itemList,
  }
);
const dispatchToProps = (dispatch) => (
  {
    accountSet: (value) => { dispatch(accountSet(value)) },
    projInsertList: (value) => { dispatch(insertAll(value)) },
    projInsert: (value) => { dispatch(insert(value)) },
    projSetState: (value) => { dispatch(projSetState(value)) },
    projDeleteAll: () => { dispatch(deleteAll()) },
    setToolbar: (value) => { dispatch(setToolbar(value)) },
    deleteAllSubjList: () => { dispatch(deleteAllSubjList()) },
    deleteAllItemList: () => { dispatch(deleteAllItemList()) },
  }
);

export default connect(stateToProps, dispatchToProps)(ProjectList);
