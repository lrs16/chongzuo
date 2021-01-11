import router from 'umi/router';
import { message } from 'antd';
import { DemandStart, DemandStartAndNext } from '../services/api';

export default {
  namespace: 'demandregister',

  state: {
    // list: [],
  },

  effects: {
    // 登记时保存
    *start({ payload }, { call }) {
      const response = yield call(DemandStart, payload);
      if (response.code === 200) {
        message.success(response.msg, 5);
<<<<<<< HEAD

        // router.push({
        //   pathname: `/ITSM/eventmanage/to-do/record/workorder`,
        //   query: {
        //     pangekey: register_selfhandle === '1' ? '5' : '1',
        //     id: registres.taskId,
        //     mainId: flowInstanceId,
        //     validate: false,
        //   },
=======
        // router.push({
        //   pathname: `/ITSM/demandmanage/to-do`,
>>>>>>> 465151b... 更新问题管理代码
        // });
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
