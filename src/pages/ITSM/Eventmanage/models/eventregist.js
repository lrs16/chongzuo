import router from 'umi/router';
import { message } from 'antd';
import { EventFlowStart, EventSave, EventFlow } from '../services/api';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/handle_/g, 'handle.')
      .replace(/handle.handle./g, 'handle.handle_')
      .replace(/handle.user/g, 'handle.handler')
      .replace(/register_/g, 'register.')
      .replace(/register.register./g, 'register.register_'),
  );
  return newarr;
};

export default {
  namespace: 'eventregist',
  state: {
    flowmsg: '',
  },

  effects: {
    // 启动流程,保存
    *eventstart({ payload }, { call }) {
      const { register_selfhandle } = payload;
      const values = replacerec(payload);
      const response = yield call(EventFlowStart);
      if (response.code === 200) {
        const { flow_instance_id, flow_node_instance_id, flow_node_name } = response;
        const registratpayload = {
          flow_instance_id,
          flow_node_instance_id,
          flow_node_name,
          _edit_state: 'add',
          ...values,
        };
        const registres = yield call(EventSave, registratpayload);
        if (registres.code === 200) {
          message.success(registres.msg, 5);
          router.push({
            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
            query: {
              pangekey: register_selfhandle === '1' ? '5' : '1',
              id: registres.taskId,
              validate: false,
            },
          });
        }
      }
    },

    // 登记流转
    *eventsaveflow({ payload: { formvalue, flowtype } }, { call }) {
      const values = replacerec(formvalue);
      const response = yield call(EventFlowStart);
      if (response.code === 200) {
        const { flow_instance_id, flow_node_instance_id, flow_node_name } = response;
        const registratpayload = {
          flow_instance_id,
          flow_node_instance_id,
          flow_node_name,
          _edit_state: 'add',
          ...values,
        };
        const registres = yield call(EventSave, registratpayload);
        if (registres.code === 200) {
          const flowpayload = {
            id: registres.taskId,
            userIds: '1',
            type: flowtype,
          };
          const flowreponse = yield call(EventFlow, flowpayload);
          if (flowreponse.code === 200) {
            message.success(registres.msg, 5);
            router.push({
              pathname: `/ITSM/eventmanage/to-do`,
            });
          }
        }
      }
    },
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
