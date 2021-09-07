import router from 'umi/router';
import {
  message
} from 'antd';
import {
  maintenanceList,
  tobeDealtdata,
  assessRegister,
  saveDirectorReview,
  saveDirectorVerify,
  saveExpertVerify,
  saveProviderConfirm,
  getTaskData,
  assessComplete,
  scorecardSave,
  scorecardId,
  scorecardlistPage,
  scorecardDel,
  scorecardSubmit,
  scorecardExport,
  saveFinallyConfirm,
  hisTask,
  rollback,
  readResource,
  exportTodolist,
  assessDelete,
  assessSearch,
  assessmyAssess,
  exportSearch,
  exportmyAssess,
  scorecardPrint,
  getTypeTree,
} from '../services/serviceperformanceappraisalapi';

export default {
  namespace:'performanceappraisal',

  state:{
    maintenanceData:[],
    tobeDealtarr:[],
    searchProviderobj:{},
    target1:[],
    target2:[],
    taskData:'',
    scorecardetail:[],
    scorecardArr:[],
    hisTaskArr:[],
    imageSource:[],
    assessSearcharr:[],
    assessmyAssessarr:[],
    treeArr:[]
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
    const response = yield call(assessRegister,payload);
    if(response.code === 200) {
      message.success(response.msg);
      router.push({
        pathname:'/ITSM/faultmanage/registration',
        query: {
          tabid: sessionStorage.getItem('tabid'),
          closecurrent: true,
        }
      });
      const { taskId,assessNo,instanceId,taskName  } = response.data;
        router.push({
          pathname: `/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform`,
          query: { 
            assessNo,
            mainId: instanceId,
            taskId,
            orderNo: assessNo,
            tobelist:true
               }  // 这里要加mainId
        });
    }
  },

  //  待办登记
  *tobeassessRegister({ payload }, { call, put }) {
    return yield call(assessRegister,payload)
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

  //  获取环节数据
  *getTaskData({ payload:{ assessNo } }, { call, put }) {
    const response = yield call(getTaskData,assessNo);
    yield put({
      type:'taskData',
      payload:response
    })
  },

  //  流转
  *assessComplete({ payload }, { call, put }) {
    return yield call(assessComplete,payload)
  },

  *scorecardSave({ payload }, { call, put }) {
    const response = yield call(scorecardSave,payload);
    if(response.code === 200) {
      router.push({
        pathname:'/ITSM/servicequalityassessment/creditcard/creditcardregister',
        query:{
          tabid: sessionStorage.getItem('tabid'),
          closecurrent: true,
        }
      });
      const { id,cardNo } = response.data;
      if(cardNo) {
        router.push({
          pathname:'/ITSM/servicequalityassessment/creditcard/creditcardregisterdetail',
          query:{
            id,
            mainId:cardNo,
            orderNo:cardNo,
          }
        })
      }
      
    } else {
      message.error(response.msg)
    }
  },

  *getScorecardetail({ payload }, { call, put }) {
    const response = yield call(scorecardId,payload);
    yield put ({
      type:'scorecardetail',
      payload:response
    })
  },

  *getscorecardlistPage({ payload }, { call, put }) {
    const response = yield call(scorecardlistPage,payload);
    yield put ({
      type:'scorecardArr',
      payload: response
    })
  },

  *scorecardDel({ payload }, { call, put }) {
    return yield call(scorecardDel,payload)
  },

  //  清空积分卡登记数据
  *clear({ payload }, { call, put }) {
    yield put({
      type:'clearparams',
      payload:[]
    })
  },

  //  提交记分卡
  *scorecardSubmit({ payload }, { call, put }) {
    return yield call(scorecardSubmit,payload)
  },

  *scorecardExport({ payload }, { call, put }) {
    return yield call(scorecardExport,payload)
  },

  //  保存绩效确认
  *saveFinallyConfirm({ payload }, { call, put }) {
    return yield call(saveFinallyConfirm,payload)
  },
  //  获取工单流程历史数据
  *hisTask({ payload:{instanceId} }, { call, put }) {
    const response = yield call(hisTask,instanceId);
    yield put({
      type:'hisTaskArr',
      payload:response
    })
  },

  *rollback({ payload }, { call, put }) {
    return yield call(rollback,payload)
  },

  *readResource({ payload }, { call, put }) {
    const response =  yield call(readResource,payload);
    yield put ({
      type:'imageSource',
      payload: response
    })
  },

  //  下载服务绩效待办
  *exportTodolist({ payload }, { call, put }) {
    return yield call(exportTodolist,payload)
  },

  //  清空流程下拉值props数据带来的残留
  // *clearDrop({ payload }, { call, put }) {
  //   yield put({
  //     type:'clearDrop'
  //   })
  // },

  //  删除
  *assessDelete({ payload }, { call, put }) {
    return yield call(assessDelete,payload)
  },

  *assessSearch({ payload }, { call, put }) {
    const response =  yield call(assessSearch,payload);
    yield put ({
      type:'assessSearcharr',
      payload: response
    })
  },

  *assessmyAssess({ payload }, { call, put }) {
    const response =  yield call(assessmyAssess,payload);
    yield put ({
      type:'assessmyAssessarr',
      payload: response
    })
  },
  
  *exportSearch({ payload }, { call, put }) {
    return yield call(exportSearch,payload)
  },

  *exportmyAssess({ payload }, { call, put }) {
    return yield call(exportmyAssess,payload)
  },
  
  *scorecardPrint({ payload }, { call, put }) {
    return yield call(scorecardPrint,payload)
  },
     //  根据考核类型查询指标明细的树
  *getTypeTree({ payload }, { call, put }) {
    yield put ({
      type:'clearTreearr',
      payload: []
    })
    const response = yield call(getTypeTree,payload);
    yield put ({
      type:'treeArr',
      payload:response
    })
  },

  // *clearTreearr({ payload }, { call, put }) {
  //   yield put ({
  //     type:'clearTreearr',
  //     payload: []
  //   })
  // }
  
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
        tobeDealtarr: action.payload.data
      }
    },

    taskData(state,action) {
      return {
        ...state,
        taskData: action.payload.data
      }
    },

    scorecardetail(state,action) {
      return {
        ...state,
        scorecardetail: action.payload.data
      }
    },

    scorecardArr(state,action) {
      return {
        ...state,
        scorecardArr: action.payload.data
      }
    },

    clearparams(state,action) {
      return {
        ...state,
        scorecardetail:[]
      }
    },

    hisTaskArr(state,action) {
      return {
        ...state,
        hisTaskArr:action.payload.data
      }
    },

    imageSource(state,action) {
      return {
        ...state,
        imageSource:action.payload
      }
    },

    assessSearcharr(state,action) {
      return {
        ...state,
        assessSearcharr:action.payload.data
      }
    },

    assessmyAssessarr(state,action) {
      return {
        ...state,
        assessmyAssessarr:action.payload.data
      }
    },

    treeArr(state,action) {
      return {
        ...state,
        treeArr:action.payload.data
      }
    },

    clearTreearr(state,action) {
      return {
        ...state,
        treeArr:[]
      }
    },
 
  }
}