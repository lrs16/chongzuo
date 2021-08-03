import router from 'umi/router';
import {
  maintenanceList,
  contractAdd,  // 新增合同
  providerAdd, // 新增服务商
  searchProvider, //  查询服务商
  contractProvider,
  contractUpd,  //  更新合同
  contractDel,  //  删除合同
  providerList,   //  服务商合同列表
  providerUpd, // 更新服务商
  providerDel, // 删除服务商
  scoreAdd,
} from '../services/quality';

export default {
  namespace:'qualityassessment',

  state:{
    maintenanceData:[],
    searchProviderobj:{},
    contractProviderobj:'',
    providerArr:[],
  },

  effects: {
    *maintenanceList({ payload }, { call,put }) {
      const response = yield call(maintenanceList,payload);
      yield put ({
        type:'maintenanceData',
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

  //  新增合同
  *contractAdd({ payload } , { call, put }) {
    return yield call(contractAdd,payload)
  },

  //  新增服务商
  *providerAdd({ payload }, { call, put }) {
    const response = yield call(providerAdd,payload);
    if(response.code === 200) {
      router.push({
        pathname:'/ITSM/servicequalityassessment/addserviceprovidermaintenance',
        query:{
          tabid: sessionStorage.getItem('tabid'),
          closecurrent: true,
        }
      });
      const { id } = response.data;
      router.push({
        pathname:'/ITSM/servicequalityassessment/detailserviceprovidermaintenance',
        query:{
          id,
          mainId:id,
          orderNo:id,
        }
      })
    }
  },

  //  查询服务商
  *searchProvider({ payload },{ call, put }) {
    const response = yield call(searchProvider,payload);
    yield put ({
      type:'searchProviderobj',
      payload: response
    })
  },
  //  根据服务商id查询合同数据
  *contractProvider({ payload }, { call, put }) {
    console.log('payload: ', payload);
    const response = yield call(contractProvider,payload);
    yield put({
      type:'contractProviderobj',
      payload: response
    })
  },

  *contractUpd({ payload }, { call, put }) {
    return yield call(contractUpd,payload)
  },

  *contractDel({ payload },{ call, put }) {
    return yield call(contractDel,payload)
  },

  *providerList({ payload }, { call, put }) {
    const response = yield call(providerList,payload);
    yield put ({
      type:'providerArr',
      payload: response
    })
  },

  //  更新服务商信息
  *providerUpd({ payload } ,{ call, put}) {
    return yield call(providerUpd,payload)
  },

  //  删除服务商
  *providerDel({ payload }, { call, put }) {
    return yield call(providerDel,payload)
  },

  //  新增评分细则
  *scoreAdd({ payload }, { call, put }) {
    const response = yield call(scoreAdd,payload);
    if(response.code === 200) {
      router.push({
        pathname:'/ITSM/servicequalityassessment/addscoringrulesmaintenance',
        query: {
          tabid: sessionStorage.getItem('tabid'),
          closecurrent: true,
        }
      });
      const { id } = response.data;
      router.push({
        pathname:'/ITSM/servicequalityassessment/detailscoringrulesmaintenance',
        query: {
          id,
          mainId:id,
          orderNo:''
        }
      })
    }
  }
  },


  reducers: {
    maintenanceData(state,action) {
      return {
        ...state,
        maintenanceData: action.payload
      }
    },

    searchProviderobj(state,action) {
      return {
        ...state,
        searchProviderobj:action.payload.data
      }
    },

    contractProviderobj(state,action) {
      return {
        ...state,
        contractProviderobj:action.payload.data
      }
    },

    providerArr(state,action) {
      return {
        ...state,
        providerArr:action.payload.data
      }
    }
  }
}