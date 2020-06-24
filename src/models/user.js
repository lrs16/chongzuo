// import { queryCurrent, query as queryUsers } from '@/services/user';
import { queryCurrent, queryMenus } from '@/services/user';

const compare = p => {
  return (m, n) => {
    const a = m[p];
    const b = n[p];
    return a - b;
  };
};

const menuArr = (data, authority) => {
  const datas = data.sort(compare('menuSort'));
  const newArr = [];
  const menu = 'menu.';
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.id = datas[i].id;
    vote.pid = datas[i].pid;
    vote.menuSort = datas[i].menuSort;
    vote.exact = true;
    vote.icon = datas[i].menuIcon;
    vote.key = datas[i].menuUrl;
    vote.path = datas[i].menuUrl;
    vote.locale = menu + datas[i].menuDesc;
    vote.name = datas[i].menuDesc;
    vote.authority = authority.split(',');
    newArr.push(vote);
  }

  return newArr;
};

const toTree = data => {
  const result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach(item => {
    delete item.routes;
  });
  const map = {};
  data.forEach(item => {
    map[item.menuSort] = item;
  });
  data.forEach(item => {
    const parent = map[item.pid];
    if (parent) {
      (parent.routes || (parent.routes = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    Userauth: '',
    menuData: [],
  },
  effects: {
    // 没有用到
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...response.data,
        },
      });
    },
    *fetchMenu(_, { call, put }) {
      const response = yield call(queryMenus);

      if (response.code === 200) {
        const userinfo = yield call(queryCurrent);
        const menus = menuArr(response.data, userinfo.data.loginCode);
        const menuData = toTree(menus);
        yield put({
          type: 'saveUserMenu',
          payload: menuData,
        });
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
        Userauth: action.payload.loginCode,
      };
    },
    saveUserMenu(state, action) {
      return {
        ...state,
        menuData: action.payload || [],
      };
    },

    // changeNotifyCount(
    //   state = {
    //     currentUser: {},
    //   },
    //   action,
    // ) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       notifyCount: action.payload.totalCount,
    //       unreadCount: action.payload.unreadCount,
    //     },
    //   };
    // },
  },
};
export default UserModel;
