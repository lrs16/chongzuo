import { message } from 'antd';
import router from 'umi/router';
import { saveRegister } from '../services/api';

export default {
  namespace: 'releaseregistra',

  state: {
    info: {}
  },

  effects: {
    // 登记保存或提交
    *fetchsave({ payload: { register, taskId, type, userIds, buttontype } }, { call, put }) {
      const tabid = sessionStorage.getItem('tabid')
      const response = yield call(saveRegister, register);
      if (response.code === 200) {
        if (buttontype === 'save') {
          message.success('保存成功');
          router.push({
            pathname: `/ITSM/knowledgemanage/myknowledge/new`,
            query: { tabid, closecurrent: true }
          })
          yield put({
            type: 'save',
            payload: response.data,
          });
          router.push({
            pathname: `/ITSM/releasemanage/to-do/record`,
            query: {
              Id: response.currentTaskStatus.businessKey,
              taskName: response.currentTaskStatus.taskName
            },
            state: {
              runpath: `/ITSM/releasemanage/to-do`,
              dynamicpath: true,
              menuDesc: '发布工单',
            },
          });
        };

      }

    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        info: action.payload || {},
      };
    },
  },
};
