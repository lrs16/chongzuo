// const Temporarystorageinfo = (tabid) => {
// }

const UserModel = {
  namespace: 'viewcache',
  state: {
    cacheinfo: [],
  },
  effects: {
    *fetch(payload, { put }) {
      yield put({
        type: 'save',
        payload: {
          payload,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        cacheinfo: action.payload,
      };
    },
  },
};
export default UserModel;
