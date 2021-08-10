import router from 'umi/router';
import {
  message
} from 'antd';
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
  scoreId, //  根据id查询详细条款数据
  scoreListpage, // 评分列表
  clauseAdd,
  clauseId,
  scoreDel, // 删除评分细则
  getTypeTree,
  clauseListpage,
  getTargetValue,
  scorecardlistPage,
  updateRemark
} from '../services/quality';

export default {
  namespace:'qualityassessment',

  state:{
    maintenanceData:[],
    searchProviderobj:{},
    contractProviderobj:[],
    providerArr:[],
    scoreDetail:[],
    scoreList:[],
    clauseDetail:[],
    treeArr:[],
    clauseList:[],
    treeForm:[],
    scorecardArr:[]
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
    } else {
      message.info(response.msg)
    }
  },

  //  根据ID查询评分
  *scoreId({ payload }, { call, put }) {
    const response = yield call(scoreId,payload);
    yield put({
      type:'scoreDetail',
      payload:response
    })
  },

  //  评分维护列表
  *scoreListpage({ payload }, { call, put }) {
    const response = yield call(scoreListpage,payload);
    yield put ({
      type:'scoreList',
      payload: response
    })
  },

  *clauseAdd({ payload }, { call, put }) {
    return yield call(clauseAdd,payload);
  },

   //  评分细则维护
   *clauseId({ payload }, { call, put }) {
    const response = yield call(clauseId,payload);
    yield put ({
      type:'clauseDetail',
      payload: response
    })
  },

   //  删除评分
   *scoreDel({ payload }, { call, put }) {
    return yield call(scoreDel,payload)
  },

   //  根据考核类型查询指标明细的树
   *getTypeTree({ payload }, { call, put }) {
    return yield call(getTypeTree,payload);
  },

   //  详细条款列表
   *clauseListpage({ payload }, { call, put }) {
    const response = yield call(clauseListpage,payload);
    yield put ({
      type:'clauseList',
      payload: response
    })
  },

  //  击树获取右边表单信息
  *getTargetValue({ payload }, { call, put }) {
    const response = yield call(getTargetValue,payload);
    yield put ({
      type:'treeForm',
      payload: response
    })
  },

  //  清除服务商、评分细则维护数据
  *cleardata({ payload }, { call, put }) {
    yield put ({
      type:'clearProviderdata',
      payload: []
    })
  },

   //  更新扣分说明
   *updateRemark({ payload: { id, remark }},{ call, put }) {
    return yield call(updateRemark,id, remark)
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
    },

    scoreDetail(state,action) {
      return {
        ...state,
        scoreDetail:action.payload.data
      }
    },

    scoreList(state,action) {
      return {
        ...state,
        scoreList: action.payload.data
      }
    },

    treeArr(state,action) {
      return {
        ...state,
        treeArr: action.payload.data
      }
    },
    clauseList(state,action) {
      return {
        ...state,
        clauseList: action.payload.data
      }
    },
    treeForm(state,action) {
      return {
        ...state,
        treeForm: action.payload.data
      }
    },

    //  清除服务商数据
    clearProviderdata(state,action) {
      return {
        ...state,
        searchProviderobj: [],
        contractProviderobj:[],
        scoreDetail:[]
      }
    },
  }
}