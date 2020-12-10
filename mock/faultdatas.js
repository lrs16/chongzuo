import mockjs from 'mockjs';
const { Random } = mockjs;

function mockfaultdetaillist(count) {
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

export default {
  // IT服务管理--故障管理
  'POST /api/fault/faultdetailList': (req, res) => {
    const count = 50;
    const data = mockfaultdetaillist(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
};
