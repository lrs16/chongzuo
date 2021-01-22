import { FileUpload, FileDownload, FileDelete } from '@/services/upload';
import { message } from 'antd';

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
    *downloadfile({ payload: { id } }, { call }) {
      return yield call(FileDownload, id);
    },
    *deletefile({ payload: { id } }, { call }) {
      const response = yield call(FileDelete, id);
      if (response.code === 200) {
        message.success('附件删除成功', 2);
      }
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
