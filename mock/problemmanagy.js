import mockjs from 'mockjs';
import moment from 'moment';
const { Random } = mockjs;

const problemList = {
  questionNumber:'questionNumber',
  questionSource:'questionSource',
  questionClass:'questionClass',
  urgency:'urgency',
  influenceDegree:'influenceDegree',
  priority:'priority',
  applicant:'applicant',
  Department:'Department',
  filledBy:'filledBy',
  contactNumber:'contactNumber',
  registTime:'2020/11/26',
  orderCreationtime:'2022/10/9',
  questionTitle:'questionTitle',
  problemDescription:'problemDescription',
}

function mockBesolve(count) {
  const list = [];
  for (let i = 0;i < count; i += 1) {
    list.push({
      numberProblem: Random.string('123',5),
      questionTitle:  Random.cword(
        'XX事件发布标题1,XX问题发布标题2,XX巡检发布标题3',
        10,
        25,
      ),
      problemSource: ['重复性分析事件1','重复性分析事件2','重复性分析事件3'][i % 2],
      problemClass: ['类型1','类型2','类型3','类型4'][i % 2],
      currentProcess: ['问题登记','问题审核','问题处理','问题确认','确认会签','问题关闭'][i%2],
      sender: Random.cname(),
      sendTime: Random.datetime(),
      priority:['高','中','低'][i%2]
    })
  }
  return list;
}

export default {
  'GET /api/problemList':problemList,
  'POST /api/besolveList': (req, res) => {
    const count = 50;
    const data = mockBesolve(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  }
}