import {
    qrtzjobList, // 列表
    addqrtzJob, // 添加
    updateqrtzJob, // 编辑
    qrtzjobDelete, // 删除
    changeStatus, // 状态更改
    qrtzjobRun, // 任务调度执行一次
    qrtzjobloglistdata, // 根据jobLogId查询任务调度日志数据
    qrtzjoblogDelete, // 删除调度日志
    qrtzjoblogClean, // 清除调度日志
    qrtzjoblogList, // 分页查询日志信息
} from '../services/api';

export default {
    namespace: 'timedtaskmodel',

    state: {
        qrtzjoblist: [],
        qrtzjobloglist: [],
        getqrtzjoblogdata: []
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

        // 任务调度执行一次
        *torunqrtzJob({ payload: { jobId } }, { call }) {
            return yield call(qrtzjobRun, jobId);
        },

        // 根据jobLogId查询任务调度日志数据
        *getqrtzjoblogData({ payload }, { call, put }) {
            const response = yield call(qrtzjobloglistdata, payload);
            yield put({
                type: 'getqrtzjoblogdata',
                payload: response,
            });
        },

        // 删除调度日志
        *todeleteqrtzjobLog({ payload: { jobLogId } }, { call }) {
            return yield call(qrtzjoblogDelete, jobLogId);
        },

        // 清除调度日志
        *tocleanqrtzjobLog({ payload }, { call }) {
            return yield call(qrtzjoblogClean, payload);
        },

        // 分页查询日志信息
        *toqueryqrtzjoblogList({ payload: { pageNum, pageSize, bodyParams } }, { call, put }) {
            const response = yield call(qrtzjoblogList, pageNum, pageSize, bodyParams);
            yield put({
                type: 'qrtzjobloglist',
                payload: response,
            });
        },

    },

    reducers: {
        qrtzjoblist(state, action) {
            return {
                ...state,
                qrtzjoblist: action.payload.data,
            };
        },
        qrtzjobloglist(state, action) {
            return {
                ...state,
                qrtzjobloglist: action.payload.data,
            };
        },
        getqrtzjoblogdata(state, action) {
            return {
                ...state,
                getqrtzjoblogdata: action.payload.data,
            };
        },
    },
};
