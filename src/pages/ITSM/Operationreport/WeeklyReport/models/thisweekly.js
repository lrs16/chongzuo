import {
  maintenanceData,
  developmentData,
  submitdevelopmentData,
  serviceCompletion,
  serviceCompletiontwo,
  serviceCompletionthree,
  thisWeekitsm,
  completionfirstlyTable,
  completionsecondTable,
  remainingDefects,
  lastweekHomework,
  nextweekHomework
} from '../services/softreportapi';

export default {
  namespace: 'thisweekly',

  state: {
    maintenanceList:[],
    developmentList:[],
    submitdevelopmentlist:[],
    serviceCompletionlist:[],
    serviceCompletionsecondlist:[],
    serviceCompletionthreelist:[],
    thisWeekitsmlist:[],
    softCompletionlist:[],
    completionsecondTablelist:[],
    remainingDefectslist:[],
    lastweekHomeworklist:[],
    nextweekHomeworklist:[]
  },

  effects: {
    //  本周运维情况综述表格数据
    *fetchMaintance({ payload }, { call,put }) {
      const response = yield call(maintenanceData );
      yield put({
        type:'maintenanceList',
        payload: response
      })
    },

    //  常规运维工作开展情况第一个表格
    *developmentListdata({ payload }, { call,put }) {
      const response = yield call(developmentData);
      yield put({
        type:'developmentList',
        payload: response
      })
    },

    //  常规运维工作开展情况第二个表格
    *submitdevelopmentData({ payload }, { call,put }) {
      const response = yield call(submitdevelopmentData);
      yield put({
        type:'submitdevelopmentlist',
        payload: response
      })
    },

       //  三、运维服务指标完成情况---第一个表格
       *serviceCompletionone({ payload }, { call,put }) {
        const response = yield call(serviceCompletion);
        yield put({
          type:'serviceCompletionlist',
          payload: response
        })
      },
       //  三、运维服务指标完成情况---第二个表格
       *serviceCompletiontwo({ payload }, { call,put }) {
        const response = yield call(serviceCompletiontwo);
        yield put({
          type:'serviceCompletionsecondlist',
          payload: response
        })
      },
       //  三、运维服务指标完成情况---第三个表格
       *serviceCompletionthree({ payload }, { call,put }) {
        const response = yield call(serviceCompletionthree);
        yield put({
          type:'serviceCompletionthreelist',
          payload: response
        })
      },
       //  四、本周事件、问题及故障表格数据
       *thisWeekitsm({ payload }, { call,put }) {
        const response = yield call(thisWeekitsm);
        yield put({
          type:'thisWeekitsmlist',
          payload: response
        })
      },

        //  五、软件作业完成情况第一个表格
        *completionfirstlyTable({ payload }, { call,put }) {
          const response = yield call(completionfirstlyTable);
          yield put({
            type:'softCompletionlist',
            payload: response
          })
        },
        //  五、软件作业完成情况第二个表格
        *completionsecondTable({ payload }, { call,put }) {
          const response = yield call(completionsecondTable);
          yield put({
            type:'completionsecondTablelist',
            payload: response
          })
        },

        //  六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件）
        *remainingDefects({ payload }, { call,put }) {
          const response = yield call(remainingDefects);
          yield put({
            type:'remainingDefectslist',
            payload: response
          })
        },

        //  七、上周作业完成情况--表格
        *lastweekHomework({ payload }, { call,put }) {
          const response = yield call(lastweekHomework);
          yield put({
            type:'lastweekHomeworklist',
            payload: response
          })
        },
        //  七、下周作业完成情况--表格
        *nextweekHomework({ payload }, { call,put }) {
          const response = yield call(nextweekHomework);
          yield put({
            type:'nextweekHomeworklist',
            payload: response
          })
        },
  },
     

  reducers: {
    maintenanceList(state,action) {
      return {
        ...state,
        maintenanceList: action.payload
      }
    },

    developmentList(state,action) {
      return {
        ...state,
        developmentList: action.payload
      }
    },

    submitdevelopmentlist(state,action) {
      return {
        ...state,
        submitdevelopmentlist: action.payload
      }
    },

    serviceCompletionlist(state,action) {
      return {
        ...state,
        serviceCompletionlist: action.payload
      }
    },

    serviceCompletionsecondlist(state,action) {
      return {
        ...state,
        serviceCompletionsecondlist: action.payload
      }
    },

    serviceCompletionthreelist(state,action) {
      return {
        ...state,
        serviceCompletionthreelist: action.payload
      }
    },

    thisWeekitsmlist(state,action) {
      return {
        ...state,
        thisWeekitsmlist: action.payload
      }
    },

    softCompletionlist(state,action) {
      return {
        ...state,
        softCompletionlist: action.payload
      }
    },

    completionsecondTablelist(state,action) {
      return {
        ...state,
        completionsecondTablelist: action.payload
      }
    },

    remainingDefectslist(state,action) {
      return {
        ...state,
        remainingDefectslist: action.payload
      }
    },

    lastweekHomeworklist(state,action) {
      return {
        ...state,
        lastweekHomeworklist: action.payload
      }
    },

    nextweekHomeworklist(state,action) {
      return {
        ...state,
        nextweekHomeworklist: action.payload
      }
    },
  },
};
