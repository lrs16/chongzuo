import {
  getTroubleByComputerRoom,
  saveComputerRoomByMonth
} from '../services/monthlyapi'

export default {
  namespace:'monthly',

  state: {
    computerroom:[]
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
    },
  },

  reducers: {
    computerroom(state,action) {
      return {
        ...state,
        computerroom:action.payload
      }
    }
  }
}