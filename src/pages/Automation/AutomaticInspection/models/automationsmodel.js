// import { message } from 'antd';
import {
    taskObjectList, // 添加对象的数据
    inspectionhostList, // 主机list
    inspectionclockList, // 时钟list
    inspectionsoftList, // 软件list
    hostinfoList, // 信息列表
    softinfoList, // 软件信息列表
    clockinfoList, // 时钟信息列表
} from '../services/api';

export default {
    namespace: 'automation',

    state: {
        list: {},
        hostlist: {},
        clocklist: {},
        softlist: {},
        info: undefined,
        infolistdetails: {},
        softinfolistdetails: {},
        clockinfolistdetails: {},
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

        *fetchhostList({ payload }, { call, put }) { // 主机list
            const response = yield call(inspectionhostList, payload);
            yield put({
                type: 'tohostlist',
                payload: response.data,
            });
        },

        *fetchclockList({ payload }, { call, put }) { // 时钟list
            const response = yield call(inspectionclockList, payload);
            yield put({
                type: 'toclocklist',
                payload: response.data,
            });
        },

        *fetchsoftList({ payload }, { call, put }) { // 软件list
            const response = yield call(inspectionsoftList, payload);
            yield put({
                type: 'tosoftlist',
                payload: response.data,
            });
        },

        *queryhostinfoList({ payload }, { call, put }) { // 信息list post
            const response = yield call(hostinfoList, payload);
            yield put({
                type: 'hostinfolist',
                payload: response.data,
            });
        }, 

        *querysoftinfoList({ payload }, { call, put }) { // 软件信息list post
            const response = yield call(softinfoList, payload);
            yield put({
                type: 'softinfolist',
                payload: response.data,
            });
        }, 

        *queryclockinfoList({ payload }, { call, put }) { // 时钟信息list post
            const response = yield call(clockinfoList, payload);
            yield put({
                type: 'clockinfolist',
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

        hostinfolist(state, action) { // 信息列表
            return {
                ...state,
                infolistdetails: action.payload,
            };
        },

        softinfolist(state, action) { // 软件信息列表
            return {
                ...state,
                softinfolistdetails: action.payload,
            };
        }, 

        clockinfolist(state, action) { // 软件信息列表
            return {
                ...state,
                clockinfolistdetails: action.payload,
            };
        },
    },
};
