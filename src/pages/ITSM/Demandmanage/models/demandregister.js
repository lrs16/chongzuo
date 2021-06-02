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
    *uploadchange({ payload }, { call }) {
      const response = yield call(DemandStart, payload);
      if (response.code === 200) {
        const { taskId, processId } = response.data;
        router.push({
          pathname: `/ITSM/demandmanage/to-do/record/workorder`,
          query: {
            taskName: '需求登记',
            mainId: processId,
            taskId,
            result: '1',
          },
        });
      }
    },

    // 登记时保存
    *start({ payload }, { call }) {
      const response = yield call(DemandStart, payload);
      if (response.code === 200) {
        message.success('操作成功', 2);
        const { taskId, processId, demandId } = response.data;
        router.push({
          pathname: `/ITSM/demandmanage/registration`,
          query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
        })
        router.push({
          pathname: `/ITSM/demandmanage/to-do/record/workorder`,
          query: {
            taskName: '需求登记',
            mainId: processId,
            taskId,
            result: '1',
            orderNo: demandId,
          },
          state: {}
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
