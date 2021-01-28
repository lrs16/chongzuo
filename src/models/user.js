import { queryCurrent, queryMenus, queryAllMenus } from '@/services/user';

const compare = p => {
  return (m, n) => {
    const a = m[p];
    const b = n[p];
    return a - b;
  };
};

const addauth = (sysmenu, usermenu, authority) => {
  const data = sysmenu.map(obj => {
    const item = obj;
    item.menuauth = 'incontrol';
    usermenu.map(item1 => {
      if (item.id === item1.id) {
        item.menuauth = authority;
      }
      return item1;
    });
    return item;
  });
  return data;
};

const menuArr = menulist => {
  const datas = menulist.sort(compare('menuSort'));
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
  data.forEach(obj => {
    const item = obj;
    delete item.routes;
  });
  const map = {};
  data.forEach(item => {
    // map[item.menuSort] = item;
    map[item.id] = item;
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
      if (response.code === 200) {
        sessionStorage.setItem('userauthorityid', response.data.id);
        sessionStorage.setItem('userName', response.data.userName);
      }
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
        const loginCode = JSON.parse(sessionStorage.getItem('userauthority'));
        const menulist = addauth(menures.data, response.data, loginCode[0]);
        const menus = menuArr(menulist);
        const menuData = toTree(menus);
        yield put({
          type: 'saveUserMenu',
          payload: {
            menuData,
            authority: ['incontrol', `${loginCode[0]}`],
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
