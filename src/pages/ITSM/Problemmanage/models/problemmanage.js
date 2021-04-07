import route from 'umi/router';
import {
  queryCurrent,
  problemList,
  getNewno,
  saveRegister,
  backReason,
  saveTobelist,
  besolveList,
  searchBesolve,
  deleteTobo,
  getFlowlog,
  todoInformation,
  getFlowImage,
  eventList,
  realselist,
  getAddid,
  queryList,
  fileUpload,
  problemHandleOrder,
  tobeListpeople,
  queryDetail,
  transferOrder,
  querydownload,
  downFile,
  querkeyVal,
  handlequeryList,
  besolveListdownload,
  handleGratelist,
  timeoutlist,
  exportExcel
} from '../services/api';

export default {
  namespace: 'problemmanage',

  state: {
    newno: [],
    list: [],
    id: '',
    tobopeople: [],
    besolveList: [],
    todoDetail: '',
    reviewInfo: {},
    solvingInfo: {},
    confirmInfo: {},
    counterInfo: {},
    closeInfo: {},
    eventtableList: [],
    realsetableList: [],
    selectData: [],
    useInfo: [],
    imageSource: '',
    flowlog: '',
    peopleList:[],
    queryDetaildata:[],
    data:'',
    startid:'',
    keyVallist:[],
    handleList:[],
    queryArr:[],
    handleArr:[]
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(problemList);
      yield put({
        type: 'getlist',
        payload: response,
      });
    },
    //  获取新的编号
    *getregisterNo({ payload }, { call, put }) {
      const response = yield call(getNewno);
      yield put({
        type: 'getNewno',
        payload: response,
      });
    },

    *fetchUseinfo({ payload }, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'getuseInfo',
        payload: response,
      });
    },
    //  登记保存
    *getAddid({ payload }, { call, put }) {
      const response = yield call(getAddid);
      if (response.code === 200) {
        yield put({
          type: 'getid',
          payload: response,
        });

        const responseId = yield call(getNewno);
        if(responseId.code === 200) {
          yield put({
            type: 'getNewno',
            payload: response,
          });
          const saveiInfo = payload;
          saveiInfo.taskId = response.flowTaskId;
          saveiInfo.no = responseId.problemNo;
  
          const resRegister = yield call(saveRegister, saveiInfo);
          if (resRegister.code === 200) {
            switch (payload.jumpType) {
              case 0:
                route.push({
                  pathname: `/ITSM/problemmanage/besolveddetail/workorder/${response.flowTaskId}`,
                });
                break;
  
              default:
                break;
            }
          }
        }
        }
    },

    //  启动流程
    *startProcess({ payload }, { call,put }) {
      const response =  yield call(getAddid);
      yield put({
        type: 'getstartid',
        payload: response,
      });
    },


    // 流转登记保存
    *saveCirculation({ payload: { saveData } }, { call }) {
      return yield call(saveRegister, saveData);
    },

    //  待办保存
    *tobeSave({ payload }, { call }) {
      return yield call(saveRegister,payload);
    },

    *delete({ payload: { deleteid } }, { call }) {
      return yield call(deleteTobo, deleteid);
    },

    //  回退
    *tobeBack({ payload: { id, values,userIds } }, { call }) {
      return yield call(backReason, id, values,userIds);
    },

    //  流转到下一节点前选人
    *optionPeople({ payload: { taskId } }, { call, put }) {
      return yield call(tobeListpeople, taskId);
    },

    //  流转到下一个节点
    *gotoCirculation({ payload: { flow } }, { call, put }) {
      return yield call(saveTobelist,flow);
    },
//  待办列表
    *besolveList({ payload }, { call, put }) {
      const response = yield call(besolveList,payload);
      yield put({
        type: 'besolveListpage',
        payload: response,
      });
    },

    *searchBesolve({ payload }, { call, put }) {
      const response = yield call(searchBesolve, payload);
      yield put({
        type: 'besolveListpage',
        payload: response,
      });
    },
    //  列表查询
    *queryList({ payload }, { call, put }) {
      const response = yield call(queryList,payload);
      yield put({
        type: 'queryArr',
        payload: response,
      });
    },

    //  处理率列表查询
    *handlequeryList({ payload}, { call, put }) {
      const response = yield call(handlequeryList,payload);
      yield put({
        type: 'handleListpage',
        payload: response,
      });
    },

    //  获取工作流流程图
    *getgetFlowImage({ payload: { id } }, { call, put }) {
      const response = yield call(getFlowImage, id);
      yield put({
        type: 'imageSource',
        payload: response,
      });
    },

    //  获取日志
    *getFlowlogdata({ payload: { id } }, { call, put }) {
      const response = yield call(getFlowlog, id);
      yield put({
        type: 'flowlog',
        payload: response,
      });
    },

    //  待办详情页
    *ToDodetails({ payload: { id } }, { call, put }) {
      const response = yield call(todoInformation, id);
      yield put({
        type: 'details',
        payload: response,
      });
    },

    // 事件列表
    *eventList({ payload }, { call, put }) {
      console.log('event');
      const response = yield call(eventList);
      yield put({
        type: 'eventtableList',
        payload: response,
      });
    },

    // 发布列表
    *realselist({ payload }, { call, put }) {
      const response = yield call(realselist);
      yield put({
        type: 'realsetableList',
        payload: response,
      });
    },

    // 文件上传
    *tobaUpload({ payload }, { call, put }) {
      return yield call(fileUpload);
    },
    // 结单
    *problemHandleOrder({ payload: { id } }, { call, put }) {
      return yield call(problemHandleOrder, id);
    },

    *queryDetail({payload:{id}},{call,put}) {
      const response = yield call(queryDetail,id);
      yield put ({
        type:'queryDetaildata',
        payload: response
      })
    },

    *transferOrder({payload:{taskId,userIds}},{call,put}) {
      return yield call(transferOrder,taskId,userIds);
    },

    *eventdownload({ payload }, { call }) {
      return yield call(querydownload, payload);
    },

    *besolvedownload({ payload }, { call }) {
      return yield call(besolveListdownload, payload);
    },

    *filedownload({ payload:{id} }, { call }) {
      return yield call(downFile,  id );
    },

      // 上传,删除附件触发保存
    *uploadchange({ payload }, { call, put }) {
      return yield call(saveRegister, payload);
    },
    //  数据字典
    *keyval({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      yield put({
        type:'keyVallist',
        payload: response
      })
    },
    //  问题工单解决进度管控统计数据列表
    *handleData({ payload }, { call,put }) {
      const response = yield call(handleGratelist, payload);
      yield put({
        type:'handleArr',
        payload: response
      })
    },
    //  问题超时统计数据列表
    *timeoutData({ payload }, { call,put }) {
      const response = yield call(timeoutlist, payload);
      yield put({
        type:'handleArr',
        payload: response
      })
    },
    //  批量导入
    *exportdownloadExcel({ payload }, { call, put }) {
      return yield call(exportExcel)
    }
  },

  reducers: {
    //  问题登记
    //  问题登记列表

    getlist(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    //  获取新的问题编号
    getNewno(state, action) {
      return {
        ...state,
        newno: action.payload,
      };
    },

    getuseInfo(state, action) {
      return {
        ...state,
        useInfo: action.payload.data,
      };
    },
    //  待办人
    gotopeople(state, action) {
      return {
        ...state,
        tobopeople: action.payload.data,
      };
    },

    // 问题添加登记的id
    getid(state, action) {
      return {
        ...state,
        id: action.payload,
      };
    },

    //  待办列表
    besolveListpage(state, action) {
      return {
        ...state,
        besolveList: action.payload.data,
      };
    },

    //  查询列表
    queryArr(state, action) {
      return {
        ...state,
        queryArr: action.payload.data,
      };
    },

    //  处理率列表
    handleListpage(state, action) {
      return {
        ...state,
        handleList: action.payload.data,
      };
    },

    //  待办详情页
    details(state, action) {
      return {
        ...state,
        todoDetail: action.payload,
      };
    },

    //  事件列表
    eventtableList(state, action) {
      return {
        ...state,
        eventtableList: action.payload.data,
      };
    },

    //  发布列表
    realsetableList(state, action) {
      return {
        ...state,
        realsetableList: action.payload.data,
      };
    },

    //  树形图
    comconfigtree(state, action) {
      return {
        ...state,
        selectData: action.payload.data,
      };
    },
    //  流程图
    imageSource(state, action) {
      return {
        ...state,
        imageSource: action.payload,
      };
    },
    //  日志
    flowlog(state, action) {
      return {
        ...state,
        flowlog: action.payload.problemFlowLogs,
      };
    },

    peopleList(state,action) {
      return {
        ...state,
        peopleList:action.payload.data
      }
    },

    queryDetaildata(state,action) {
      return {
        ...state,
        queryDetaildata: action.payload
      }
    },
    
    getstartid(state,action) {
      return {
        ...state,
        startid: action.payload.flowTaskId
      }
    },

    keyVallist(state,action) {
      return {
        ...state,
        keyVallist: action.payload.data
      }
    },

    handleArr(state,action) {
      return {
        ...state,
        handleArr: action.payload.data
      }
    },

  },
};
