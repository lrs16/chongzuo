import mockjs from 'mockjs';
const { Random } = mockjs;

function mockfaultdetaillist(count) { // 故障明细表
    const list = [];
    for (let i = 0; i < count; i += 1) {
      list.push({
        id: Random.string('123456789', 14),
        datetime: Random.now(),
        faultClass: Random.cword(3,8),
        faultProblem: Random.cword(5,10),
        faultSum: Random.cword(5,10),
        influScope: ['影响范围'][i % 1],
        treat: Random.cword(
          '1、通过堡垒机登录接口服务',
          10,
          25,
        ),
        faultMeasure: Random.cword(
          '改进措施及故障原因',
          10,
          25,
        ),
        reportSubmit: ['是', '否'][i % 2],
        faultUnit: ['XX单位扣1分'][i % 1],
        proResult: ['是', '否'][i % 2],
        itemDeduc: ['扣分细项'][i % 1],
      });
    }
    return list;
};

function mockfaulttodolist(count) { // 故障待办表
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      faultID: Random.string('123456789', 14),
      faultTitle: Random.string('123', 10),
      faultSource: ['用户电话申告'][i % 1],
      faultClass: ['', '硬件缺陷', '协同缺陷'][i % 3],
      declarant: Random.cname(),
      currProceLink: ['故障登记'][i % 1],
      faultStatus: ['待响应'][i % 1],
      overTime: Random.now(),
      sendTime: Random.now(),
      priority: ['高', '中', '低'][i % 3],
    });
  }
  return list;
};

function mockfaultsearchlist(count) { // 故障查询表
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      faultID: Random.string('123456789', 14),
      faultTitle: Random.string('123', 10),
      faultSource: ['用户电话申告'][i % 1],
      faultClass: ['', '硬件缺陷', '协同缺陷'][i % 3],
      applicant:[''],
      declarant: Random.cname(),
      faultworkStatus: ['已登记', '已审核待处理', '已派单待审核'][i % 3],
      regist: Random.cname(),
      createtime: Random.now(),
      priority: ['高', '中', '低'][i % 3],
    });
  }
  return list;
};

export default {
  // IT服务管理--故障管理
  'POST /api/fault/faultdetailList': (req, res) => { // 故障明细表
    const count = 90;
    const data = mockfaultdetaillist(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

  'POST /api/fault/faulttodolist': (req, res) => { // 故障待办表
    const count = 32;
    const data = mockfaulttodolist(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
  
  'POST /api/fault/faultsearchlist': (req, res) => { // 故障查询表
    const count = 30;
    const data = mockfaultsearchlist(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },

};
