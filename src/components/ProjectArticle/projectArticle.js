import React, { Component } from 'react';
import css from './projectArticle.scss';

class ProjectArticle extends Component {
  state = { };

  goToSubjectList = (event) => {
    this.props.goToSubjectList(event, this.props.project.historyId)
  };

  render() {
    let element = (<div></div>);

    if (this.props.newMode) {

      element = (
        <div id={css.newProject}>
          <div id={css.btn}
            onClick={this.props.openModalFunc}
            >
            Create New Project...
          </div>
        </div>
      );

    } else {

      element = (
        <div id={css.project}>
          <div id={css.btn}
            onClick={this.goToSubjectList}
            >
            {this.props.project.title}
          </div>
        </div>
      );

    }

    return (
      <div id={css.backDiv}>
        {element}
      </div>
    );
  }
}

export default ProjectArticle;