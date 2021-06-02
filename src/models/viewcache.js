// const Temporarystorageinfo = (tabid) => {
// }

const UserModel = {
  namespace: 'viewcache',
  state: {
    cacheinfo: [],
    tabnew: false,          // true获取信息
    tabid: '',              // 写入的页签的id 
    savecache: false,       // true可以改变页签state
    tolink: false,          // true可以跳转路由
    tabdata: undefined      //  从页签传回表单的信息
  },
  effects: {
    *fetch({ payload: { newtab, tabid } }, { put }) {
      yield put({
        type: 'save',
        newtab,
        tabid,
      });
    },
    *gettabstate({ payload: { cacheinfo, tabid } }, { put }) {
      yield put({
        type: 'savecache',
        cacheinfo: { cacheinfo },
        tabid,
      });
    },
    *sendcache({ payload: { tabdata, tabid } }, { put }) {
      yield put({
        type: 'send',
        tabdata: { ...tabdata },
        tabid,
      });
    },
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },
    *changelink(_, { put }) {
      yield put({
        type: 'canlink',
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        tabnew: action.newtab,
        tabid: action.tabid,
      };
    },
    savecache(state, action) {
      return {
        ...state,
        cacheinfo: action.cacheinfo,
        tabid: action.tabid,
        savecache: true,
        tabnew: false,
        tolink: false,
      };
    },
    send(state, action) {
      return {
        ...state,
        tabdata: action.tabdata,
        tabid: action.tabid,
      };
    },
    clearcache(state) {
      return {
        ...state,
        cacheinfo: [],
        tabdata: undefined,
        savecache: false,
        tabnew: false,
        tabid: '',
        tolink: false,
      };
    },
    canlink(state) {
      return {
        ...state,
        tabnew: false,
        tolink: true
      };
    },
  },
};
export default UserModel;
