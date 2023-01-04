import mockjs from 'mockjs';

const { Random } = mockjs;

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

const departments = [
  {
    key: '1',
    value: '运营部',
    code: '运营部',
  },
  {
    key: '2',
    value: '运维部',
    code: '运维部',
  },
  {
    key: '3',
    value: '业务部',
    code: '业务部',
  },
  {
    key: '4',
    value: '开发部',
    code: '开发部',
  },
  {
    key: '5',
    value: '客服中心',
    code: '客服中心',
  },
  {
    key: '6',
    value: '配置管理中心',
    code: '配置管理中心',
  },
];

const Jurisdictions = ['超级管理员', '部门管理', '知识管理', '普通用户', '系统配置管理'];

function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      key: `${i}`,
      id: Math.ceil(Math.random() * 100000) + 100000,
      owner: user[i % 10],
      name: Random.cname(),
      application: ['业务应用系统', '业务系统', '测试导入'][i % 3],
      department: ['运营部', '运维部', '业务部', '客服中心', '配置管理中心'][i % 5],
      Jurisdiction: Jurisdictions[i % 5],
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      username: Random.first(),
    });
  }

  return list;
}

let sourceData;

function getFakeList(req, res) {
  const params = req.query;

  const count = params.count * 1 || 8;

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

export default {
  'GET /api/usermanage': getFakeList,
  'POST /api/usermanage': postFakeList,
  'POST /api/newuser': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/departments': getFakeList,
  'GET /api/getsysdatas': (req, res) => {
    res.json({
      departments,
      Jurisdictions,
    });
  },
};
