import route from 'umi/router';
import {
message
}from 'antd';

import {
  getTroubleByComputerRoom,
  saveComputerRoomByMonth,
  addReport,
  openReport,
  reportExport
} from '../services/monthlyapi';

export default {
  namespace:'monthly',

  state: {
    computerroom:{},
    openReportlist:{},
  },

  effects: {  
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
      })
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
                pathname: `/ITSM/operationreport/monthlyreport/monthcomputerroomreport`,
                query: { 
                  tabid: sessionStorage.getItem('tabid'),
                   closecurrent: true,
                   }
              })
              route.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail`,
                query: {
                  reporttype: type,
                  mainId:mainId.toString(),
                  orderNo:mainId.toString(),
                },
              })
          }
        }
      } else {
        return yield call(saveComputerRoomByMonth,payload)
      }
      return []
    },

     //  打开待办
     *openReport({payload:{editStatus,id}},{call,put}) {
      const response = yield call(openReport,editStatus,id);
      yield put ({
        type:'openReportlist',
        payload:response
      })
    },

    *pasteReport({payload:{editStatus,id}},{call,put}){
      yield put({
        type:'clearcomputerroom',
        payload:[]
      })
      return yield call(openReport,editStatus,id);
    },

    *setclearcomputerroom({payload},{call,put}) {
      yield put({
        type:'clearcomputerroom',
        payload:[]
      })
    },

      //  下载word
  *exportWord({payload:{mainId}},{call,put}) {
    return yield call(reportExport,mainId)
  },
  },

  reducers:{
    computerroom(state,action) {
      return {
        ...state,
        computerroom:action.payload
      }
    },

    openReportlist(state,action) {
      return {
        ...state,
        openReportlist:action.payload
      }
    },

    clearcomputerroom(state,action) {
      return {
        ...state,
        computerroom:{}
      }
    }
  }
}