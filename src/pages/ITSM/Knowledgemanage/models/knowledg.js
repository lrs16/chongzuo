import { message } from 'antd';
import router from 'umi/router';
import {
  addkowledge,
  savekowledge,
  openkowledge,
  submitkowledge,
  releasekowledge,
  queryTodoList,
  queryUpdateList,
  queryStatisList,
  downloadStatisExcel,
  downloadKnowledgeExcel,
  openViewkowledge
} from '../services/api';

export default {
  namespace: 'knowledg',

  state: {
    list: [],
    info: undefined,
    updatas: [],
    statislist: [],
    viewinfo: undefined
  },

  effects: {
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },
    // 新建保存
    *add({ payload: { payvalue, buttype, userId, menuDes } }, { call }) {
      const tabid = sessionStorage.getItem('tabid')
      const resadd = yield call(addkowledge);
      if (resadd.code === 200) {
        const value = {
          ...payvalue,
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
          if (buttype === 'save') {
            router.push({
              pathname: `/ITSM/knowledgemanage/${menuDes ? 'maintain' : 'myknowledge'}/operation`,
              query: {
                Id: saveres.no,
                mainId: saveres.mainId
              },
              state: {
                runpath: `/ITSM/knowledgemanage/${menuDes ? 'maintain' : 'myknowledge'}`,
                title: menuDes || '我的知识',
                dynamicpath: true,
                menuDesc: '编辑知识',
                mainId: saveres.mainId,
                status: '已登记',
              },
            });
          };
          if (buttype === 'submit') {
            const mainIds = [saveres.mainId];
            const subres = yield call(submitkowledge, { mainIds, userId });
            if (subres.code === 200) {
              message.success('提交成功');
              router.push({
                pathname: `/ITSM/knowledgemanage/myknowledge`,
                query: { pathpush: true },
                state: { cach: false, }
              });
            } else {
              message.error(subres.msg)
            }
          };
          if (buttype === 'release') {
            const mainIds = [saveres.mainId];
            const subres = yield call(releasekowledge, { mainIds, userId });
            if (subres.code === 200) {
              message.success('发布成功');
              router.push({
                pathname: `/ITSM/knowledgemanage/myknowledge`,
                query: { pathpush: true },
                state: { cach: false, }
              });
            } else {
              message.error(subres.msg)
            };
          };
        }
      } else {
        message.error(resadd.msg)
      }
    },

    // 打开待办
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
    // 打开查询
    *openview({ payload: { mainId } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(openViewkowledge, mainId);
      if (response.code === 200) {
        yield put({
          type: 'saveview',
          payload: response.data,
        });
      } else {
        message.error(response.msg)
      }
    },

    // 编辑保存、提交、发布
    *saveorsubmit({ payload: { values, buttype, mainId, userId, runpath, Id } }, { call, put }) {
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
              state: { cach: false, closetabid: response.no }
            });
          } else {
            message.error(subres.msg)
          };
        };
        if (buttype === 'release') {
          const mainIds = [mainId];
          const subres = yield call(releasekowledge, { mainIds, userId });
          if (subres.code === 200) {
            message.success('发布成功');
            router.push({
              pathname: runpath,
              query: { pathpush: true },
              state: { cach: false, closetabid: response.no }
            });
          } else {
            message.error(subres.msg)
          };
        };
      } else {
        message.error(response.msg)
      }
    },

    *saveorcheck({ payload: { values, buttype, mainId, userId, runpath, editState } }, { call, put }) {
      const payvalue = {
        ...values,
        mainId,
        flowNodeName: '知识审核',
        editState
      };
      const response = yield call(savekowledge, payvalue);
      const mainIds = [response.mainId];
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

    // 编辑历史
    *updatelist({ payload }, { call, put }) {
      const response = yield call(queryUpdateList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveupload',
          payload: response.data,
        });
      }
    },

    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryTodoList, payload);
      yield put({
        type: 'clearcache',
      });
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(response.msg)
      }
    },
    // 统计
    *fetchstatis({ payload }, { call, put }) {
      const response = yield call(queryStatisList, payload);
      if (response.code === 200) {
        yield put({
          type: 'savestatis',
          payload: response.data,
        });
      } else {
        message.error(response.msg)
      }
    },

    // 统计下载
    *downloadstatis({ payload }, { call }) {
      return yield call(downloadStatisExcel, payload);
    },

    // 查询下载
    *downloadquery({ payload }, { call }) {
      return yield call(downloadKnowledgeExcel, payload);
    }
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: [],
        info: undefined,
        updatas: [],
      };
    },
    saveopen(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
    saveview(state, action) {
      return {
        ...state,
        viewinfo: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveupload(state, action) {
      return {
        ...state,
        updatas: action.payload,
      };
    },
    savestatis(state, action) {
      return {
        ...state,
        statislist: action.payload,
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
