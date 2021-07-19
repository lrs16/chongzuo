import { message } from 'antd';
import router from 'umi/router';
import {
  addkowledge,
  savekowledge,
  openkowledge,
  queryTodoList
} from '../services/api';

export default {
  namespace: 'knowledg',

  state: {
    list: [],
    info: '',
  },

  effects: {
    // 新建保存
    *add({ payload }, { call, put }) {
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
          const openres = call(openkowledge, { mainId: resadd.id });
          yield put({
            type: 'open',
            payload: openres.data,
          });
          router.push({
            pathname: `/ITSM/knowledgemanage/myknowledge/operation`,
            query: {
              Id: openres.mainId,
            },
            state: {
              runpath: '/ITSM/knowledgemanage/myknowledge',
              title: '新建知识',
              addoperation: true,
              menuDesc: '新建知识',
            },
          });
          router.push({
            pathname: `/ITSM/knowledgemanage/myknowledge/new`,
            query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
          })
        }
      } else {
        message.error(resadd.mes)
      }
    },
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryTodoList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
  },

  reducers: {
    open(state, action) {
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
