import { message } from 'antd';
import { Download, NewDownload, View } from '../services/apisecene';

export default {
  namespace: 'download',

  state: {},

  effects: {
    *view({ payload: { jobid } }, { call }) {
      return yield call(View, jobid);
    },

    *download({ payload: { jobid } }, { call }) {
      return yield call(Download, jobid);
      // if (response instanceof Blob) {
      //     if (callback && typeof callback === 'function') {
      //           callback(response);
      //     }
      // } else {
      //     message.warning('下载失败。。。', 5);
      // }
    },

    *newdownload({ payload: { jobid } }, { call }) {
      return yield call(NewDownload, jobid);
    },

    //   *newdownload({ payload:{jobid}, callback }, { call }){
    //     const response = yield call(NewDownload, jobid);
    //     if (response instanceof Blob) {
    //       console.log(callback);
    //         if (callback && typeof callback === 'function') {
    //               callback(response);
    //         }
    //     } else {
    //         message.warning('下载失败！', 5);
    //     }
    // },
  },

  reducers: {},
};
