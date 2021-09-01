import {
    autotaskList,
    addTask,
    editTask,
    deleteTask,
    taskObjectList, // 作业对象数据
    taskScriptList, // 作业脚本数据
  } from '../services/api';
  
  export default {
    namespace: 'autotask',
  
    state: {
        autotasklist: {},
        taskobjectlist: {},
        taskscriptlist: {}
    },
  
    effects: {
      // 获取工作列表
      *findautotaskList({ payload: { values, pageNum, pageSize } }, { call, put }) {
        const response = yield call(autotaskList, values, pageNum, pageSize);
        yield put({
          type: 'autotasklist',
          payload: response.data,
        });
      },

      // 获取作业对象数据
      *findtaskObjectList({ payload: { values, pageNum, pageSize } }, { call, put }) {
        const response = yield call(taskObjectList, values, pageNum, pageSize);
        yield put({
          type: 'taskobjectlist',
          payload: response.data,
        });
      },

      // 获取作业脚本数据
      *findtaskScriptList({ payload: { values, pageNum, pageSize } }, { call, put }) {
        const response = yield call(taskScriptList, values, pageNum, pageSize);
        yield put({
          type: 'taskscriptlist',
          payload: response.data,
        });
      },
  
      // 增加数据
      *toaddTask({ payload }, { call }) {
        return yield call(addTask, payload);
      },
  
      // 更新数据
      *toeditTask({ payload }, { call }) {
        return yield call(editTask, payload);
      },
  
      // 删除数据
      *todeleteTask({ payload: {taskId} }, { call }) {
        return yield call(deleteTask, taskId);
      },
    },
  
    reducers: {
      autotasklist(state, action) {
        return {
          ...state,
          autotasklist: action.payload,
        };
      },

      taskobjectlist(state, action) {
        return {
          ...state,
          taskobjectlist: action.payload,
        };
      },

      taskscriptlist(state, action) {
        return {
          ...state,
          taskscriptlist: action.payload,
        };
      },
    },
  };
  