import axios from 'axios';
import * as conf from './conf';

export class Account {
  static checkAccessToken(accessToken) {
    return axios.get(
      conf.CHECK_ACCESS_TOKEN, 
      {headers: {'c-access-token': accessToken}
    });
  }

  static login(id, password) {
    return axios.post(
      conf.LOGIN,
      { id, password }
    );
  }

  static sign(id, password, nickName) {
    return axios.post(
      conf.SIGN,
      { id, password, nickName }
    );
  }

  static changePassword(accessToken, oldPass, newPass) {
    return axios.post(
      conf.CHANGE_PASSWORD,
      { oldPass, newPass },
      { headers: { 'c-access-Token': accessToken } }
    );
  }
}

export class Project {
  static getProjectList(accessToken, projUserId) {
    return axios.post(
      conf.GET_PROJECT_LIST,
      { projUserId },
      { headers: {'c-access-token': accessToken } }
    );
  }

  static getProjectOne(accessToken, projHisId) {
    return axios.post(
      conf.GET_PROJECT_ONE,
      { projHisId },
      { headers: {'c-access-token': accessToken } }
    );
  }

  static sendNewProject(accessToken, project) {
    return axios.post(
      conf.SEND_NEW_PROJECT,
      project,
      { headers: {'c-access-token': accessToken} }
    );
  }
}

export class Subject {
  static getSubjectList(accessToken, projHisId) {
    return axios.post(
      conf.GET_SUBJECT_LIST,
      { projHisId },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static getSubjectOne(accessToken, subjHisId) {
    return axios.post(
      conf.GET_SUBJECT_ONE,
      { subjHisId },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static sendNewSubject(accessToken, subject) {
    return axios.post(
      conf.SEND_NEW_SUBJECT,
      subject,
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static modifySubject(accessToken, subject) {
    return axios.post(
      conf.MODIFY_SUBJECT,
      subject,
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static deleteSubject(accessToken, subjHisId) {
    return axios.post(
      conf.DELETE_SUBJECT,
      { subjHisId },
      { headers: { 'c-access-token': accessToken } }
    );
  }
}

export class Item {
  static getItemTitleList(accessToken, subjHisId) {
    return axios.post(
      conf.GET_ITEM_TITLE_LIST,
      { subjHisId },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static sendNewItem(accessToken, item) {
    return axios.post(
      conf.SEND_NEW_ITEM,
      item,
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static modifyItem(accessToken, item) {
    return axios.post(
      conf.MODIFY_ITEM,
      item,
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static getItemDetail(accessToken, itemHisId) {
    return axios.post(
      conf.GET_ITEM_DETAIL,
      { itemHisId },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static sendNewTag(accessToken, itemHisId, tag) {
    return axios.post(
      conf.SEND_NEW_TAG,
      { itemHisId, tag },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static deleteTag(accessToken, itemHisId, tag) {
    return axios.post(
      conf.DELETE_TAG,
      { itemHisId, tag },
      { headers: {'c-access-token': accessToken } }
    );
  }

  static deleteItems(accessToken, itemHisIds) {
    return axios.post(
      conf.DELETE_ITEMS,
      { itemHisIds },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static sendNewCheckBox(accessToken, itemHisId, title) {
    return axios.post(
      conf.SEND_NEW_CHECKBOX,
      { itemHisId, title },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static modifyCheckBox(accessToken, itemHisId, checkBox) {
    return axios.post(
      conf.MODIFY_CHECKBOX,
      { itemHisId, checkBox },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static changeCheckState(accessToken, itemHisId, checkBoxId) {
    return axios.post(
      conf.CHANGE_CHECK_STATE,
      { itemHisId, checkBoxId },
      { headers: { 'c-access-token': accessToken } }
    );
  }

  static deleteCheckBox(accessToken, itemHisId, checkBoxId) {
    return axios.post(
      conf.DELETE_CHECKBOX,
      { itemHisId, checkBoxId },
      { headers: { 'c-access-token': accessToken } }
    );
  }
}