import { message } from 'antd';
import router from 'umi/router';
import {
  addkowledge,
  savekowledge,
  openkowledge,
  submitkowledge,
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
              Id: saveres.mainId,
            },
            state: {
              runpath: '/ITSM/knowledgemanage/myknowledge',
              title: '新建知识',
              addoperation: true,
              menuDesc: '新建知识',
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

    // 编辑保存
    *saveorsubmit({ payload: { values, buttype, mainId, userId, runpath } }, { call, put }) {
      const payvalue = {
        ...values,
        mainId,
        flowNodeName: '知识登记',
        editState: 'edit',
      }
      const response = yield call(savekowledge, payvalue);
      if (response.code === 200) {
        if (buttype === 'save') { message.success('保存成功'); }
        const openres = yield call(openkowledge, mainId);
        if (openres.code === 200) {
          yield put({
            type: 'saveinfo',
            payload: openres,
          });
        } else {
          message.error(response.msg)
        };
        if (buttype === 'submit') {
          const subres = yield call(submitkowledge, { mainId, userId });
          if (subres.code === 200) {
            message.success('提交成功');
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
