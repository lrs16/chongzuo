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
  downFile
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
    startid:''
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
    *getAddid({ payload: { saveData, jumpType } }, { call, put }) {
      const response = yield call(getAddid);
      if (response.code === 200) {
        yield put({
          type: 'getid',
          payload: response,
        });
        const saveiInfo = saveData;
        saveiInfo.taskId = response.flowTaskId;
        const resRegister = yield call(saveRegister, saveiInfo);
        if (resRegister.code === 200) {
          console.log('jumpType: ', jumpType);
          switch (jumpType) {
            // case 0:
            //   route.push({ pathname: `/ITSM/problemmanage/besolved` });
            //   break;
              
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
    *tobeSave({ payload: { saveData } }, { call }) {
      return yield call(saveRegister, saveData);
    },

    *delete({ payload: { deleteid } }, { call }) {
      return yield call(deleteTobo, deleteid);
    },

    //  回退
    *tobeBack({ payload: { id, values } }, { call }) {
      return yield call(backReason, id, values);
    },

    //  流转到下一节点前选人
    *optionPeople({ payload: { taskId } }, { call, put }) {
      return yield call(tobeListpeople, taskId);
    },

    //  流转到下一个节点
    *gotoCirculation({ payload: { flow } }, { call, put }) {
      return yield call(saveTobelist,flow);
    },

    *besolveList({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(besolveList, current, pageSize);
      yield put({
        type: 'besolveListpage',
        payload: response,
      });
    },

    *searchBesolve({ payload: { current, pageSize, values } }, { call, put }) {
      const response = yield call(searchBesolve, current, pageSize, values);
      yield put({
        type: 'besolveListpage',
        payload: response,
      });
    },
    //  列表查询
    *queryList({ payload: { current, pageSize, values } }, { call, put }) {
      console.log('current: ', current);
      const response = yield call(queryList, current, pageSize, values);
      yield put({
        type: 'besolveListpage',
        payload: response,
      });
    },

    //  获取工作流流程图
    *getgetFlowImage({ payload: { id } }, { call, put }) {
      console.log('id: ', id);
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
      console.log('realse');
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

    *eventdownload({ payload:{values} }, { call }) {
      return yield call(querydownload, { values });
    },

    *filedownload({ payload:{id} }, { call }) {
      return yield call(downFile,  id );
    },

      // 上传,删除附件触发保存
    *uploadchange({ payload }, { call, put }) {
      return yield call(saveRegister, payload);
    },

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
    }
  },
};
