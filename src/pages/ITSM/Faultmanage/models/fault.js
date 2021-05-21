import router from 'umi/router';
import { message } from 'antd';
import {
  startandsave,
  queryfaultTodoList, // 故障待办list
  queryfaultSearchList, // 故障查询list
  queryFaultDetailList, // 故障明细list
  queryfaultsearchdetailslist, // 故障查询list详情页
  // 真实接口
  queryTroubleGetNewno, // 获取新的故障编号
  queryCurrUserInfo, // 获取登录用户信息
  ITSMUser,
  querySaveUserId, // 保存用户数据携带的id 故障流程启动
  querySavefaultRegister, // 故障登记保存
  queryfaultTodoList1, // 故障待办列表
  querySearchfaultTodoList1, // 故障待办列表 查询
  querydownload, // 故障待办列表 导出
  querydownload1, // 故障查询列表 导出
  queryfaultTodoDetailEdit, // 故障待办详情页--编辑
  deleteInstance, // 删除操作！
  queryRollBack, // 回退操作！
  queryTroubleHandleOrder, // 接单操作
  toSelectTodoperson, // 提交流程至下一节点前是否需要选择待办人 (流转前)
  submitProToNextNode, // 根据待办id提交流程至下一节点
  getFlowImage, // 流程图
  getFlowLog, // 流程日志
  queryfaultSearchList1, // 故障查询列表
  queryTosearchfaultSearchList1, // 故障查询列表 查询
  queryOrderDetail, // 故障查询列表详情页
  SearchUsers, // 获取流转，转单 系统所有的用户
  querkeyVal, // 数据字典
  queryFaultdictVal, // 数据字典
  downFileToZip,    // 附件下载
} from '../services/api';

export default {
  namespace: 'fault',

  state: {
    todolist: [],
    faultquerydata: [],
    getfaultBreakdownList: [],
    // 真实接口
    newno: '', // 获取新的故障编号
    curruserinfo: [], // 获取登录用户信息
    userinfo: '',
    saveuserid: '', // 用户数据携带的id
    saveuserid1: '',

    faultTodoList: [], // 故障待办列表
    tododetailslist: [], // 故障待办详情数据--编辑
    flowimageview: '', // 流程图
    flowlog: '', // 日志

    faultQueryList: [], // 故障查询列表
    querydetailslist: [], // 故障查询列表详情
  },

  effects: {
    // 查询 获取流转，转单 系统所有的用户
    *search({ payload }, { call, put }) {
      const response = yield call(SearchUsers, payload);
      yield put({
        type: 'usermanage',
        payload: response,
      });
    },

    *fetchfaultTodoList({ payload }, { call, put }) {
      // 故障待办list
      const response = yield call(queryfaultTodoList, payload);
      yield put({
        type: 'show',
        payload: response.data,
      });
    },

    *fetchfaultSearchList({ payload }, { call, put }) {
      // 故障查询list
      const response = yield call(queryfaultSearchList, payload);
      yield put({
        type: 'faultquerydata',
        payload: response.data,
      });
    },

    *fetchfaultBreakdownList({ payload }, { call, put }) {
      // 故障明细表list
      const response = yield call(queryFaultDetailList, payload);
      yield put({
        type: 'getfaultBreakdownList',
        payload: response.data,
      });
    },

    *fetchfaultsearchdetailslist({ payload }, { call, put }) {
      // 故障查询list详情页
      const response = yield call(queryfaultsearchdetailslist, payload);
      yield put({
        type: 'getfaultsearchdetailslist',
        payload: response,
      });
    },

    // 故障管理真实接口

    //  获取新的编号
    *getFaultRegisterNo(_, { call, put }) {
      const response = yield call(queryTroubleGetNewno);
      yield put({
        type: 'getNewno',
        payload: response,
      });
    },

    // 获取登录用户信息
    *getCurrUserInfo(_, { call, put }) {
      const response = yield call(queryCurrUserInfo);
      yield put({
        type: 'getcurruserinfo',
        payload: response,
      });
    },

    *fetchuser(_, { call, put }) {
      const response = yield call(ITSMUser);
      yield put({
        type: 'saveuser',
        payload: response.data,
      });
    },

    // 保存用户数据携带的id 故障流程启动
    *getSaveUserId({ payload: { formValues } }, { call, put }) {
      const response = yield call(startandsave, formValues); // querySavefaultRegister登记保存
      // 保存成功后的操作
      if (response.code === 200) {
        // 用户数据携带的id 跳转待办详情页
        message.success(response.msg);
        router.push({
          pathname: `/ITSM/faultmanage/registration`,
          query: { tabid: sessionStorage.getItem('tabid'), closetab: true }
        })
        const { flowInstId, troubleNo, flowTaskId, flowNodeName } = response;
        router.push({
          pathname: `/ITSM/faultmanage/todolist/record`,
          query: { id: flowTaskId, mainId: flowInstId, orderNo: troubleNo, },
          paneKey: flowNodeName,
        });
      } else {
        message.error(response.msg);
      }
    },

    *getfromsave({ payload: { formValues } }, { call }) {
      // 编辑页 保存功能
      return yield call(querySavefaultRegister, formValues);
    },

    // 获取故障待办列表数据
    *getfaultTodoList({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(queryfaultTodoList1, current, pageSize);
      yield put({
        type: 'faultTodoList',
        payload: response,
      });
    },

    // 获取故障待办列表数据(查询)
    *getSearchfaultTodo({ payload: { current, pageSize, values } }, { call, put }) {
      const response = yield call(querySearchfaultTodoList1, current, pageSize, values);
      yield put({
        type: 'faultTodoList',
        payload: response,
      });
    },

    // 故障待办列表数据 下载
    *faultTododownload({ payload: { current, pageSize, values } }, { call }) {
      return yield call(querydownload, current, pageSize, values);
    },

    // 故障查询列表数据 下载
    *faultQuerydownload({ payload }, { call }) {
      return yield call(querydownload1, payload);
    },

    //  故障待办详情页--编辑
    *getfaultTodoDetailData({ payload: { id } }, { call, put }) {
      const response = yield call(queryfaultTodoDetailEdit, id);
      yield put({
        type: 'detailslist',
        payload: response,
      });
    },

    // 删除操作
    *remove({ payload: { id } }, { call }) {
      return yield call(deleteInstance, id);
    },

    //  回退
    *rollback({ payload }, { call }) {
      return yield call(queryRollBack, payload);
    },

    // 接单
    *troubleHandleOrder({ payload: { taskId } }, { call }) {
      return yield call(queryTroubleHandleOrder, taskId);
    },

    // 提交流程至下一节点前是否需要选择待办人 (流转前)
    *getToSelectTodoperson({ payload: { taskId } }, { call }) {
      return yield call(toSelectTodoperson, taskId);
    },

    // // 根据待办id提交流程至下一节点（流转）
    *getSubmitProToNextNode({ payload: { taskId, result, userIds } }, { call }) {
      return yield call(submitProToNextNode, taskId, result, userIds);
    },

    *getSaveUserId1({ payload: { formValues } }, { call, put }) {
      // 故障登记页流转操作
      const response = yield call(querySaveUserId);
      // console.log(response, '故障流程启动！！');
      yield put({
        type: 'getsaveuserid',
        payload: response,
      });
      // 故障流程启动成功时，提交表单数据
      const { flowTaskId } = response; // 用户数据携带的id
      const saveInfo = formValues;
      saveInfo.taskId = flowTaskId;
      if (response.code === 200) {
        const resRegister = yield call(querySavefaultRegister, saveInfo); // querySavefaultRegister登记保存
        // 保存成功后的操作
        if (resRegister.code === 200) {
          const result = 1;
          const taskId = flowTaskId;
          const tonext = yield call(submitProToNextNode, taskId, result);
          if (tonext.code === 200) {
            message.success(tonext.msg);
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
            });
          }
        } else {
          message.error(resRegister.msg);
        }
      }
    },

    //  获取工作流流程图
    *fetchGetFlowImage({ payload: { id } }, { call, put }) {
      const response = yield call(getFlowImage, id);
      yield put({
        type: 'flowimageview',
        payload: response,
      });
    },

    //  获取日志
    *fetchGetFlowLog({ payload: { id } }, { call, put }) {
      const response = yield call(getFlowLog, id);
      yield put({
        type: 'flowlog',
        payload: response,
      });
    },

    // 获取故障查询列表数据
    *getfaultQueryList({ payload }, { call, put }) {
      const response = yield call(queryfaultSearchList1, payload);
      yield put({
        type: 'faultQueryList',
        payload: response,
      });
    },

    // 获取故障查询列表数据 查询
    *getTosearchfaultSearch({ payload }, { call, put }) {
      const response = yield call(queryTosearchfaultSearchList1, payload);
      yield put({
        type: 'faultQueryList',
        payload: response,
      });
    },

    *getfaultQueryDetailData({ payload: { id } }, { call, put }) {
      const response = yield call(queryOrderDetail, id);
      yield put({
        type: 'querydetailslist',
        payload: response,
      });
    },

    *keyval({ payload: { dictModule, dictType } }, { call }) {
      // 数据字典数据
      return yield call(querkeyVal, dictModule, dictType);
    },

    *faultdictVal({ payload: { id } }, { call }) {
      // 数据字典数据1]
      return yield call(queryFaultdictVal, id);
    },

    *downloadzip({ payload: { id } }, { call }) {
      // 数据字典数据1]
      return yield call(downFileToZip, id);
    },

  },

  reducers: {
    usermanage(state, { payload }) {
      // 查询 获取流转，转单 系统所有的用户
      return {
        ...state,
        ...payload,
      };
    },

    show(state, action) {
      return {
        ...state,
        todolist: action.payload,
      };
    },

    faultquerydata(state, action) {
      return {
        ...state,
        faultquerydata: action.payload,
      };
    },

    getfaultBreakdownList(state, action) {
      // 故障明细表list
      return {
        ...state,
        getfaultBreakdownList: action.payload,
      };
    },

    getfaultsearchdetailslist(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    // 真实接口

    //  获取新的故障编号
    getNewno(state, action) {
      return {
        ...state,
        newno: action.payload,
      };
    },

    // 获取登录用户信息
    getcurruserinfo(state, action) {
      return {
        ...state,
        curruserinfo: action.payload.data,
      };
    },

    saveuser(state, action) {
      return {
        ...state,
        userinfo: action.payload,
      };
    },

    // 用户数据携带的id
    getsaveuserid(state, action) {
      return {
        ...state,
        saveuserid: action.payload,
      };
    },

    // 故障待办列表
    faultTodoList(state, action) {
      return {
        ...state,
        faultTodoList: action.payload.data,
      };
    },

    // 故障待办详情--编辑
    detailslist(state, action) {
      return {
        ...state,
        tododetailslist: action.payload,
      };
    },

    //  流程图
    flowimageview(state, action) {
      return {
        ...state,
        flowimageview: action.payload,
      };
    },
    //  日志
    flowlog(state, action) {
      return {
        ...state,
        flowlog: action.payload,
      };
    },

    // 故障查询列表
    faultQueryList(state, action) {
      return {
        ...state,
        faultQueryList: action.payload.data,
      };
    },

    querydetailslist(state, action) {
      // 故障查询列表详情
      return {
        ...state,
        querydetailslist: action.payload,
      };
    },
  },
};
