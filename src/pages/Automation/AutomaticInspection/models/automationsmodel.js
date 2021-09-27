import {
    taskObjectList, // 添加对象的数据
    inspectionhostList, // 主机list
    inspectionclockList, // 时钟list
    inspectionsoftList, // 软件list
} from '../services/api';

export default {
    namespace: 'automation',

    state: {
        list: {},
        hostlist: {},
        clocklist: {},
        softlist: {}
    },

    effects: {
        // 获取作业对象全部数据
        *findtaskObjectList({ payload: { values, pageNum, pageSize, taskId } }, { call, put }) {
            const response = yield call(taskObjectList, values, pageNum, pageSize, taskId);
            yield put({
                type: 'taskobjectlist',
                payload: response.data,
            });
        },

        *fetchhostList({ payload: { pageIndex, pageSize } }, { call, put }) { // 主机list
            const response = yield call(inspectionhostList, pageIndex, pageSize);
            yield put({
                type: 'tohostlist',
                payload: response.data,
            });
        },

        *fetchclockList({ payload: { pageIndex, pageSize } }, { call, put }) { // 时钟list
            const response = yield call(inspectionclockList, pageIndex, pageSize);
            yield put({
                type: 'toclocklist',
                payload: response.data,
            });
        },

        *fetchsoftList({ payload: { pageIndex, pageSize } }, { call, put }) { // 软件list
            const response = yield call(inspectionsoftList, pageIndex, pageSize);
            yield put({
                type: 'tosoftlist',
                payload: response.data,
            });
        },

    },

    reducers: {
        taskobjectlist(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },

        tohostlist(state, action) { // 主机list
            return {
                ...state,
                hostlist: action.payload,
            };
        },

        toclocklist(state, action) { // 时钟list
            return {
                ...state,
                clocklist: action.payload,
            };
        },

        tosoftlist(state, action) { // 软件list
            return {
                ...state,
                softlist: action.payload,
            };
        },
    },
};
