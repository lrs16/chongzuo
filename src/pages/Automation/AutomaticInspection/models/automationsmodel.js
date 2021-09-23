import {
    taskObjectList, // 添加对象的数据
} from '../services/api';

export default {
    namespace: 'automation',

    state: {
        list: {}
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

    },

    reducers: {
        taskobjectlist(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
    },
};
