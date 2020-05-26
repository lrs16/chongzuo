import mockjs from 'mockjs';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const icons = ['dropbox', 'apple', 'windows', 'ie', 'chrome', 'github', 'aliwangwang', 'twitter'];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];
const jobtitles = ['计量业务巡检', '主机健康巡检'];
const scenedes = [
  '在ansible管理节点上生成一对ssh密钥,并把管理节点的公钥拷贝给被管理节点。',
  '将截取IP地址的命令赋值给shell_cmd变量，然后通过ansible执行`echo $shell_cmd`命令打印出截取到的IP地址。',
  '在管理节点上执行shell脚本，脚本在被管理节点上。',
  '脚本在主控端（管理节点），但需要在客户机上执行，可以用script模块。',
  '在我的管理节点中的root目录里存在一个zabbix_3.0.4.orig.tar.gz文件，这个文件需要批量下发给被管理节点。',
];

function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      scriptID: `Script-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      scenede: scenedes[i % 5],
      name: titles[i % 8],
      scenedetitle: jobtitles[i % 2],
      source: ['手动录入', '本地上传'][i % 2],
      application: ['业务应用系统', '业务系统', '测试导入'][i % 3],
      avatar: avatars[i % 8],
      sceneicon: icons[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['shell', 'bat', 'perl', 'python', 'powershell'][i % 5],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      subDescription: desc[i % 5],
      description:
        '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3',
        },
      ],
    });
  }

  return list;
}

let sourceData;

function getFakeList(req, res) {
  const params = req.query;

  const count = params.count * 1 || 20;

  const result = fakeList(count);
  sourceData = result;
  return res.json(result);
}

function postFakeList(req, res) {
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

const reportdatas = [
  {
    id: 'report1',
    title: '报告一',
    href: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  },
  {
    id: 'report2',
    title: '报告二',
    href: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  },
  {
    id: 'report3',
    title: '报告三',
    href: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  },
  {
    id: 'report4',
    title: '报告四',
    href: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  },
];

function postScriptList(req, res) {
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
        id: `Script-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];

const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars2[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars2[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars2[4],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars2[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
];
const scriptList = [
  {
    id: '1',
    code: 'TXDD001',
    name: '甲骨文删除',
    type: '业务系统',
    founder: '曲小蝶',
    modifier: '张小枫',
    creationtime: '2019.11.28',
    source: '手动输入',
    Releasestate: '发布中',
  },
  {
    id: '2',
    code: 'TXDD002',
    name: '甲骨文删除1',
    type: '业务系统',
    founder: '曲小蝶',
    modifier: '张小枫',
    creationtime: '2019.11.28',
    source: '手动输入',
    Releasestate: '发布中',
  },
  {
    id: '3',
    code: 'TXDD003',
    name: '甲骨文删除2',
    type: '业务系统',
    founder: '曲小蝶',
    modifier: '张小枫',
    creationtime: '2019.11.28',
    source: '手动输入',
    Releasestate: '发布中',
  },
  {
    id: '4',
    code: 'TXDD003',
    name: '甲骨文删除2',
    type: '业务系统',
    founder: '曲小蝶',
    modifier: '张小枫',
    creationtime: '2019.11.28',
    source: '手动输入',
    Releasestate: '发布中',
  },
  {
    id: '5',
    code: 'TXDD003',
    name: '甲骨文删除2',
    type: '业务系统',
    founder: '曲小蝶',
    modifier: '张小枫',
    creationtime: '2019.11.28',
    source: '手动输入',
    Releasestate: '发布中',
  },
  {
    id: '6',
    code: 'TXDD003',
    name: '甲骨文删除2',
    type: '业务系统',
    founder: '曲小蝶',
    modifier: '张小枫',
    creationtime: '2019.11.28',
    source: '手动输入',
    Releasestate: '发布中',
  },
];
const ResourcesList = [
  {
    resoureid: 'resoure-01',
    resourename: '172.16.4.76-oracle',
    resoureip: '172.16.4.76',
    tag: ['智能运维平台'],
    Updatetime: '2019-08-26 11:08:53',
    status: '在线',
    agent: true,
  },
  {
    resoureid: 'resoure-02',
    resourename: '172.16.4.76-360',
    resoureip: '172.16.4.76',
    tag: ['智能运维平台', '运维可视化'],
    Updatetime: '2019-08-26 11:08:53',
    status: '在线',
    agent: false,
  },
  {
    resoureid: 'resoure-03',
    resourename: '172.16.4.76-shall',
    resoureip: '172.16.4.76',
    tag: ['智能运维平台', '运维可视化', '网络监控'],
    Updatetime: '2019-08-26 11:08:53',
    status: '在线',
    agent: true,
  },
];

const DetailsList = [
  {
    detailsid: 'details-01',
    grade: 0,
    ackstatus: 1,
    eliminate: 0,
    category: '接口程序',
    detailname: '进程异常行为',
    notification: 1,
    latesttime: '2019-08-26 11:08:53',
    resoure: '172.16.4.76-shall',
  },
  {
    detailsid: 'details-02',
    grade: 1,
    ackstatus: 0,
    eliminate: 1,
    category: '采集指标',
    detailname: '敏感文件篡改',
    notification: 0,
    latesttime: '2019-08-26 11:08:53',
    resoure: '172.16.4.76-shall',
  },
  {
    detailsid: 'details-03',
    grade: 2,
    ackstatus: 0,
    eliminate: 2,
    category: 'KAFKA中间件',
    detailname: '异常事件',
    notification: 0,
    latesttime: '2019-08-26 11:08:53',
    resoure: '172.16.4.76-shall',
  },
];

const sysuser = [
  {
    userId: '1',
    name: '曲小蝶',
    email: '123456@qq.com',
    phone: '13768842220',
    status: '有效',
  },
  {
    userId: '2',
    name: '张小枫',
    email: '987654@qq.com',
    phone: '17736612220',
    status: '无效',
  },
  {
    userId: '3',
    name: '何光',
    email: '654321@qq.com',
    phone: '15564584555',
    status: '有效',
  },
];
export const getFactoryTypes = [
  {
    key: '0',
    name: '工厂',
  },
  {
    key: '1',
    name: '车间',
  },
  {
    key: '2',
    name: '工段',
  },
];
function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}

export default {
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'POST /api/fake_list': postFakeList,
  'GET /api/captcha': getFakeCaptcha,
  // mock脚本管理列表,GET后面记得打空格~~~~~~
  'GET /api/userList': sysuser,
  'POST /api/userList': sysuser,
  'GET /api/factoryTypes': getFactoryTypes,

  'GET /api/script': getFakeList,
  'POST /api/script': postScriptList,
  'GET /api/report_list': reportdatas,

  'GET /api/resouresList': ResourcesList,

  'GET /api/detailsList': DetailsList,

  // MOCK菜单与权限
  'GET /api/sysmenus': [
    {
      path: '/user/login',
      name: 'login',
      locale: 'menu.login',
      exact: 'true',
      hideInMenu: 'true',
      authority: '',
    },
    {
      path: '/user/register',
      name: 'register',
      exact: 'true',
      locale: 'menu.register',
      hideInMenu: 'true',
      authority: '',
    },
    {
      path: '/user/register-result',
      name: 'register-result',
      exact: 'true',
      locale: 'menu.register',
      hideInMenu: 'true',
      authority: '',
    },
    {
      path: '/automation',
      name: 'automation',
      dynamic: 'true',
      icon: 'form',
      locale: 'menu.automation',
      authority: 'admin',
      children: [
        {
          path: '/automation/monitor',
          name: 'monitor',
          icon: 'dashboard',
          exact: 'true',
          locale: 'menu.automation.monitor',
          authority: 'admin',
        },
        {
          path: '/automation/opsscene',
          name: 'opsscene',
          icon: 'control',
          exact: 'true',
          locale: 'menu.automation.opsscene',
          authority: 'admin',
        },
        {
          path: '/automation/scriptmanage',
          name: 'scriptmanage',
          icon: 'database',
          exact: 'true',
          locale: 'menu.automation.scriptmanage',
          authority: 'admin',
        },
        {
          path: '/automation/jobexecut',
          name: 'jobexecut',
          icon: 'profile',
          exact: 'true',
          locale: 'menu.automation.joblist',
          authority: 'admin',
        },
        {
          path: '/automation/timedjob',
          name: 'timedjob',
          icon: 'history',
          exact: 'true',
          locale: 'menu.automation.timedjob',
          authority: 'user',
        },
        {
          path: '/automation/resourcemanage',
          name: 'resourcemanage',
          icon: 'cloud-server',
          exact: 'true',
          locale: 'menu.automation.resourcemanage',
        },
      ],
    },
  ],
};
