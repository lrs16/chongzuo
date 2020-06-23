import mockjs from 'mockjs';
// MOCK菜单与权限

export default {
  'GET /api/getnmenudata': [
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
};
