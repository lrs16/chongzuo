import mockjs from 'mockjs';

const descriptions = [
  '(Agent) Host.cpu.total(推荐)',
  '突发性能实例-预支CPU积分',
  '突发性能实例-已消耗CPU积分',
  '(ECS) 系统盘总读BPS',
  '(ECS) ECS.SystemDiskReadOps',
  '(ECS) 系统盘总写BPS',
];

const alarmtypes = ['业务指标警告', '接口告警', 'KAFKA中间件告警', '主站系统运行'];
const resourcestypes = ['全部资源', '服务器', '路由', '数据库'];

const alarmrules = [
  '可用性 <60 Warn 连续3次就告警',
  '请求超时 >60 Warn 连续3次就告警',
  '内存空间<30% 连续2次就告警',
  '接口延迟>50 Warn 连续2次就告警',
];
function rulesettingList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      ruleid: `rule-${i}`,
      description: descriptions[i % 6],
      alarmtype: alarmtypes[i % 4],
      resourcestype: resourcestypes[i % 4],
      alarmrule: alarmrules[i % 4],
      status: ['0', '1', '2'][i % 3],
      enable: ['0', '1'][i % 2],
      Objects: ['安全组', '配置组'][i % 2],
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
    });
  }

  return list;
}

let sourceData;

function getSettingList(req, res) {
  const params = req.query;

  const count = params.count * 1 || 20;

  const result = rulesettingList(count);
  sourceData = result;
  return res.json(result);
}
function posttSettingList(req, res) {
  const { /* url = '', */ body } = req;
  // const params = getUrlParams(url);
  const { method, id } = body;
  // const count = (params.count * 1) || 20;
  let result = sourceData;

  switch (method) {
    case 'delete':
      result = result.filter(item => item.id !== id);
      break;
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = Object.assign(item, body);
        }
      });
      break;
    case 'post':
      result.unshift({
        body,
        id: `fake-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

const operatList = [
  {
    operatid: '1234561',
    operattime: '2020-02-15 15:59:48',
    account: 'xu_hc',
    name: '徐华聪',
    recording: '2',
    status: '1',
  },
  {
    operatid: '1234562',
    operattime: '2020-02-15 15:59:48',
    account: 'xu_hc',
    name: '徐华聪',
    recording: '2',
    status: '0',
  },
  {
    operatid: '1234563',
    operattime: '2020-02-15 15:59:48',
    account: 'xu_hc',
    name: '徐华聪',
    recording: '0',
    status: '1',
  },
  {
    operatid: '1234564',
    operattime: '2020-02-15 15:59:48',
    account: 'xu_hc',
    name: '徐华聪',
    recording: '0',
    status: '0',
  },
];

const alarmhistory = [
  {
    historyid: '1',
    alarmtime: '2020-01-01 14:10',
    restoretime: '2020-01-01 19:55',
    duration: '3h 45m 0s',
    status: '0',
    recording: '1',
  },
  {
    historyid: '2',
    alarmtime: '2020-01-01 14:10',
    restoretime: '2020-01-01 19:55',
    duration: '3h 45m 0s',
    status: '0',
    recording: '2',
  },
  {
    historyid: '3',
    alarmtime: '2020-01-01 14:10',
    restoretime: '2020-01-01 19:55',
    duration: '3h 45m 0s',
    status: '1',
    recording: '0',
  },
  {
    historyid: '4',
    alarmtime: '2020-01-01 14:10',
    restoretime: '2020-01-01 19:55',
    duration: '3h 45m 0s',
    status: '2',
    recording: '2',
  },
  {
    historyid: '5',
    alarmtime: '2020-01-01 14:10',
    restoretime: '2020-01-01 19:55',
    duration: '3h 45m 0s',
    status: '1',
    recording: '1',
  },
];

const notichistory = [
  {
    notichid: '1',
    content: '资源：172 16 11 50，告警：CS 实例负载过高',
    sendingtime: '2020-01-01 19:55',
    sendingmethod: '短信',
    receiver: '张晓军',
    receivernumber: '1585454875',
    status: '0',
  },
  {
    notichid: '1',
    content: '资源：172 16 11 50，告警：CS 实例负载过高',
    sendingtime: '2020-01-01 19:55',
    sendingmethod: '短信',
    receiver: '张晓军',
    receivernumber: '1585454875',
    status: '1',
  },
  {
    notichid: '1',
    content: '资源：172 16 11 50，告警：CS 实例负载过高',
    sendingtime: '2020-01-01 19:55',
    sendingmethod: '短信',
    receiver: '张晓军',
    receivernumber: '1585454875',
    status: '1',
  },
];

const { Random } = mockjs;

export default {
  'GET /api/alarm/operatlist': operatList,
  'GET /api/alarm/details': (req, res) => {
    const { detailsid } = req.query;
    const alarmInfo = {
      detailsid,
      // account: Random.detailname(),
      grade: 0,
      ackstatus: 1,
      eliminate: 0,
      category: '接口程序',
      childcategory: '抄表结算接口',
      detailname: '进程异常行为',
      notification: 1,
      latesttime: '2019-08-26 11:08:53',
      eliminatetime: '2019-08-26 15:08:53',
      lasttime: '2019-08-25 11:08:53',
      duration: Random.time('HH:mm:ss'),
      eventlist: '正常',
      eventnumber: 'JKCBJSDY20200',
      alarmrules: 'SQL核查结果”未处理“数量超过阈值2000',
      resoure: Random.ip(),
      remarks:
        '接口程序设计时认为主网102终端（终端通讯规约为46）不同步到计量系统；另一方面接口程序上线启动初期，经常有大量档案从营销推送到计量系统，因此接口程序采用多线程执行方式提高同步效率。从代码分析来看，程序没对过滤条件终端通讯规约为46的变量进行多线程同步处理，在接口长期运行的情况下有一定概率会导致某些线程没有获取这个过滤的条件的变量，缺失过滤条件会造成接口重复操作早期的中间库数据，重复处理这些旧数据会造成数据丢失或数据修改成旧版本。',
    };
    res.json({
      alarmInfo,
      alarmhistory,
      notichistory,
    });
  },
  'GET /api/setting_list': getSettingList,
  'POST /api/setting_list': posttSettingList,
};
