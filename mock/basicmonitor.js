import Mock from 'mockjs';

const { Random } = Mock;

function mockbasichostlist() {
  const list = [];
  const count = 20;
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      alarmstatus: [0, 1, 2, 3][i % 4],
      name: Random.word(8, 15),
      status: [0, 1][i % 2],
      ip: Random.ip(),
      monitorType: ['流量', '进程', '磁盘', '内存', 'CPU', 'WEB响应时间'][i % 6],
      type: ['CPU', '内存', '磁盘', 'WEB响应时间'][i % 4],
      cpuUsage: Random.integer(20, 70),
      memoryUsage: Random.integer(40, 100),
      load: Random.integer(0, 30),
      ioReadRate: Random.integer(0, 30),
      ioWriteRate: Random.integer(0, 30),
      applyLabel: ['windows', 'oracle', 'mysql'],
      rate: Random.integer(50, 100),
    });
  }
  return list;
}

let sourceData;

function getHostList(req, res) {
  const params = req.query;

  const count = params.count * 1 || 20;

  const result = mockbasichostlist(count);
  sourceData = result;
  return res.json(result);
}

function postHostList(req, res) {
  const { /* url = '', */ body } = req;
  const { method, id } = body;
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
        id: `${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

export default {
  'GET /api/mockhostlist': getHostList,
};
