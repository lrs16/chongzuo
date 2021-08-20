import {
    qrtzjobList, // 列表
    addqrtzJob, // 添加
    updateqrtzJob, // 编辑
    qrtzjobDelete, // 删除
    changeStatus, // 状态更改
} from '../services/api';

export default {
    namespace: 'timedtaskmodel',

    state: {
        qrtzjoblist: []
    },

    effects: {
        // 查询，列表
        *toquery({ payload: { pageNum, pageSize, bodyParams } }, { call, put }) {
            const response = yield call(qrtzjobList, pageNum, pageSize, bodyParams);
            yield put({
            type: 'qrtzjoblist',
            payload: response,
            });
        },

        // 新增
        *toaddqrtzJob({ payload }, { call }) {
            return yield call(addqrtzJob, payload);
        },

        // 编辑
        *toupdateqrtzJob({ payload }, { call }) {
            return yield call(updateqrtzJob, payload);
        },

        // 删除
        *todeleteqrtzJob({ payload: { jobId } }, { call }) {
            return yield call(qrtzjobDelete, jobId);
        },

        // 状态更改
        *tochangeStatus({ payload }, { call }) {
            return yield call(changeStatus, payload);
        },
    },

    reducers: {
        qrtzjoblist(state, action) {
            return {
              ...state,
              qrtzjoblist: action.payload.data,
            };
        },
    },
};
