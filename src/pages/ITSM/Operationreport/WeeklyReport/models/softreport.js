import route from 'umi/router';
import {
  maintenanceList,//  从统计获取数据,事件类
  eventtopnList,
  eventServiceList,
  eventselfhandleList,
  getOperationQueryList,  //  作业计划
  queryfaultSearchList1,
  addReport,
  saveSoftreport,
  openReport,
  queryList,
  deleteAll,
  saveComputerRoom,
  saveDataBase,
  reportExport,
  saveOther
} from '../services/softreportapi';

export default {
  namespace:'softreport',

  state: {
    maintenanceArr:[], // 事件统计
    ordertopnArr:[],
    maintenanceService:[],
    eventServicearr:[],
    soluteArr:[],
    addMainid:[],
    lastweekHomeworklist:[],
    nextweekHomeworklist:[],
    openReportlist:[],
    queryOrderlist:[],
    faultQueryList: [], // 故障查询列表
  },

  effects: {  
    //  打开新建获取一个mainId
    *queryList({payload},{call,put}) {
      const response = yield call(queryList,payload);
      yield put({
        type:'queryOrderlist',
        payload:response
      })
    },
    //  保存软件
    *saveSoft({payload},{call,put}) {
      if(payload.status) {
        const response = yield call(addReport);
        if(response.code === 200) {
          const mainId = response.id;
          const saveData = payload;
          saveData.mainId = mainId;
          const type = payload.reporttype;
          const saveresponse = yield call(saveSoftreport,saveData);
          if(saveresponse.code === 200) {
            route.push({
              pathname: `/ITSM/operationreport/weeklyreport/softreport/`,
              query: { 
                tabid: sessionStorage.getItem('tabid'),
                 closecurrent: true
                 }
            })
            route.push({
              pathname: `/ITSM/operationreport/weeklyreport/detailSoft/`,
              query: {
                reporttype: type,
                mainId,
              },
              state: {}
            })
          }
        }
      } else {
        return yield call(saveSoftreport,payload)
      }
      // return []
    },

    //  上传附件保存，解决数据丢失问题
    *uploadSave({payload},{call,put}) {
      const response = yield call(saveSoftreport,payload);
      if(response.code === 200) {
        const editStatus = 'edit';
        const id = payload.mainId;
        return yield call(openReport,editStatus,id);
      }
    },

    //  打开待办
    *openReport({payload:{editStatus,id}},{call,put}) {
      const response = yield call(openReport,editStatus,id);
      yield put ({
        type:'openReportlist',
        payload:response
      })
    },

    //  粘贴
    *pasteReport({payload:{editStatus,id}},{call,put}) {
      return yield call(openReport,editStatus,id);
    },



      //  保存机房
    *saveComputer({payload},{call,put}) {
        console.log('payload: ', payload);
        if(payload.status) {
          const response = yield call(addReport);
          if(response.code === 200) {
            const mainId = response.id;
            const saveData = payload;
            saveData.mainId = mainId;
            delete saveData.status;
            const type = payload.reporttype;
            const saveresponse = yield call(saveComputerRoom,saveData);
            if(saveresponse.code === 200) {
              route.push({
                pathname: `/ITSM/operationreport/weeklyreport/computerroomreportdetail`,
                query: {
                  reporttype: type,
                  mainId,
                },
              })
            }
          }
        } else {
          return yield call(saveComputerRoom,payload)
        }
        // return []
    },
    
    //  保存数据库
    *saveDataBase({payload},{call,put}) {
      if(payload.status) {
        const response = yield call(addReport);
        if(response.code === 200) {
          const mainId = response.id;
          const saveData = payload;
          saveData.mainId = mainId;
          delete saveData.status;
          const type = payload.reporttype;
          const saveresponse = yield call(saveDataBase,saveData);
          if(saveresponse.code === 200) {
            route.push({
              pathname: `/ITSM/operationreport/weeklyreport/databasereportdetail`,
              query: {
                reporttype: type,
                mainId,
              },
            })
          }
        }
      } else {
        return yield call(saveDataBase,payload)
      }
      // return []
  },
    //  保存其他
    *saveOther({payload},{call,put}) {
      if(payload.status) {
        const response = yield call(addReport);
        if(response.code === 200) {
          const mainId = response.id;
          const saveData = payload;
          saveData.mainId = mainId;
          delete saveData.status;
          const type = payload.reporttype;
          const saveresponse = yield call(saveOther,saveData);
          if(saveresponse.code === 200) {
            route.push({
              pathname: `/ITSM/operationreport/weeklyreport/otherreportdetail`,
              query: {
                reporttype: type,
                mainId,
              },
            })
          }
        }
      } else {
        return yield call(saveOther,payload)
      }
      // return []
  },

    //  删除
    *deleteAll({payload},{call,put}) {
      return yield call(deleteAll,payload)
    },

      //  从事件统计获取数据
    // 运维分类情况统计列表
    *fetchMaintenancelist({ payload }, { call, put }) {
      const response = yield call(maintenanceList,payload);
      yield put ({
        type: 'maintenanceArr',
        payload: response
      })
    },

      // 工单TOPN统计列表
      *fetchordertopnList({ payload }, { call, put }) {
      const response = yield call(eventtopnList,payload);
      yield put ({
        type: 'ordertopnArr',
        payload: response
      })
    },
    
    // 运维服务指标统计列表
    *fetcheventServiceList({ payload }, { call, put }) {
      const response = yield call(eventServiceList,payload);
      yield put ({
        type: 'eventServicearr',
        payload: response
      })
    },

    // 一线事件解决情况列表
    *fetchSelfHandleList({ payload }, { call, put }) {
      const response = yield call(eventselfhandleList,payload);
      yield put ({
        type: 'soluteArr',
        payload: response
      })
    },

    //  七、上周作业完成情况--表格
    *lastweekHomework({ payload }, { call,put }) {
      const response = yield call(getOperationQueryList,payload);
      yield put({
        type:'lastweekHomeworklist',
        payload: response
      })
    },
    //  七、下周作业完成情况--表格
    *nextweekHomework({ payload }, { call,put }) {
      const response = yield call(getOperationQueryList,payload);
      yield put({
        type:'nextweekHomeworklist',
        payload: response
      })
    },

    // 获取故障查询列表数据
    *getfaultQueryList({ payload }, { call, put }) {
    const response = yield call(queryfaultSearchList1, payload);
    yield put({
      type: 'faultQueryList',
      payload: response,
    });
  },

  //  下载word
  *exportWord({payload:{mainId}},{call,put}) {
    return yield call(reportExport,mainId)
  }
   
  },

  reducers:{
    queryOrderlist(state,action) {
      return {
        ...state,
        queryOrderlist:action.payload.data
      }
    },

    openReportlist(state,action) {
      return {
        ...state,
        openReportlist:action.payload
      }
    },

      // 工单TOPN统计列表
    ordertopnArr(state, action) {
      return {
        ...state,
        ordertopnArr: action.payload.data
      }
    },

    // 运维分类情况统计列表
    maintenanceArr(state, action) {
      return {
        ...state,
        maintenanceArr: action.payload
      }
    },
     // 一线解决统计列表
    soluteArr(state, action) {
      return {
        ...state,
        soluteArr: action.payload.data
      }
    },

      // 维服务指标统计列表
    eventServicearr(state, action) {
      return {
        ...state,
        maintenanceService: action.payload.data
      }
    },

    lastweekHomeworklist(state,action) {
      return {
        ...state,
        lastweekHomeworklist: action.payload.data
      }
    },

    nextweekHomeworklist(state,action) {
      return {
        ...state,
        nextweekHomeworklist: action.payload.data
      }
    },

    // 故障查询列表
    faultQueryList(state, action) {
    return {
      ...state,
      faultQueryList: action.payload.data,
    };
  },
  }
}