import router from 'umi/router';
import { message } from 'antd';
import { DemandStart, DemandStartAndNext } from '../services/api';

export default {
  namespace: 'demandregister',

  state: {
    data: '',
  },

  effects: {
    // 上传,删除附件触发保存
    *uploadchange({ payload }, { call, put }) {
      const response = yield call(DemandStart, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },

    // 登记时保存
    *start({ payload }, { call }) {
      const response = yield call(DemandStart, payload);
      if (response.code === 200) {
        message.success('操作成功', 2);
        const { taskId, processId } = response.data;
        router.push({
          pathname: `/ITSM/demandmanage/to-do/record/workorder`,
          query: {
            pangekey: '需求登记',
            mainId: processId,
            taskId,
          },
        });
      }
    },
    *startandnext({ payload }, { call }) {
      const response = yield call(DemandStartAndNext, payload);
      if (response.code === 200) {
        message.success(response.msg, 5);
        router.push({
          pathname: `/ITSM/demandmanage/to-do`,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
