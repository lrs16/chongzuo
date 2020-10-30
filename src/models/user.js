// import { queryCurrent, query as queryUsers } from '@/services/user';
import { queryCurrent, queryMenus, queryAllMenus } from '@/services/user';

const compare = p => {
  return (m, n) => {
    const a = m[p];
    const b = n[p];
    return a - b;
  };
};

const addauth = (sysmenu, usermenu, authority) => {
  const data = sysmenu.map((item, index) => {
    item.menuauth = 'incontrol';
    usermenu.map((item1, index1) => {
      if (item.id == item1.id) {
        item.menuauth = authority;
      }
    });
    return item;
  });
  return data;
};

const menuArr = (sysmenu, usermenu, authority) => {
  var data = sysmenu.map((item, index) => {
    item.menuauth = 'incontrol';
    usermenu.map((item1, index1) => {
      if (item.id == item1.id) {
        item.menuauth = authority;
      }
    });
    return item;
  });
  const datas = data.sort(compare('menuSort'));
  const newArr = [];
  const menu = 'menu.';

  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    if (datas[i].menuHide === '1') {
      vote.hideInMenu = true;
    } else if (datas[i].menuHide === '0') {
      vote.hideInMenu = false;
    }
    vote.id = datas[i].id;
    vote.pid = datas[i].pid;
    vote.menuSort = datas[i].menuSort;
    vote.exact = true;
    vote.icon = datas[i].menuIcon;
    vote.key = datas[i].menuUrl;
    vote.path = datas[i].menuUrl;
    vote.locale = menu + datas[i].menuDesc;
    vote.name = datas[i].menuDesc;
    vote.authority = datas[i].menuauth.split(',');
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
    menulist: [],
  },
  effects: {
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
      const menures = yield call(queryAllMenus);
      if (response.code === 200 && menures.code === 200) {
        const userinfo = yield call(queryCurrent);
        const menus = menuArr(menures.data, response.data, userinfo.data.loginCode);
        const menuData = toTree(menus);
        const menulist = addauth(menures.data, response.data, userinfo.data.loginCode);
        yield put({
          type: 'saveUserMenu',
          payload: {
            menuData,
            authority: ['incontrol', `${userinfo.data.loginCode}`],
            menulist,
          },
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
        menuData: action.payload.menuData || [],
        menulist: action.payload.menulist || [],
      };
    },
  },
};
export default UserModel;
