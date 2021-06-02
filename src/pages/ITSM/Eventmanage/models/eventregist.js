import router from 'umi/router';
import { message } from 'antd';
import { EventFlowStart, EventSave, EventFlow, EventUser } from '../services/api';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/handle_/g, 'handle.')
      .replace(/register_/g, 'register.'),
  );
  return newarr;
};

export default {
  namespace: 'eventregist',
  state: {
    flowmsg: '',
    userinfo: '',
  },

  effects: {
    // 打开登记，加载用户信息
    *fetchuser(_, { call, put }) {
      const response = yield call(EventUser);
      yield put({
        type: 'saveuser',
        payload: response.data,
      });
    },
    // 启动流程,保存
    *eventstart({ payload }, { call }) {
      const { register_selfhandle } = payload;
      const values = replacerec(payload);
      const response = yield call(EventFlowStart);
      if (response.code === 200) {
        const { flowInstanceId, flowNodeInstanceId, flowNodeName } = response;
        const registratpayload = {
          flowInstanceId,
          flowNodeInstanceId,
          flowNodeName,
          editState: 'add',
          ...values,
        };
        const registres = yield call(EventSave, registratpayload);
        if (registres.code === 200) {
          message.success(registres.msg, 5);
          router.push({
            pathname: `/ITSM/eventmanage/registration`,
            query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
          })
          router.push({
            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
            query: {
              taskName: register_selfhandle === '1' ? '处理中' : '已登记',
              taskId: registres.taskId,
              mainId: flowInstanceId,
              validate: false,
              orderNo: registres.eventNo,
            },
            state: {}
          });
        }
      }
    },

    // 登记流转
    *eventsaveflow({ payload: { formvalue, flowtype } }, { call }) {
      const values = replacerec(formvalue);
      const response = yield call(EventFlowStart);
      if (response.code === 200) {
        const { flowInstanceId, flowNodeInstanceId, flowNodeName } = response;
        const registratpayload = {
          flowInstanceId,
          flowNodeInstanceId,
          flowNodeName,
          editState: 'add',
          ...values,
        };
        const registres = yield call(EventSave, registratpayload);
        if (registres.code === 200) {
          const flowpayload = {
            id: registres.taskId,
            userIds: sessionStorage.getItem('NextflowUserId'),
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
    saveuser(state, action) {
      return {
        ...state,
        userinfo: action.payload,
      };
    },
  },
};
