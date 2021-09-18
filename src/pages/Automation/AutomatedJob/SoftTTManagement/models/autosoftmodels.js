import { message } from 'antd';
// import router from 'umi/router';
import {
    listPageAutoSoftWord, // 启停列表
    listPageSoftWorkLogs, // 启停日志列表
    autoSoftObjectList, // 添加对象的数据
    addAutoSoftWork, // 添加
    getAutoSoftWorkDtoById, // 获得作业方案数据
    editAutoSoftWork, // 编辑
    submitAutoSoftWork, // 提交
} from '../services/api';

export default {
    namespace: 'autosoftwork',

    state: {
        autosoftworklist: {}, // 启停列表
        autosoftworkloglist: {}, // 启停日志列表
        softobjectlist: {}, // 添加对象的数据
        geteditinfo: {}, // 获得作业方案数据
    },

    effects: {
        // 启停列表
        *findautosoftworkList({ payload: { values, pageNum, pageSize } }, { call, put }) {
            console.log('dva222');
            const response = yield call(listPageAutoSoftWord, values, pageNum, pageSize);
            yield put({
                type: 'clearcache',
            });
            if (response.code === 200) {
                yield put({
                    type: 'saveautosoftworklist',
                    payload: response.data,
                });
            } else {
                message.error(response.msg);
            }
        },

        // 启停日志列表
        *findautosoftworklogsList({ payload: { values, pageNum, pageSize } }, { call, put }) {
            const response = yield call(listPageSoftWorkLogs, values, pageNum, pageSize);
            yield put({
                type: 'clearcache',
            });
            if (response.code === 200) {
                yield put({
                    type: 'saveautosoftworkloglist',
                    payload: response.data,
                });
            } else {
                message.error(response.msg);
            }
        },

        // 获取添加对象的全部数据
        *findautoSoftObjectList({ payload: { values, pageNum, pageSize, workId } }, { call, put }) {
            const response = yield call(autoSoftObjectList, values, pageNum, pageSize, workId);
            yield put({
                type: 'softobjectlist',
                payload: response.data,
            });
        },

        // 获取作业对象单个数据
        *findautoSoftObjectList1({ payload: { values, pageNum, pageSize, workId } }, { call }) {
            return yield call(autoSoftObjectList, values, pageNum, pageSize, workId);
        },

        // 增加数据
        *toaddAutoSoftWork({ payload: { autoSoftWork, autoSoftWorkExamine } }, { call }) {
            return yield call(addAutoSoftWork, autoSoftWork, autoSoftWorkExamine);
        },

        // 编辑获取作业方案数据
        *togetAutoSoftWorkDtoById({ payload: { workId } }, { call, put }) {
            const response = yield call(getAutoSoftWorkDtoById, workId);
            yield put({
                type: 'clearcache',
            });
            if (response.code === 200) {
                yield put({
                    type: 'geteditinfo',
                    payload: response.data,
                });
            } else {
                message.error(response.msg);
            }
        },

        // 编辑
        *toeditAutoSoftWork({ payload }, { call }) {
            return yield call(editAutoSoftWork, payload);
        },

        // 提交
        *tosubmitAutoSoftWork({ payload: { values, workId, workStatus} }, { call }) {
            return yield call(submitAutoSoftWork, values, workId, workStatus);
        },
    },

    reducers: {
        clearcache(state) {
            return {
                ...state,
                autosoftworklist: {},
                // autosoftworkloglist: {},
                geteditinfo: {},
            };
        },

        saveautosoftworklist(state, action) { // 启停列表
            console.log(action.payload,'dva');
            return {
                ...state,
                autosoftworklist: action.payload,
            };
        },

        saveautosoftworkloglist(state, action) { // 启停日志列表
            console.log(action.payload,'dva2')
            return {
                ...state,
                autosoftworkloglist: action.payload,
            };
        },

        softobjectlist(state, action) { // 添加对象的数据
            return {
                ...state,
                softobjectlist: action.payload,
            };
        },

        geteditinfo(state, action) {
            return {
                ...state,
                geteditinfo: action.payload,
            };
        },
    },
};
