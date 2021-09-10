import { message } from 'antd';
import router from 'umi/router';
import {
  autotaskList,
  addTask,
  getAutoTaskById, // 获得作业方案数据
  editTask, // 编辑
  submitTask, // 提交
  deleteTask,
  taskObjectList, // 作业对象数据
  taskScriptList, // 作业脚本数据
  getUseTaskObjectandAgent, // 获取选中的数据
  addExamineTask, // 审批作业方案 接口增加记录
  updExamineTask, // 审批作业方案 接口编辑记录
  getexamineTaskList, // 审批作业方案历史表
} from '../services/api';

export default {
  namespace: 'autotask',

  state: {
    autotasklist: {},
    taskobjectlist: {},
    taskscriptlist: {},
    // getusetaskobjectandagentlist: [], // 获取选中的数据
    editinfo: {},
  },

  effects: {
    // 获取工作列表
    *findautotaskList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(autotaskList, values, pageNum, pageSize);
      yield put({
        type: 'clearcache',
      });
      if (response.code === 200) {
        yield put({
          type: 'autotasklist',
          payload: response.data,
        });
      } else {
        message.error(response.msg)
      }
    },

    // 获取作业对象全部数据
    *findtaskObjectList({ payload: { payvalue, pageNum, pageSize, id } }, { call, put }) {
      const newvalues = {
        ...payvalue,
        id,
      };
      const response = yield call(taskObjectList, newvalues, pageNum, pageSize);
      yield put({
        type: 'taskobjectlist',
        payload: response.data,
      });
    },

    // 获取作业脚本全部数据
    *findtaskScriptList({ payload: { payvalue, pageNum, pageSize, id } }, { call, put }) {
      const newvalues = {
        ...payvalue,
        id,
      };
      const response = yield call(taskScriptList, newvalues, pageNum, pageSize);
      yield put({
        type: 'taskscriptlist',
        payload: response.data,
      });
    },

    // 获取作业对象单个数据
    *findtaskObjectList1({ payload: { payvalue, pageNum, pageSize, id } }, { call }) {
      const newvalues = {
        ...payvalue,
        id,
      };
      return yield call(taskObjectList, newvalues, pageNum, pageSize);
    },

    // 获取作业脚本单个数据
    *findtaskScriptList1({ payload: { pageNum, pageSize, id } }, { call }) {
      const newvalues = {
        scriptName: "",
        scriptType: "",
        scriptSource: "",
        scriptCont: "",
        scriptArgs: "",
        scriptStatus: "",
        id,
      };
      return yield call(taskScriptList, newvalues, pageNum, pageSize);
    },

    *togetUseTaskObjectandAgent({ payload: { taskId } }, { call }) {
      return yield call(getUseTaskObjectandAgent, taskId);
      // yield put({
      //   type: 'getusetaskobjectandagentlist',
      //   payload: response.data,
      // });
    },

    // 增加数据
    *toaddTask({ payload }, { call }) {
      return yield call(addTask, payload);
    },

    // 编辑获取作业方案数据
    *togetAutoTaskById({ payload: { taskId } }, { call, put }) {
      const response = yield call(getAutoTaskById, taskId);
      yield put({
        type: 'clearcache',
      });
      if (response.code === 200) {
        yield put({
          type: 'editinfo',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },

    // 审批作业方案历史表
    *togetexamineTaskList({ payload: { taskId } }, { call, put }) {
      const response = yield call(getexamineTaskList, taskId);
      if (response.code === 200) {
        yield put({
          type: 'editcheckinfo',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },

    // 编辑
    *toeditTask({ payload }, { call }) {
      return yield call(editTask, payload);
    },

    // 提交
    *tosubmitTask({ payload: { payvalue, buttype, taskId } }, { call }) {
      // const tabid = sessionStorage.getItem('tabid');
      if (buttype === 'add') { // 新增的提交按钮
        const addres = yield call(addTask, payvalue);
        if (addres.code === 200) {
          const values = {
            taskId: addres.data.id,
            taskStatus: '2',
          };
          const submitres = yield call(submitTask, values);
          if (submitres.code === 200) {
            router.push({
              pathname: `/automation/automatedjob/jobmanagement/jobconfig`,
              query: { pathpush: true },
              state: { cache: false }
            })
          } else {
            message.error(submitres.msg)
          }
        } else {
          message.error(addres.msg)
        }
      }
      if (buttype === 'edit') { // 编辑的提交按钮
        const newvalues = {
          ...payvalue,
          id: taskId
        };
        const editres = yield call(editTask, newvalues);
        if (editres.code === 200) {
          const values = {
            taskId,
            taskStatus: '2',
          };
          const submitresaaa = yield call(submitTask, values);
          if (submitresaaa.code === 200) {
            router.push({
              pathname: `/automation/automatedjob/jobmanagement/jobconfig`,
              // query: { tabid, closecurrent: true }
              query: { pathpush: true },
              state: { cache: false }
            })
          } else {
            message.error(submitresaaa.msg)
          }
        } else {
          message.error(editres.msg)
        }
      }
    },

    // 删除数据
    *todeleteTask({ payload: { taskId } }, { call }) {
      return yield call(deleteTask, taskId);
    },

    // 审批作业方案 接口增加记录
    *toaddexamineTask({ payload }, { call }) {
      return yield call(addExamineTask, payload);
    },

    // 审批作业方案 接口编辑记录
    *toupdExamineTask({ payload }, { call }) {
      return yield call(updExamineTask, payload);
    },

    // 审核提交
    *toexaminesubmitTask({ payload: { taskId, taskStatus } }, { call }) {
      const values = {
        taskId,
        taskStatus,
      };
      return yield call(submitTask, values);
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        autotasklist: {},
        editinfo: {},
        editcheckinfo: {},
      };
    },

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

    // getusetaskobjectandagentlist(state, action) {
    //   return {
    //     ...state,
    //     getusetaskobjectandagentlist: action.payload,
    //   };
    // },

    editinfo(state, action) {
      return {
        ...state,
        editinfo: action.payload,
      };
    },

    editcheckinfo(state, action) {
      return {
        ...state,
        editcheckinfo: action.payload,
      };
    },
  },
};
