// import { queryCurrent, query as queryUsers } from '@/services/user';
import { UserChangPW } from '@/services/user';

const UserModel = {
  namespace: 'userchangpw',
  state: {},
  effects: {
    *fetch({ payload }, { call }) {
      return yield call(UserChangPW, payload);
    },
  },
  reducers: {},
};
export default UserModel;
