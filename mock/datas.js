import mockjs from 'mockjs';
import moment from 'moment';
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

// 基础平台检测：当前告警，历史告警
function mocksystemhistorylist(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      alarmstatus: [0, 1, 2, 3][i % 4],
      alerContent: Random.cword(
        '磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        20,
        50,
      ),
      time: Random.datetime(),
    });
  }
  return list;
}

function mockchain(count, ringtype) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: Random.string('123456789', 5),
      company: Random.integer(1, 9),
      ringtype,
      type: ['低压', '公变', '变电站', '地方电厂', '统调电厂'][i % 5],
      supplycompany: Random.string('4567', 1),
      percentage: Random.integer(90, 100),
      todaydifference: Random.integer(1, 12),
      yesterdaydifference: Random.integer(1, 12),
    });
  }
  return list;
}

function mockalarmover(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `alarmover${i}`,
      leve: ['紧急', '一般', '警告'][i % 3],
      type: ['业务指标', '终端在线和入库', '接口数据', 'KAFKA中间件', '主站系统运行'][i % 5],
      monitorco: ['采集完整率', '自动抄表率', '业务指标', '档案同步接口', '低压相关', '登录检测'][
        i % 6
      ],
      configstatus: Random.string('01', 1),
      elimination: Random.string('01', 1),
      content: Random.cword(
        'KAFKA消费情况：KAFKA  主题AutodataAsk消费异常，消息量连续增长超阈值告警,供售电量分析：波动值超过波动阈值0.1',
        10,
        25,
      ),
      contenttime: Random.datetime(),
      thistime: Random.datetime(),
      lasttime: Random.datetime(),
    });
  }
  return list;
}

function mockalarmsetting(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `alarmsetting${i}`,
      title: Random.cword(
        'KAFKA消费情况：KAFKA  主题AutodataAsk消费异常，消息量连续增长超阈值告警,供售电量分析：波动值超过波动阈值0.1',
        10,
        25,
      ),
      type: ['业务指标', '终端在线和入库', '接口数据', 'KAFKA中间件', '主站系统运行'][i % 5],
      condition: Random.cword(
        '监控项+状态+监控内容+聚合算法+指标值+阈值+单位+告警降噪（压缩）',
        10,
        25,
      ),
      founder: Random.cname(),
      createTime: Random.datetime(),
    });
  }
  return list;
}

const overDonut = [
  {
    type: '业务指标告警',
    count: 600,
  },
  {
    type: '终端在线和入库告警',
    count: 200,
  },
  {
    type: '接口数据告警',
    count: 100,
  },
  {
    type: 'KAFKA中间件告警',
    count: 390,
  },
  {
    type: '主站系统运行告警',
    count: 400,
  },
];

function mocksmoothdata() {
  const count = moment().format('DD');
  const list = [];
  for (let i = 0; i < 5; i += 1) {
    for (let j = 1; j <= count; j += 1) {
      list.push({
        date: `${j}`,
        name: ['业务指标', '终端在线和入库', '接口数据', 'KAFKA中间件', '主站系统运行'][i % 5],
        value: Random.integer(180, 200),
      });
    }
  }
  return list;
}

export default {
  'GET /api-upms/upms_user/getCurrUserInfo': CurrUserInfo, // 根据token获取用户信息
  'GET /api-upms/upms_user/getCurrUserMenus': CurrUserMenus, // 根据token获取用户菜单
  // 基础平台检测，当前告警
  'GET /databeseMonitor/databeseMonitor/databaseEm': (req, res) => {
    const { count } = req.query;
    const data = mocksystemhistorylist(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
  // 基础平台检测，历史告警
  'GET /databeseMonitor/databeseMonitor/databaseEmHistroy': (req, res) => {
    // const {current,pageSize}= req.query;
    const count = 10;
    const data = mocksystemhistorylist(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

  // 指标环比数据查询条件“覆盖率”
  'POST /monitor/kpiData/fgl': (req, res) => {
    const count = 20;
    const data = mockchain(count, '覆盖率');
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
  // 指标环比数据查询条件“抄表率”
  'POST /monitor/kpiData/cbl': (req, res) => {
    const count = 40;
    const data = mockchain(count, '抄表率');
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
  // 指标环比数据查询条件“完整率”
  'POST /monitor/kpiData/wzl': (req, res) => {
    const count = 30;
    const data = mockchain(count, '完整率');
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

  // 计量业务告警： 告警概览（饼图）
  'GET /api/alarmmanage/overviewdonut': (req, res) => {
    res.json({
      data: {
        data: overDonut,
      },
    });
  },

  // 计量业务告警： 告警概览（曲线图）
  'GET /api/alarmmanage/overviewsmooth': (req, res) => {
    const data = mocksmoothdata();
    res.json({
      data: {
        data,
      },
    });
  },

  // 计量业务告警： 告警概览
  'GET /api/alarmmanage/overview': (req, res) => {
    const count = 30;
    const data = mockalarmover(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
  // 计量业务告警： 告警概览确认告警
  'GET /api/alarmmanage/configalarm': (req, res) => {
    const count = 10;
    const datas = mockalarmover(count);
    const data = datas.map(item => {
      item.configstatus = 0;
      return item;
    });

    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

  // 计量业务告警： 告警设定
  'GET /api/alarmmanage/alarmsetting': (req, res) => {
    const count = 50;
    const data = mockalarmsetting(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
};
