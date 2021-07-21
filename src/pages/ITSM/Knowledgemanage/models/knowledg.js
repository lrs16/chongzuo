import { message } from 'antd';
import router from 'umi/router';
import {
  addkowledge,
  savekowledge,
  openkowledge,
  submitkowledge,
  releasekowledge,
  queryTodoList
} from '../services/api';

export default {
  namespace: 'knowledg',

  state: {
    list: [],
    info: undefined,
  },

  effects: {
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },
    // 新建保存
    *add({ payload }, { call }) {
      const tabid = sessionStorage.getItem('tabid')
      const resadd = yield call(addkowledge);
      if (resadd.code === 200) {
        const value = {
          ...payload,
          mainId: resadd.id,
          flowNodeName: '知识登记',
          editState: 'add',
          id: resadd.id,
        }
        const saveres = yield call(savekowledge, value);
        if (saveres.code === 200) {
          router.push({
            pathname: `/ITSM/knowledgemanage/myknowledge/new`,
            query: { tabid, closecurrent: true }
          })
          router.push({
            pathname: `/ITSM/knowledgemanage/myknowledge/operation`,
            query: {
              Id: saveres.no,
            },
            state: {
              runpath: '/ITSM/knowledgemanage/myknowledge',
              title: '我的知识',
              dynamicpath: true,
              menuDesc: '编辑知识',
              mainId: saveres.mainId,
              status: '已登记'
            },
          });
        }
      } else {
        message.error(resadd.msg)
      }
    },

    // 打开
    *knowledgopen({ payload: { mainId } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(openkowledge, mainId);
      if (response.code === 200) {
        yield put({
          type: 'saveinfo',
          payload: response,
        });
      } else {
        message.error(response.msg)
      }
    },

    // 编辑保存、提交、发布
    *saveorsubmit({ payload: { values, buttype, mainId, userId, runpath } }, { call, put }) {
      const payvalue = {
        ...values,
        mainId,
        flowNodeName: '知识登记',
        editState: 'edit',
      }
      const response = yield call(savekowledge, payvalue);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
          const openres = yield call(openkowledge, mainId);
          if (openres.code === 200) {
            yield put({
              type: 'saveinfo',
              payload: openres,
            });
          } else {
            message.error(response.msg)
          };
        };
        if (buttype === 'submit') {
          const mainIds = [mainId];
          const subres = yield call(submitkowledge, { mainIds, userId });
          if (subres.code === 200) {
            message.success('提交成功');
            router.push({
              pathname: runpath,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        };
        if (buttype === 'release') {
          const mainIds = [mainId];
          const subres = yield call(releasekowledge, { mainIds, userId });
          if (subres.code === 200) {
            message.success('发布成功');
            router.push({
              pathname: runpath,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        }
      } else {
        message.error(response.msg)
      }
    },

    *saveorcheck({ payload: { values, buttype, mainId, mainIds, userId, runpath, editState } }, { call, put }) {
      const payvalue = {
        ...values,
        mainId,
        flowNodeName: '知识审核',
        editState
      };
      const response = yield call(savekowledge, payvalue);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
          const openres = yield call(openkowledge, mainId);
          if (openres.code === 200) {
            yield put({
              type: 'saveinfo',
              payload: openres,
            });
          } else {
            message.error(response.msg)
          };
        };
        if (buttype === 'check') {
          const subres = yield call(submitkowledge, { mainIds, userId });
          if (subres.code === 200) {
            message.success('发布成功');
            router.push({
              pathname: runpath,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        }
      } else {
        message.error(response.msg)
      }
    },

    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryTodoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(response.msg)
      }
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: [],
        info: undefined,
      };
    },
    saveopen(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};
