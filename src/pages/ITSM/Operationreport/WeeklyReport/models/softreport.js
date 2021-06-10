import route from 'umi/router';
import {
  addReport,
  saveSoftreport,
  openReport,
  queryList,
  deleteAll,
  saveComputerRoom
} from '../services/softreportapi';

export default {
  namespace:'softreport',

  state: {
    addMainid:[],
    openReportlist:[],
    queryOrderlist:[]
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
              pathname: `/ITSM/operationreport/weeklyreport/detailSoft/`,
              query: {
                reporttype: type,
                mainId,
              },
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
      return yield call(openReport,editStatus,id);
      // yield put ({
      //   type:'openReportlist',
      //   payload:response
      // })
    },

      //  保存软件
      *saveComputer({payload},{call,put}) {
        if(payload.status) {
          const response = yield call(addReport);
          if(response.code === 200) {
            const mainId = response.id;
            const saveData = payload;
            saveData.mainId = mainId;
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
          return yield call(saveSoftreport,payload)
        }
        // return []
      },

    //  删除
    *deleteAll({payload},{call,put}) {
      return yield call(deleteAll,payload)
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
    }
  }
}