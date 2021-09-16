import { message } from 'antd';
// import router from 'umi/router';
import {
    listPageAutoSoftWord, // 启停列表
    autoSoftObjectList, // 添加对象的数据
    addAutoSoftWork, // 添加
    getAutoSoftWorkDtoById, // 获得作业方案数据
    editAutoSoftWork, // 编辑
    // submitAutoSoftWork, // 提交
} from '../services/api';

export default {
    namespace: 'autosoftwork',

    state: {
        autosoftworklist: {}, // 启停列表
        softobjectlist: {}, // 添加对象的数据
        geteditinfo: {}, // 获得作业方案数据
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
        *toaddAutoSoftWork({ payload: { autoSoftWork, autoSoftWorkExamine } }, { call }) {
            return yield call(addAutoSoftWork, autoSoftWork, autoSoftWorkExamine);
        },

        // 编辑获取作业方案数据
        *togetAutoSoftWorkDtoById({ payload: { workId } }, { call, put }) {
            const response = yield call(getAutoSoftWorkDtoById, workId);
            console.log(response, 'response')
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
        // *tosubmitAutoSoftWork({ payload: { payvalue, buttype, workId } }, { call }) {
        //     console.log(payvalue, buttype, workId)
        //     if (buttype === 'add') { // 新增的提交按钮
        //         const addres = yield call(addAutoSoftWork, payvalue);
        //         console.log(addres, 'addres')
        //         // if (addres.code === 200) {
        //         //     const values = {
        //         //         workId: addres.data.id,
        //         //         workStatus: '3',
        //         //     };
        //         //     const submitres = yield call(submitAutoSoftWork, values);
        //         //     if (submitres.code === 200) {
        //         //         router.push({
        //         //             pathname: `/automation/automatedjob/softstartandstop/softregister`,
        //         //             query: { pathpush: true },
        //         //             state: { cache: false }
        //         //         })
        //         //     } else {
        //         //         message.error(submitres.msg)
        //         //     }
        //         // } else {
        //         //     message.error(addres.msg)
        //         // }
        //     }
        //     // if (buttype === 'edit') { // 编辑的提交按钮
        //     //     const newvalues = {
        //     //         ...payvalue,
        //     //         id: workId
        //     //     };
        //     //     const editres = yield call(submitAutoSoftWork, newvalues);
        //     //     if (editres.code === 200) {
        //     //         const values = {
        //     //             workId,
        //     //             taskStatus: '2',
        //     //         };
        //     //         const submitresaaa = yield call(submitAutoSoftWork, values);
        //     //         if (submitresaaa.code === 200) {
        //     //             router.push({
        //     //                 pathname: `/automation/automatedjob/softstartandstop/softregister`,
        //     //                 // query: { tabid, closecurrent: true }
        //     //                 query: { pathpush: true },
        //     //                 state: { cache: false }
        //     //             })
        //     //         } else {
        //     //             message.error(submitresaaa.msg)
        //     //         }
        //     //     } else {
        //     //         message.error(editres.msg)
        //     //     }
        //     // }
        // },
    },

    reducers: {
        clearcache(state) {
            return {
                ...state,
                autosoftworklist: {},
                geteditinfo: {},
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

        geteditinfo(state, action) {
            return {
                ...state,
                geteditinfo: action.payload,
            };
        },
    },
};
