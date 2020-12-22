import router from 'umi/router';
import { message } from 'antd';
import { EventFlowStart, EventSaveFlow } from '../services/api';

export default {
  namespace: 'eventregist',
  state: {
    flowmsg: '',
  },

  effects: {
    // 启动流程
    *eventstart({ payload }, { call }) {
      const response = yield call(EventFlowStart);
      if (response.code === 200) {
        const { flow_instance_id, flow_node_instance_id, flow_node_name } = response;
        const values = JSON.parse(
          JSON.stringify(payload)
            .replace(/register_/g, 'register.')
            .replace(/main_/g, 'main.')
            .replace(/register.register./g, 'register.register_'),
        );
        const registratpayload = {
          flow_instance_id,
          flow_node_instance_id,
          flow_node_name,
          _edit_state: 'add',
          ...values,
        };
        const registres = yield call(EventSaveFlow, registratpayload);
        if (registres.code === 200) {
          message.success(registres.msg, 5);
          router.push({
            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
            query: {
              pangekey: '已登记',
              id: registres.taskId,
              validate: false,
            },
          });
        }
      }
    },
    // // 事件登记
    // *eventsaveflow({ payload }, { call }) {
    //   return yield call(EventSaveFlow, { payload });
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        flowmsg: action.payload,
      };
    },
  },
};
