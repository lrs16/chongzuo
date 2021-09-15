import { message } from 'antd';
import {
    listPageAutoSoftWord, // 启停列表
    autoSoftObjectList, // 添加对象的数据
    addAutoSoftWork, // 添加

} from '../services/api';

export default {
    namespace: 'autosoftwork',

    state: {
        autosoftworklist: {}, // 启停列表
        softobjectlist: {}, // 添加对象的数据
    },

    effects: {
        // 启停列表
        *findautosoftworkList({ payload: { values, pageNum, pageSize } }, { call, put }) {
            const response = yield call(listPageAutoSoftWord, values, pageNum, pageSize);
            yield put({
                type: 'clearcache',
            });
            if (response.code === 200) {
                yield put({
                    type: 'autosoftworklist',
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


        // 增加数据
        *toaddAutoSoftWork({ payload, autoSoftWork, autoSoftWorkExamine }, { call }) {
            return yield call(addAutoSoftWork, payload, autoSoftWork, autoSoftWorkExamine);
        },
    },

    reducers: {
        clearcache(state) {
            return {
                ...state,
                autosoftworklist: {},
            };
        },

        autosoftworklist(state, action) { // 启停列表
            return {
                ...state,
                autosoftworklist: action.payload,
            };
        },

        softobjectlist(state, action) { // 添加对象的数据
            return {
                ...state,
                softobjectlist: action.payload,
            };
        },
    },
};
