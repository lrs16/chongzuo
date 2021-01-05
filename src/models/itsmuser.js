import router from 'umi/router';
import { message } from 'antd';
import { ITSMUser } from '@/services/user';

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
  namespace: 'itsmuser',
  state: {
    flowmsg: '',
    userinfo: '',
  },

  effects: {
    // 打开登记，加载用户信息
    *fetchuser(_, { call, put }) {
      const response = yield call(ITSMUser);
      yield put({
        type: 'saveuser',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveuser(state, action) {
      return {
        ...state,
        userinfo: action.payload,
      };
    },
  },
};
