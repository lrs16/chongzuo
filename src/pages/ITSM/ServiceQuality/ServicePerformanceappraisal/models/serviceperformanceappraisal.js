import router from 'umi/router';
import {
  maintenanceList,
  tobeDealtdata,
  assessRegister,
  saveDirectorReview,
  saveDirectorVerify,
  saveExpertVerify,
  saveProviderConfirm,
  scoreGetTarget1,
  scoreGetTarget2,
  getTaskData
} from '../services/serviceperformanceappraisalapi';

export default {
  namespace:'performanceappraisal',

  state:{
    maintenanceData:[],
    tobeDealtarr:[],
    searchProviderobj:{},
    target1:[],
    target2:[],
    taskData:[]
  },

  effects: {
    *maintenanceList({ payload }, { call,put }) {
      const response = yield call(maintenanceList,payload);
      yield put ({
        type:'maintenanceData',
        payload: response
      })
    },

    //  服务绩效考核待办列表
    *tobeDealtdata({ payload }, { call,put }) {
      const response = yield call(tobeDealtdata,payload);
      yield put ({
        type:'tobeDealtarr',
        payload: response
      })
    },

     // 流转
  *gotoNextprocess({ payload }, { call, put }) {
    const response = yield call(maintenanceList,payload)
    router.push({
      pathname:'/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform'
    })
  },

  //  登记
  *assessRegister({ payload }, { call, put }) {
    console.log('payload: ', payload);
    const response = yield call(assessRegister,payload);
    if(response.code === 200) {
      router.push({
        pathname:'/ITSM/servicequalityassessment/serviceperformanceappraisal/register',
        query: {
          tabid: sessionStorage.getItem('tabid'),
          closecurrent: true,
        }
      });
      const { data: { taskId,assessNo,instanceId } } = response;
      router.push({
        pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform`,
        query: { taskId, mainId: instanceId, orderNo: assessNo, }  // 这里要加mainId
      });
      

    }
  },

  //  保存服务商确认环节信息
  *saveDirectorReview({ payload }, { call, put }) {
    return yield call(saveDirectorReview,payload)
  },
  //  保存业务负责人审核环节信息
  *saveDirectorVerify({ payload }, { call, put }) {
    return yield call(saveDirectorVerify,payload)
  },
  //  保存自动化科专责审核环节信息
  *saveExpertVerify({ payload }, { call, put }) {
    return yield call(saveExpertVerify,payload)
  },
  //  保存服务商确认环节信息
  *saveProviderConfirm({ payload }, { call, put }) {
    return yield call(saveProviderConfirm,payload)
  },

   //  根据考核类型查询一级指标
   *scoreGetTarget1({ payload }, { call,put }) {
    const response = yield call(scoreGetTarget1,payload);
    yield put ({
      type:'target1',
      payload: response
    })
  },
   //  根据考核类型查询二级指标
   *scoreGetTarget2({ payload }, { call,put }) {
    const response = yield call(scoreGetTarget2,payload);
    yield put ({
      type:'target2',
      payload: response
    })
  },

  //  获取环节数据
  *getTaskData({ payload }, { call, put }) {
    const response = yield call(getTaskData,payload);
    yield put({
      type:'taskData',
      payload:response
    })
  }
  },

 

  reducers: {
    maintenanceData(state,action) {
      return {
        ...state,
        maintenanceData: action.payload
      }
    },

    tobeDealtarr(state,action) {
      return {
        ...state,
        tobeDealtarr: action.payload
      }
    },

    target1(state,action) {
      return {
        ...state,
        target1: action.payload.data
      }
    },

    target2(state,action) {
      return {
        ...state,
        target2: action.payload.data
      }
    },

    taskData(state,action) {
      return {
        ...state,
        taskData: action.payload.data
      }
    },

 
  }
}