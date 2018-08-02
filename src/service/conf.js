// -----------------------------------------------------------
// ---- 클라이언트 정보
export const LOCAL_ACCESS_TOKEN = 'accessToken';
// ---- 클라이언트 정보 끝
// -----------------------------------------------------------

const SERVER = 'http://localhost:8030';
const OR = '/s'; //option url, 서버와 react의 route가 겹치는 경우가 발생할수도 있어서..
const ACCOUNT = '/account';
const PROJECT = '/project';
const SUBJECT = '/subject';
const ITEM = '/item';

export const CHECK_ACCESS_TOKEN = SERVER + OR + ACCOUNT + '/checkAccessToken';
export const LOGIN = SERVER + OR + ACCOUNT + '/login';
export const SIGN = SERVER + OR + ACCOUNT + '/sign';

export const GET_PROJECT_LIST = SERVER + OR + PROJECT + '/projectList';
export const GET_PROJECT_ONE = SERVER + OR + PROJECT + '/projectOne';
export const SEND_NEW_PROJECT = SERVER + OR + PROJECT + '/newProject';

export const GET_SUBJECT_LIST = SERVER + OR + SUBJECT + '/subjectList';
export const GET_SUBJECT_ONE = SERVER + OR + SUBJECT + '/subjectOne';
export const SEND_NEW_SUBJECT = SERVER + OR + SUBJECT + '/newSubject';
export const MODIFY_SUBJECT = SERVER + OR + SUBJECT + '/modifySubject';
export const DELETE_SUBJECT = SERVER + OR + SUBJECT + '/deleteSubject';

// subjectArticle에서 출력할 아이템들의 데이터 절약형을 요청.
export const GET_ITEM_TITLE_LIST = SERVER + OR + ITEM + '/titleList';
export const GET_ITEM_DETAIL = SERVER + OR + ITEM + '/detail';
export const SEND_NEW_ITEM = SERVER + OR + ITEM + '/newItem';
export const MODIFY_ITEM = SERVER + OR + ITEM + '/modifyItem';
// 아이템들을 삭제해요. '들'인데, 단일항목도 삭제 가능해요.
export const DELETE_ITEMS = SERVER + OR + ITEM + '/deleteItems';

export const SEND_NEW_TAG = SERVER + OR + ITEM + '/newTag';
export const DELETE_TAG = SERVER + OR + ITEM + '/deleteTag';
export const SEND_NEW_CHECKBOX = SERVER + OR + ITEM + '/newCheckBox';
export const MODIFY_CHECKBOX = SERVER + OR + ITEM + '/modifyCheckBox';
export const CHANGE_CHECK_STATE = SERVER + OR + ITEM + '/changeCheckState';
export const DELETE_CHECKBOX = SERVER + OR + ITEM + '/deleteCheckBox';
