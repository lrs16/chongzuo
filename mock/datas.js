import mockjs from 'mockjs';

const { Random } = mockjs;
// 系统管理

// 登录获取token
const usertoken = {
  code: 200,
  // type,
  currentAuthority: 'admin',
  data: {
    access_token: '0b3f5441-5165-43dc-af69-7651b58d8d93',
    token_type: 'bearer',
    refresh_token: 'c8cbb1bb-9908-4cf9-b0f5-eaeeb327ccdf',
    expires_in: '3599',
    scope: 'app',
  },
};
// 获取用户信息
const CurrUserInfo = {
  data: {
    code: 200,
    loginCode: 'admin',
    userName: '管理员',
    userHead: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
  },
};
// 获取用户菜单
const CurrUserMenus = {
  data: {
    code: 200,
    data: [
      {
        path: '/automation', // 路由
        name: 'automation', // 菜单名称
        icon: 'deployment-unit', // 菜单图标
        routes: [
          {
            path: '/automation/monitor',
            name: 'monitor',
            icon: 'dashboard',
            exact: true,
            authority: ['admin', 'user'], // 可以访问的用户权限
          },
          {
            path: '/automation/opsscene',
            name: 'opsscene',
            icon: 'control',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/automation/workflow',
            name: 'workflow',
            icon: 'control',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/automation/jobexecut',
            name: 'joblist',
            icon: 'profile',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/automation/jobexecut/viewjob/:id',
            name: 'viewjob',
            hideInMenu: true, // 是否在主菜单中显示，默认flase,true表示不显示
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/automation/timedjob',
            name: 'timedjob',
            icon: 'history',
            dynamic: true,
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/automation/scriptmanage',
            name: 'scriptmanage',
            icon: 'database',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/automation/resourcemanage',
            name: 'resourcemanage',
            icon: 'cloud-server',
            exact: true,
            authority: ['admin', 'user'],
          },
        ],
      },
      {
        path: '/monitormanage',
        name: 'monitormanage',
        icon: 'interaction',
        routes: [
          {
            path: '/monitormanage/home',
            name: 'measurhome',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/monitormanage/test',
            name: 'test',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/monitormanage/measurmonitor',
            name: 'measurmonitor',
            routes: [
              {
                path: '/monitormanage/measurmonitor/collection',
                name: 'collection',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/monitormanage/measurmonitor/measurface',
                name: 'measurface',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/monitormanage/measurmonitor/fafka',
                name: 'fafka',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/monitormanage/measurmonitor/sysrunning',
                name: 'sysrunning',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/monitormanage/measurmonitor/databaseterminal',
                name: 'databaseterminal',
                exact: true,
                authority: ['admin', 'user'],
              },
            ],
          },
        ],
      },
      {
        path: '/alarmmanage',
        name: 'alarmmanage',
        icon: 'interaction',
        routes: [
          {
            path: '/alarmmanage/monitor',
            name: 'monitor',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/alarmmanage/details',
            name: 'details',
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/alarmmanage/details/detailview/:detailsid',
            name: 'detailview',
            hideInMenu: true,
            exact: true,
            authority: ['admin', 'user'],
          },
          {
            path: '/alarmmanage/syssetting',
            name: 'syssetting',
            routes: [
              {
                path: '/alarmmanage/syssetting/quotas',
                name: 'quotas',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/alarmmanage/syssetting/connector',
                name: 'connector',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/alarmmanage/syssetting/KAFKA',
                name: 'KAFKA',
                exact: true,
                authority: ['admin', 'user'],
              },
              {
                path: '/alarmmanage/syssetting/sysrun',
                name: 'sysrun',
                exact: true,
                authority: ['admin', 'user'],
              },
            ],
          },
          {
            path: '/alarmmanage/noticesetting',
            name: 'noticesetting',
            component: './Alarmmanage/NoticeSetting',
            routes: [
              {
                path: '/alarmmanage/noticesetting',
                redirect: '/alarmmanage/noticesetting/notifygroup',
              },
              {
                path: '/alarmmanage/noticesetting/notifygroup',
                name: 'notifygroup',
                component: './Alarmmanage/NotifyGroup',
              },
              {
                path: '/alarmmanage/noticesetting/notifyperson',
                name: 'notifyperson',
                component: './Alarmmanage/NotifyPerson',
              },
            ],
          },
        ],
      },
      {
        path: '/sysmanage',
        name: 'sysmanage',
        icon: 'team',
        authority: ['admin'],
        routes: [
          {
            path: '/sysmanage/menumanage',
            name: 'menumanage',
            exact: true,
            authority: ['admin'],
          },
          {
            path: '/sysmanage/usersmanage',
            name: 'usersmanage',
            exact: true,
            authority: ['admin'],
          },
          {
            path: '/sysmanage/rolemanage',
            name: 'rolemanage',
            exact: true,
            authority: ['admin'],
          },
          {
            path: '/sysmanage/authoritymanage',
            name: 'authoritymanage',
            exact: true,
            authority: ['admin'],
          },
          {
            path: '/sysmanage/depmanage',
            name: 'depmanage',
            exact: true,
            authority: ['admin'],
          },
        ],
      },
    ],
  },
};
// 基础平台检测，主机检测，监控指标，最近一次磁盘使用情况
function mockdiskdata() {
  const list = [];
  const count = 6;
  for (let i = 0; i < count; i += 1) {
    list.push({
      name: `device:/sys/fs/cgroup${i}`,
      percent: Random.integer(0, 100),
      diskspace: Random.integer(120, 200),
      inodes: Random.integer(0, 10),
    });
  }
  return list;
}

// 基础平台检测，主机检测，监控指标，其它情况磁盘使用情况
function mock1linedata() {
  const list = [];
  const count = 6;
  for (let i = 0; i < count; i += 1) {
    list.push({
      date: `12:${Random.integer(10, 59)}`,
      value: Random.integer(20, 100),
    });
  }
  return list;
}

function mock2linedata() {
  const list = [];
  const count = 6;
  for (let i = 0; i < count; i += 1) {
    list.push({
      date: `12:${Random.integer(10, 60)}`,
      value: Random.integer(20, 100),
    });
  }
  return list;
}

export default {
  'GET /api-upms/upms_user/getCurrUserInfo': CurrUserInfo, // 根据token获取用户信息
  'GET /api-upms/upms_user/getCurrUserMenus': CurrUserMenus, // 根据token获取用户菜单
};
