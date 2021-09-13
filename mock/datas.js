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
  { type: '业务指标告警', count: 600 },
  { type: '终端在线和入库告警', count: 200 },
  { type: '接口数据告警', count: 100 },
  { type: 'KAFKA中间件告警', count: 390 },
  { type: '主站系统运行告警', count: 400 },
];

function mocktypedonut(key) {
  const list = [];
  switch (key) {
    case '告警概览':
      for (let i = 0; i < 5; i += 1) {
        list.push({
          type: ['业务指标', '终端在线和入库', '接口数据', 'KAFKA中间件', '主站系统运行'][i % 5],
          value: Random.integer(100, 1000),
        });
      }
      break;
    case '业务指标监控告警':
      for (let i = 0; i < 6; i += 1) {
        list.push({
          type: ['终端覆盖率', '完整率', '自动抄表率', '关口0点采集', '关口整点采集', '售电量分析'][
            i % 6
          ],
          value: Random.integer(100, 1000),
        });
      }
      break;
    case '终端在线和入库告警':
      for (let i = 0; i < 3; i += 1) {
        list.push({
          type: ['终端在线率', '入库数量（整点）', '入库数量（0-7点）'][i % 3],
          value: Random.integer(100, 1000),
        });
      }
      break;
    case '接口数据核查告警':
      for (let i = 0; i < 5; i += 1) {
        list.push({
          type: [
            '抄表结算接口',
            '参数下发',
            '测量点主表生成',
            '费控指令-kafa指令超时',
            '档案同步接口',
          ][i % 5],
          value: Random.integer(100, 1000),
        });
      }
      break;
    case 'KAFKA消费告警':
      for (let i = 0; i < 9; i += 1) {
        list.push({
          type: [
            'kafka节点监控',
            '下行主题-低压相关',
            '下行主题-其他回复接口',
            '下行主题-广西102关口方面二区和安全接入区',
            '下行主题-广西102档案下发（关口相关）',
            '上行主题-低压相关',
            '上行主题-其他回复接口',
            '上行主题-广西102关口方面二区和安全接入区',
            '上行主题-广西102档案下发（关口相关）',
          ][i % 9],
          value: Random.integer(100, 1000),
        });
      }
      break;
    case '主站系统运行告警':
      for (let i = 0; i < 4; i += 1) {
        list.push({
          type: ['登录检测', '数据召测-低压', '数据召测-负控配变', '数据召测-厂站'][i % 4],
          value: Random.integer(100, 1000),
        });
      }
      break;
    default:
      for (let i = 0; i < 4; i += 1) {
        list.push({
          type: ['安全接入区', '安全I区', '安全II区', '安全III区'][i % 4],
          value: Random.integer(100, 1000),
        });
      }
      break;
  }
  return list;
}

function mocktypeline(key) {
  const count = moment().format('DD');
  const list = [];
  switch (key) {
    case '告警概览':
      for (let i = 0; i < 7; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '月度告警总数',
              '业务指标监控告警',
              '终端在线和入库告警',
              '接口数据核查告警',
              'KAFKA消费告警',
              'KAFKA消费（凌晨）告警',
              '主站系统运行告警',
            ][i % 7],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    case '业务指标监控告警':
      for (let i = 0; i < 7; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '月度业务指标监控告警总数',
              '终端覆盖率',
              '完整率',
              '自动抄表率',
              '关口0点采集',
              '关口整点采集',
              '售电量分析',
            ][i % 7],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    case '终端在线和入库告警':
      for (let i = 0; i < 4; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '月度终端在线和入库告警总数',
              '终端在线率',
              '入库数量（整点）',
              '入库数量（0-7点）',
            ][i % 4],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    case '接口数据核查告警':
      for (let i = 0; i < 6; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '月度接口数据核查告警总数',
              '抄表结算接口',
              '参数下发',
              '测量点主表生成',
              '费控指令-kafa指令超时',
              '档案同步接口',
            ][i % 6],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    case 'KAFKA消费告警':
      for (let i = 0; i < 10; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '月度KAFKA消费告警总数',
              'kafka节点监控',
              '下行主题-低压相关',
              '下行主题-其他回复接口',
              '下行主题-广西102关口方面二区和安全接入区',
              '下行主题-广西102档案下发（关口相关）',
              '上行主题-低压相关',
              '上行主题-其他回复接口',
              '上行主题-广西102关口方面二区和安全接入区',
              '上行主题-广西102档案下发（关口相关）',
            ][i % 6],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    case '主站系统运行告警':
      for (let i = 0; i < 5; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '月度主站系统告警总数',
              '登录检测',
              '数据召测-低压',
              '数据召测-负控配变',
              '数据召测-厂站',
            ][i % 6],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    case 'function':
      for (let i = 0; i < 2; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '功能开发',
              '软件运维',
            ][i % 2],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
    default:
      for (let i = 0; i < 4; i += 1) {
        for (let j = 1; j <= count; j += 1) {
          list.push({
            date: `${j}`,
            name: [
              '安全接入区', '安全I区', '安全II区', '安全III区'
            ][i % 4],
            value: Random.integer(0, 60),
          });
        }
      }
      break;
  }
  return list;
}

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

function mocksearchdata(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: Random.string('123456789', 5),
      title: Random.cword(
        'KAFKA消费情况：KAFKA  主题AutodataAsk消费异常，消息量连续增长超阈值告警,供售电量分析：波动值超过波动阈值0.1',
        10,
        25,
      ),
      source: ['用户电话申告', '企信'][i % 2],
      type: ['咨询', '缺陷', '故障', '数据处理', '其他'][i % 5],
      filledby: Random.cname(),
      handler: Random.cname(),
      state: Random.integer(1, 7),
      time: Random.datetime(),
      level: Random.cword('高中低', 1),
    });
  }
  return list;
}

function mockeventlistdata(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: Random.string('123456789', 5),
      creationtime: Random.datetime(),
      Declarant: Random.cname(),
      Declarantunit: '南方电网计量中心',
      Declarantdep: '运行维护部',
      type: ['咨询', '缺陷', '故障', '数据处理', '其他'][i % 5],
      eventobject: ['配网采集', '主网采集', '终端掉线', '配网档案', '实用话指标'][i % 5],
      filledby: Random.cname(),
      handler: Random.cname(),
      state: Random.integer(1, 7),
      level: Random.cword('高中低', 1),
    });
  }
  return list;
}

function mockreleasetodo(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      releaseNo: Random.string('123456789', 12),
      taskName: ['发布登记', '平台验证', '业务验证', '发布实施准备', '版本管理员审批', '版本管理员审批', '版本管理员审批', '科室负责人审批', '中心领导审批', '发布实施', '业务复核'][i % 11],
      t2: ['计划发布', '临时发布'][i % 2],
      t3: ['博联', '南瑞'][i % 2],
      t4: Random.cname(),
      t5: Random.cname(),
      t6: Random.datetime(),
      ret1: ['待验证', '已验证'][i % 2],
      ret2: ['前台功能 / 缺陷修复项', '后台功能/变更功能项'][i % 2],
      ret3: '系统对时',
      ret4: '电表对时',
      ret5: '前台界面查询慢',
      ret6: '测试内容及预期效果',
    });
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
    const { key } = req.query;
    const data = mocktypeline(key);
    res.json({
      data,
    });
  },

  // 计量业务告警： 告警概览
  'POST /api/alarmmanage/overview': (req, res) => {
    const count = 30;
    const data = mockalarmover(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

  // 计量业务告警： 业务指标告警（饼图）
  'GET /api/alarmmanage/typedonut': (req, res) => {
    const { key } = req.query;
    const donutdata = mocktypedonut(key);
    res.json({
      data: donutdata,
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

  // IT服务管理：事件待办
  'POST /api/event/queryTodoList': (req, res) => {
    const count = 50;
    const data = mocksearchdata(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

  // IT服务管理：事件查询
  'POST /api/event/queryList': (req, res) => {
    const count = 50;
    const data = mockeventlistdata(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },


  // IT服务： 发布待办
  'GET /api/release/todolist': (req, res) => {
    const count = 50;
    const rows = mockreleasetodo(count);
    res.json({
      data: {
        rows,
        total: count,
      },
    });
  },
};
