import route from 'umi/router';
import {
  saveForm,
  myTasklist,
  startFlow,
  openFlow,
  censorshipSubmit,
  downloadMyOperationExcel,
  fallback,
  batchCheck,
  batchToCheck,
  getOperationQueryList,
  openView,
  taskDelete,
  submit,
  downloadQueryExcel,
  delay,
  operationPerson,
} from '../services/processapi';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/check_/g, 'check.')
      .replace(/execute_/g, 'execute.'),
  );
  return newarr;
};

export default {
  namespace:'processmodel',

  state: {
    checkList:[],
    myTaskplanlist:[],
    openFlowList:[],
    queryList:[],
    openViewlist:[],
    operationPersonArr:[]
  },

  effects: {

    //  登记保存
    *saveallForm({ payload }, { call, put }) {
      const response = yield call(startFlow);
      if(response.code === 200) {
        const saveFormdata = payload;
        saveFormdata.main_id = response.mainId;
        saveFormdata.mainId = response.mainId;
        const values= replacerec(saveFormdata);
        const saveresponse = yield call(saveForm,values);
        if(saveresponse.code === 200) {
          route.push({
            pathname:`/ITSM/operationplan/operationplanform`,
            query:{
              mainId:response.mainId,
              registe:'计划中'
            }
          })
        }
      }
    },

    //  除登记其他的表单保存
    *formSave({payload},{call,put}) {
      const values= replacerec(payload);
      return yield call(saveForm,values)
    },

//  打开待办
    *openFlow({ payload }, { call, put }) {
      const response = yield call(openFlow,payload);
      yield put ({
        type:'openFlowList',
        payload: response
      })
    },

    //  我的作业计划列表
    *myTasklist({ payload }, { call, put }) {
      const response = yield call(myTasklist,payload);
      yield put ({
        type:'myTaskplanlist',
        payload: response
      })
    },

    //  提交送审人
    *censorshipSubmit({ payload }, { call, put }) {
      return yield call(censorshipSubmit,payload)
    },

    //  我的作业计划下载
    *downloadMyOperationExcel({ payload }, { call, put }) {
      return yield call(downloadMyOperationExcel,payload)
    },

    //  回退
     *fallback({ payload }, { call, put }) {
        return yield call(fallback,payload)
      },

    //  送审
     *batchToCheck({ payload }, { call, put }) {
        return yield call(batchToCheck,payload)
      },
    //  审核
     *batchCheck({ payload }, { call, put }) {
        const values= replacerec(payload);
        return yield call(batchCheck,values)
      },

         //  我的作业计划查询列表
    *getOperationQueryList({ payload }, { call, put }) {
      const response = yield call(getOperationQueryList,payload);
      yield put ({
        type:'queryList',
        payload: response
      })
    },
         //  我的作业计划查询详情
    *openView({ payload }, { call, put }) {
      const response = yield call(openView,payload);
      yield put ({
        type:'openViewlist',
        payload: response
      })
    },
       //  删除
     *taskDelete({ payload }, { call, put }) {
        return yield call(taskDelete,payload)
      },

      //  粘贴
      *pasteData({ payload }, { call, put }) {
        const response = yield call(openFlow,payload);
        yield put ({
          type:'openFlowList',
          payload: response
        })
      },

        //  确定执行提交
     *submit({ payload }, { call, put }) {
      const values= replacerec(payload);
      return yield call(submit,values)
    },
  
      //  下载查询页
      *downloadQueryExcel({ payload }, { call, put }) {
        return yield call(downloadQueryExcel,payload)
      },

      //  确定延期
      *delay({ payload }, { call, put }) {
        return yield call(delay,payload)
      },

      //  获取作业负责人信息
      *operationPerson({ payload }, { call, put }) {
        const response = yield call(operationPerson,payload);
        yield put ({
          type:'operationPersonArr',
          payload: response
        })
      },
  },

  reducers: {
    myTaskplanlist(state,action) {
      return {
        ...state,
        myTaskplanlist: action.payload.data
      }
    },

    openFlowList(state,action) {
      return {
        ...state,
        openFlowList: action.payload
      }
    },

    queryList(state,action) {
      return {
        ...state,
        queryList: action.payload.data
      }
    },

    openViewlist(state,action) {
      return {
        ...state,
        openViewlist: action.payload.data
      }
    },

    operationPersonArr(state,action) {
      return {
        ...state,
        operationPersonArr: action.payload.data
      }
    },

  }
}