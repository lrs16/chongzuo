import { FileUpload } from '@/services/upload';

const Model = {
  namespace: 'sysfile',
  state: {
    info: '',
  },

  effects: {
    *uploadfile({ payload }, { call, put }) {
      const response = yield call(FileUpload, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};
export default Model;
