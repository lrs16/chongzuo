import {
    querySearchDropdownValue, // 数据字典list表数据
    querySearchDropdownValue1, // 数据字典查询
    removeDict,
    addDict,
    editeDict
} from '../services/api';

export default {
    namespace: 'umpsdropdown',

    state: {
        list: [],
    },

    effects: {
        // 数据字典list表数据
        *getSearchDropdownValueList({ payload: { page, limit, bodyParams } }, { call, put }) {
            const response = yield call(querySearchDropdownValue, page, limit, bodyParams);
            yield put({
                type: 'dropdownvaluelist',
                payload: response
            }
            )
        },

        // 数据字典查询
        *search({ payload }, { call, put }) {
            const response = yield call(querySearchDropdownValue1, payload);
            yield put({
                type: 'dropdownvaluelist',
                payload: response,
            });
        },
        
        // 添加或编辑
        *fetchAdd({ payload }, { call }) {
           return yield call(addDict, payload);
        },

        *edite({ payload }, { call }) {
            return yield call(editeDict, payload);
        },

        *remove({ payload: { id } }, { call }) {
            return yield call(removeDict, id);
        },
    },

    reducers: {
        dropdownvaluelist(state, action) {
            return {
                ...state,
                list: action.payload.data,
            }
        },
    },
};
