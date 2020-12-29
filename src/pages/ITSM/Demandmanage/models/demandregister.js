import router from 'umi/router';
import { message } from 'antd';
import { DemandStart, DemandStartAndNext } from '../services/api';

export default {
  namespace: 'demandregister',

  state: {
    // list: [],
  },

  effects: {
    // 列表
    *start({ payload }, { call }) {
      const response = yield call(DemandStart, payload);
      if (response.code === 200) {
        message.success(response.msg, 5);
        router.push({
          pathname: `/ITSM/demandmanage/to-do`,
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

  reducers: {},
};
