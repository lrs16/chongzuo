import mockjs from 'mockjs';

const { Random } = mockjs;

function mockfaultdetaillist(count) { // 故障明细表
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: Random.string('123456789', 14),
      datetime: Random.now(),
      faultClass: Random.cword(3, 8),
      faultProblem: Random.cword(5, 10),
      faultSum: Random.cword(5, 10),
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
      // faultStatus: ['待登记', '已登记', '已提交', '待审核', '审核中', '已审核', '待处理', '处理中', '已处理', '待关闭', '关闭中', '已关闭'][i % 12],
      faultStatus: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14][i % 15],
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
      faultName: Random.string('123', 10),
      faultHappentime: Random.now(),
      faultRecordtime: Random.now(),
      severity: [0, 1, 2][i % 3],
      dealResults: ['已处理', '未处理'][i % 2],
      faultSource: ['用户电话申告'][i % 1],
      sysModule: ['系统模块'][i % 1],
      faultType: ['系统应用', '网络安全', '数据库', '中间件', '软件'][i % 5],
      // faultworkStatus: ['待登记', '已登记', '已提交', '待审核', '审核中', '已审核', '待处理', '处理中', '已处理', '待关闭', '关闭中', '已关闭'][i % 12],
      faultworkStatus: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14][i % 15],
      faultLocat: ['故障的地点'][i % 1],
      informant: Random.cname(),
      informantCompany: ['xxxd单位'][i % 1],
      informantDepart: ['xxxd部门'][i % 1],
      review: Random.cname(),
      reviewCompany: ['xxxd单位'][i % 1],
      reviewDepart: ['xxxd部门'][i % 1],
      faultHandstartTime: Random.now(),
      recoveryTime: Random.now(),
      faultdealPerson: Random.cname(),
    });
  }
  return list;
};

// function mockfaultsearchdetailslist(count) { // 故障查询表详情页
//   const list = [];
//   for (let i = 0; i < count; i += 1) {
//     list.push({
//       faultID: Random.string('123456789', 14),
//       faultName: Random.string('123', 10),
//       faultHappentime: Random.now(),
//       faultRecordtime: Random.now(),
//       faultSource: ['xxx故障'][i % 1],
//       sysModule: ['配网采集'][i % 1],
//       faultLocat: ['机房'][i % 1],
//       severity: ['紧急', '重大', '一般'][i % 3],
//       faultSum: Random.word(8, 15),
//       scopeDesc: Random.word(8, 15),
//       upload:'',
//       regist: Random.cname(),
//       registDepart: ['xxxd部门'][i % 1],
//       registCompany: ['xxxd单位'][i % 1],
//     });
//   }
//   return list;
// };

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

  // 'POST /api/fault/faultsearchdetailslist': (req, res) => { // 故障查询表详情页
  //   const count = 30;
  //   const data = mockfaultsearchdetailslist(count);
  //   res.json({
  //     data: {
  //       data,
  //     },
  //   });
  // },

  'GET /api/fault/faultsearchdetailslist': (req, res) => { // 故障查询表详情页
    const { detailsid } = req.query;
    const faultsearchdetails = {
      detailsid,
      faultID: Random.string('123456789', 14),
      faultName: Random.string('123', 10),
      faultHappentime: Random.now(),
      faultRecordtime: Random.now(),
      faultSource: 'xxx故障',
      sysModule: '配网采集',
      faultLocat: '机房',
      severity: '紧急',
      faultSum: Random.word(8, 15),
      scopeDesc: Random.word(8, 15),
      upload: '',
      regist: Random.cname(),
      registDepart: 'xxxd部门',
      registCompany: 'xxxd单位',
    };
    res.json({
      faultsearchdetails,
    });
  },

};
