import { message } from 'antd';
import router from 'umi/router';
import {
  queryTodoList,
  openFlow,
  saveRegister,
  flowSubmit,
  saveplatformValid,
  savereleaseBizValid,
  releaseListAssign,
  savePracticePre
} from '../services/api';

export default {
  namespace: 'releasetodo',

  state: {
    list: {},
    info: undefined,
    currentTaskStatus: undefined,
  },

  effects: {
    // 清除state
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },
    // 列表
    *fetchlist({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(queryTodoList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 打开待办
    *openflow({ payload: { releaseNo, taskName } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(openFlow, releaseNo);
      const infomap = new Map([
        ['出厂测试', response.data.register],
        ['平台验证', response.data.platformValidate],
        ['业务验证', response.data.bizValidateParam],
        ['发布实施准备', response.data.practicePreParam],
      ]);
      yield put({
        type: 'saveinfo',
        payload: { info: infomap.get(taskName), currentTaskStatus: response.data.currentTaskStatus },
      });
    },
    // 通用流转
    *releaseflow({ payload }, { call }) {
      const tabid = sessionStorage.getItem('tabid');
      const subres = yield call(flowSubmit, payload);
      if (subres.code === 200) {
        router.push({
          pathname: `/ITSM/releasemanage/registration`,
          query: { tabid, closecurrent: true }
        });
        router.push({
          pathname: `/ITSM/releasemanage/to-do`,
          query: { pathpush: true },
          state: { cach: false, }
        });
      } else {
        message.error('操作失败');
      }
    },

    // 出厂测试保存
    * factorytest({ payload: { register, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(saveRegister, register);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功')
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.saveRegister, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error('操作失败');
      }
    },

    // 平台验证保存
    * platformvalid({ payload: { platform, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(saveplatformValid, platform);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.savePlatformValid, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error('操作失败');
      }
    },

    // 业务验证保存
    * bizvalid({ payload: { bizValidate, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(savereleaseBizValid, bizValidate);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
          const assignList = response.data.saveBizValid.releaseLists.slice(-1)[0];
          const values = { listIds: assignList.id, handlerId: assignList.responsibleId }
          const assignres = yield call(releaseListAssign, values);                      // 保存成功分派清单
          if (assignres.code === 200) {
            const openres = yield call(openFlow, bizValidate.releaseNo);
            yield put({
              type: 'saveinfo',
              payload: { info: openres.data.bizValidateParam, currentTaskStatus: openres.data.currentTaskStatus },
            });
          }
        } else {
          yield put({
            type: 'saveinfo',
            payload: { info: response.data.saveBizValid, currentTaskStatus: response.data.currentTaskStatus },
          });
        }
      } else {
        message.error(response.msg)
      }
    },

    // 发布实施准备保存
    * implementationpre({ payload: { formValue, buttype } }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(savePracticePre, formValue);
      if (response.code === 200) {
        if (buttype === 'save') {
          message.success('保存成功');
        };
        yield put({
          type: 'saveinfo',
          payload: { info: response.data.practicePreParam, currentTaskStatus: response.data.currentTaskStatus },
        });
      } else {
        message.error('操作失败');
      }
    },

  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
        info: undefined,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload || {},
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload.info || {},
        currentTaskStatus: action.payload.currentTaskStatus || {},
      };
    },
  },
};
