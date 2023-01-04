import route from 'umi/router';
import {
message
}from 'antd';

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
  saveOther,
  getContentRow,
  getPatrolAndExamineList,
  // 机房保存
  getTroubleByComputerRoom,
  saveComputerRoomByMonth,
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
    queryOrderlist:[],
    faultQueryList: [], // 已修复
    nofaultQueryList: [], // 未修复
    contentRowlist:[],
    patrolAndExamineArr:[],
    computerroom:{},
    openReportlist:{},
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
      yield put ({
        type:'clearcache',
        payload:[]
      })
      if(payload.status) {
        const response = yield call(addReport);
        if(response.code === 200) {
          const mainId = response.id;
          const saveData = payload;
          saveData.mainId = mainId;
          const type = payload.reporttype;
          const saveresponse = yield call(saveSoftreport,saveData);
          if(saveresponse.code === 200) {
            if(type === 'week') {
              route.push({
                pathname: `/ITSM/operationreport/weeklyreport/softreport`,
                query: { 
                  tabid: sessionStorage.getItem('tabid'),
                   closecurrent: true
                   }
              })
              route.push({
                pathname: `/ITSM/operationreport/weeklyreport/detailSoft`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
                state: {}
              })
            } else {
              route.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthsoftreport`,
                query: { 
                  tabid: sessionStorage.getItem('tabid'),
                   closecurrent: true
                   }
              })
              route.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthdetailSoft`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
                state: {}
              })
            }
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
    
    //  
    *newopenReport({payload:{editStatus,id}},{call,put}) {
      return yield call(openReport,editStatus,id);
    },

    //  粘贴
    *pasteReport({payload:{editStatus,id}},{call,put}) {
      yield put({
        type:'clearAutoget',
        payload:[]
      })
      return yield call(openReport,editStatus,id);
    },

      //  保存机房
    *saveComputer({payload},{call,put}) {
      yield put ({
        type:'clearcache',
        payload:[]
      })
        if(payload.status) {
          const response = yield call(addReport);
          const tabid = sessionStorage.getItem('tabid')
          if(response.code === 200) {
            const mainId = response.id;
            const saveData = payload;
            saveData.mainId = mainId;
            delete saveData.status;
            const type = payload.reporttype;
            const saveresponse = yield call(saveComputerRoom,saveData);
            if(saveresponse.code === 200) {
              if(type === 'week') {
                route.push({
                  pathname: `/ITSM/operationreport/weeklyreport/computerroomreportdetail`,
                  query: {
                    reporttype: type,
                    mainId:mainId.toString(),
                    orderNo:mainId.toString(),
                  },
                  state: {closetabid: tabid},
                })
              } else {
                route.push({
                  pathname: `/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail`,
                  query: {
                    reporttype: type,
                    mainId:mainId.toString(),
                    orderNo:mainId.toString(),
                  },
                  state: {closetabid: tabid},
                })
              }
              
            }
          }
        } else {
          return yield call(saveComputerRoom,payload)
        }
    },
    
    //  保存数据库
    *saveDataBase({payload},{call,put}) {
      yield put ({
        type:'clearcache',
        payload:[]
      })
      if(payload.status) {
        const response = yield call(addReport);
        if(response.code === 200) {
          const mainId = response.id;
          const saveData = payload;
          saveData.mainId = mainId;
          delete saveData.status;
          const type = payload.reporttype;
          const saveresponse = yield call(saveDataBase,saveData);
          const tabid = sessionStorage.getItem('tabid')
          if(saveresponse.code === 200) {
            if(type === 'week') {
              route.push({
                pathname: `/ITSM/operationreport/weeklyreport/databasereportdetail`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
                state: {closetabid: tabid},
              })
              message.success(response.msg)
            } else {
              route.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthdatabasereportdetail`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
                state: {closetabid: tabid},
              })
              message.success(response.msg)
            }
          }
        }
      } else {
        return yield call(saveDataBase,payload)
      }
      // return []
  },
    //  保存其他
    *saveOther({payload},{call,put}) {
      yield put ({
        type:'clearcache',
        payload:[]
      })
      if(payload.status) {
        const response = yield call(addReport);
        const tabid = sessionStorage.getItem('tabid')
        if(response.code === 200) {
          const mainId = response.id;
          const saveData = payload;
          saveData.mainId = mainId;
          delete saveData.status;
          const type = payload.reporttype;
          const saveresponse = yield call(saveOther,saveData);
          if(saveresponse.code === 200) {
            if(type === 'week') {
              route.push({
                pathname: `/ITSM/operationreport/weeklyreport/otherreportdetail`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
                state: {closetabid: tabid},
              })
            } else {
              route.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthotherreportdetail`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
                state: {closetabid: tabid},
              })
            }
           
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
      const result = JSON.parse(JSON.stringify(response.data)
      .replace(/index/g, 'field1')
      .replace(/first_object/g, 'field2')
      .replace(/second_object/g, 'field3')
      .replace(/last_num/g, 'field4')
      .replace(/now_num/g, 'field5')
      .replace(/points_count/g, 'field6'));
      yield put ({
        type: 'maintenanceArr',
        payload: result
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
      const result = JSON.parse(JSON.stringify(response.data)
      .replace(/name/g, 'field2')
      .replace(/last/g, 'field3')
      .replace(/now/g, 'field4')
      .replace(/points/g, 'field5')
      .replace(/remark/g, 'field6')
    );
      yield put ({
        type: 'maintenanceService',
        payload: result
      })
    },

    // 一线事件解决情况列表
    *fetchSelfHandleList({ payload }, { call, put }) {
      const response = yield call(eventselfhandleList,payload);
      const result = JSON.parse(JSON.stringify(response.data)
      .replace(/not_selfhandle/g, 'field1')
      .replace(/is_selfhandle/g, 'field2')
      .replace(/points/g, 'field3'));
      yield put ({
        type: 'soluteArr',
        payload: result
      })
    },

    //  七、上周作业完成情况--表格
    *lastweekHomework({ payload }, { call,put }) {
      const response = yield call(getOperationQueryList,payload);
      let result;
      if(payload.database) {
        result = JSON.parse(JSON.stringify(response.data.rows)
        .replace(/updateTime/g, 'field2')
        .replace(/nature/g, 'field3')
        .replace(/content/g, 'field4')
        .replace(/plannedEndTime/g, 'field5')
        .replace(/status/g, 'field6')
        .replace(/operationUser/g, 'field7')
        .replace(/operationUnit/g, 'field8')
      )
      } else {
        result = JSON.parse(JSON.stringify(response.data.rows)
        .replace(/updateTime/g, 'field1')
        .replace(/addTime/g, 'field2')
        .replace(/nature/g, 'field3')
        .replace(/object/g, 'field4')
        .replace(/content/g, 'field5')
        .replace(/plannedEndTime/g, 'field6')
        .replace(/status/g, 'field7')
        .replace(/operationUser/g, 'field8')
        .replace(/operationUnit/g, 'field9')
      )
      }
   
      yield put({
        type:'lastweekHomeworklist',
        payload: result
      })
    },
    //  七、下周作业完成情况--表格
    *nextweekHomework({ payload }, { call,put }) {
      const response = yield call(getOperationQueryList,payload);
      let result;
      if(payload.database) {
        result = JSON.parse(JSON.stringify(response.data.rows)
        .replace(/updateTime/g, 'field1')
        .replace(/addTime/g, 'field2')
        .replace(/object/g, 'field3')
        .replace(/content/g, 'field4')
        .replace(/plannedEndTime/g, 'field5')
        .replace(/status/g, 'field6')
        .replace(/operationUser/g, 'field7')
        .replace(/operationUnit/g, 'field8')
      )
      } else {
        result = JSON.parse(JSON.stringify(response.data.rows)
        .replace(/updateTime/g, 'field1')
        .replace(/addTime/g, 'field2')
        .replace(/nature/g, 'field3')
        .replace(/object/g, 'field4')
        .replace(/content/g, 'field5')
        .replace(/plannedEndTime/g, 'field6')
        .replace(/status/g, 'field7')
        .replace(/operationUser/g, 'field8')
        .replace(/operationUnit/g, 'field9')
      )
      }
      yield put({
        type:'nextweekHomeworklist',
        payload: result
      })
    },

    // 新增及已修复故障
    *getfaultQueryList({ payload }, { call, put }) {
    const response = yield call(queryfaultSearchList1, payload);
    const result = JSON.parse(JSON.stringify(response.data)
    .replace(/time/g, 'field2')
    .replace(/type/g, 'field3')
    .replace(/content/g, 'field4')
    .replace(/result/g, 'field5')
    .replace(/file/g, 'field6')
    .replace(/unit/g, 'field7')
    .replace(/sign/g, 'field8')
  )
    yield put({
      type: 'faultQueryList',
      payload: result,
    });
  },

    // 未修复故障清单
    *getnofaultQueryList({ payload }, { call, put }) {
    const response = yield call(queryfaultSearchList1, payload);
    const result = JSON.parse(JSON.stringify(response.data)
    .replace(/time/g, 'field2')
    .replace(/type/g, 'field3')
    .replace(/content/g, 'field4')
    // .replace(/result/g, 'field5')
  )
    yield put({
      type: 'nofaultQueryList',
      payload: result,
    });
  },

     //  获取运维情况综述行
     *getContentRow({ payload }, { call, put }) {
      const response = yield call(getContentRow,payload);
      yield put({
        type:'contentRowlist',
        payload: response
      })
    },

     //  获取运维情况综述行
     *getPatrolAndExamineList({ payload }, { call, put }) {
      const response = yield call(getPatrolAndExamineList,payload);
      yield put({
        type:'patrolAndExamineArr',
        payload: response
      })
    },

  //  下载word
  *exportWord({payload:{mainId}},{call,put}) {
    return yield call(reportExport,mainId)
  },

  //  列表复制粘贴功能
  *handlecopypaste({payload:{editStatus,id}},{call,put}) {
    const response = yield call(openReport,editStatus,id);
    if(response.code === 200) {
      // const responseAddid = yield call(addReport);
      const copydata = {
        ...response,
      };

      const reportType = response.main.type;

          switch (reportType) {
            case '软件运维周报':
            case '软件运维月报':
              break;
            case '数据库运维周报':
            case '数据库运维月报':
              break;
            case '机房运维周报':
            case '机房运维月报':
              break;
            case '其他运维周报':
            case '其他运维月报':
             const responseAddid = yield call(addReport);
              if(responseAddid.code === 200) {
                const mainId = response.id;
                const saveData = copydata;
                saveData.mainId = mainId;
                delete saveData.status;
              }
              break;
            default:
              break;
          }
    }
  },

  // 机房月报
  *getTroubleByComputerRoom({payload},{call,put}) {
    const response = yield call(getTroubleByComputerRoom,payload);
    const result = response;
    result.eventList = JSON.parse(JSON.stringify(response.eventList)
    .replace(/name/g, 'field1')
    .replace(/now/g, 'field2')
    .replace(/last/g, 'field3')
    .replace(/add/g, 'field4')
    );
    result.troubleList = JSON.parse(JSON.stringify(response.troubleList)
    .replace(/time/g, 'field2')
    .replace(/type/g, 'field3')
    .replace(/content/g, 'field4')
    .replace(/status/g, 'field5')
    )
    yield put({
      type:'computerroom',
      payload:result
    })
  },

   // 机房月报保存
   *saveComputerRoomByMonth({ payload }, { call,put}) {
    yield put ({
      type:'clearcache',
      payload:[]
    });
    const tabid = sessionStorage.getItem('tabid')
    if(payload.editStatus === 'add') {
      const response = yield call(addReport);
      if(response.code === 200) {
        const mainId = response.id;
        const saveData = payload;
        saveData.mainId = mainId;
        delete saveData.status;
        const type = payload.reporttype;
        const saveresponse = yield call(saveComputerRoomByMonth,saveData);
        if(saveresponse.code === 200) {
            route.push({
              pathname: `/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail`,
              query: {
                reporttype: type,
                mainId:mainId.toString(),
                orderNo:mainId.toString(),
              },
              state: {closetabid: tabid},
            })
        }
      }
    } else {
      return yield call(saveComputerRoomByMonth,payload)
    }
    return []
  },

  *clearcomputer({payload},{call,put}) {
    yield put({
      type:'clearcomputerroom',
      payload:[]
    })
  },

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
        soluteArr: action.payload
      }
    },

      // 维服务指标统计列表
      maintenanceService(state, action) {
      return {
        ...state,
        maintenanceService: action.payload
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

    // 已修复
    faultQueryList(state, action) {
    return {
      ...state,
      faultQueryList: action.payload,
    };
  },

    // 未修复
    nofaultQueryList(state, action) {
    return {
      ...state,
      nofaultQueryList: action.payload,
    };
  },

  //  获取运维情况综述行
  contentRowlist(state,action) {
    return {
      ...state,
      contentRowlist:action.payload.data
    }
  },
  //  获取巡检
  patrolAndExamineArr(state,action) {
    return {
      ...state,
      patrolAndExamineArr:action.payload.data
    }
  },

  clearcache(state){
    return {
      ...state,
      openReportlist:[]
    }
  },

  clearAutoget(state,action) {
    return {
      ...state,
      lastweekHomeworklist:'',
      nextweekHomeworklist:'',
      faultQueryList:'',
      nofaultQueryList:'',
      maintenanceArr:'',
      maintenanceService:'',
      soluteArr:'',
      contentRowlist:'',
      patrolAndExamineArr:'',
    }
  },
  // 机房月报
  computerroom(state,action) {
    return {
      ...state,
      computerroom:action.payload
    }
  },

  clearcomputerroom(state,action) {
    return {
      ...state,
      computerroom:{}
    }
  },
  }
}