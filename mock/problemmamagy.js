import mockjs from 'mockjs';
import moment from 'moment';
const { Random } = mockjs;

const problemList = {
  questionNumber: 'questionNumber',
  questionSource: 'questionSource',
  questionClass: 'questionClass',
  urgency: 'urgency',
  influenceDegree: 'influenceDegree',
  priority: 'priority',
  applicant: 'applicant',
  Department: 'Department',
  filledBy: 'filledBy',
  contactNumber: 'contactNumber',
  registTime: '2020/11/26',
  orderCreationtime: '2022/10/9',
  questionTitle: 'questionTitle',
  problemDescription: 'problemDescription',
};

// function mockBesolve(count) {
//   const list = [];
//   for (let i = 0;i < count; i += 1) {
//     list.push({
//       numberProblem: Random.string('123',5),
//       questionTitle:  Random.cword(
//         'XX事件发布标题1,XX问题发布标题2,XX巡检发布标题3',
//         10,
//         25,
//       ),
//       problemSource: ['重复性分析事件1','重复性分析事件2','重复性分析事件3'][i % 2],
//       problemClass: ['类型1','类型2','类型3','类型4'][i % 2],
//       currentProcess: ['问题登记','问题审核','问题处理','问题确认','确认会签','问题关闭'][i%2],
//       sender: Random.cname(),
//       sendTime: Random.datetime(),
//       priority:['高','中','低'][i%2],
//       state:[1,2,3,4,5,6][i%2]
//     })
//   }
//   return list;
// }

function mockEvent(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: Random.string('123', 2),
      eventNumber: Random.string('123456', 5),
      title: ['重复性分析事件1', '重复性分析事件2', '重复性分析事件3'][i % 2],
      statue: ['高', '中', '低'][i % 2],
      associationType: ['高', '中', '低'][i % 2],
    });
  }
  return list;
}

function mockRealse(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: Random.string('123', 2),
      realseNumber: Random.string('123456', 5),
      title: ['重复性分析事件1', '重复性分析事件2', '重复性分析事件3'][i % 2],
      statue: ['高', '中', '低'][i % 2],
      associationType: ['高', '中', '低'][i % 2],
    });
  }
  return list;
}

const besolveList = [
  {
    numberProblem: '13223',
    questionTitle: 'X发XXX2标3XXX,11事标,,布XX,件X',
    problemSource: '重复性分析事件1',
    problemClass: '类型1',
    currentProcess: '问题登记',
    sender: '蒋平',
    sendTime: '1980-07-10 23:02:10',
    priority: '高',
    state: 1,
  },
  {
    numberProblem: '13223',
    questionTitle: 'X发XXX2标3XXX,11事标,,布XX,件X',
    problemSource: '重复性分析事件1',
    problemClass: '类型1',
    currentProcess: '问题审核',
    sender: '蒋平',
    sendTime: '1980-07-10 23:02:10',
    priority: '高',
    state: 2,
  },
  {
    numberProblem: '13223',
    questionTitle: 'X发XXX2标3XXX,11事标,,布XX,件X',
    problemSource: '重复性分析事件1',
    problemClass: '类型1',
    currentProcess: '问题处理',
    sender: '蒋平',
    sendTime: '1980-07-10 23:02:10',
    priority: '高',
    state: 3,
  },
  {
    numberProblem: '13223',
    questionTitle: 'X发XXX2标3XXX,11事标,,布XX,件X',
    problemSource: '重复性分析事件1',
    problemClass: '类型1',
    currentProcess: '问题确认',
    sender: '蒋平',
    sendTime: '1980-07-10 23:02:10',
    priority: '高',
    state: 4,
  },
  {
    numberProblem: '13223',
    questionTitle: 'X发XXX2标3XXX,11事标,,布XX,件X',
    problemSource: '重复性分析事件1',
    problemClass: '类型1',
    currentProcess: '确认会签',
    sender: '蒋平',
    sendTime: '1980-07-10 23:02:10',
    priority: '高',
    state: 5,
  },
  {
    numberProblem: '13223',
    questionTitle: 'X发XXX2标3XXX,11事标,,布XX,件X',
    problemSource: '重复性分析事件1',
    problemClass: '类型1',
    currentProcess: '问题关闭',
    sender: '蒋平',
    sendTime: '1980-07-10 23:02:10',
    priority: '高',
    state: 6,
  },
];

const problemRegistration = {
  questionNumber: 'questionNumber',
  questionSource: 'questionSource',
  problemClass: 'problemClass',
  urgency: 'urgency',
  influenceDegree: 'influenceDegree',
  priority: 'priority',
  applicant: 'applicant',
  departmentApplicant: 'departmentApplicant',
  filledBy: 'filledBy',
  contactNumber: 'contactNumber',
  registrationTime: '2020-12-3-3',
  orderCreatetime: '2020-12-3-3',
  questionTitle: 'questionTitle',
  problemDescription: 'problemDescription',
};
// 问题审核
const problemreviewInfo = {
  auditUnit: 'auditUnit',
  auditDepartment: 'auditDepartment',
  Reviewer: 'Reviewer',
  auditTime: '2020-3-3',
  auditOpinion: 'auditOpinion',
};

// 问题处理
const problemsolvingInfo = {
  processingUnit: 'processingUnit',
  processingDepartment: 'processingDepartment',
  handler: 'handler',
  orderReceivingtime: 'orderReceivingtime',
  processingTime: 'processingTime',
  processingResults: 'processingResults',
  solution: 'solution',
};

//  问题确认
const problemconfirmInfo = {
  confirmationUnit: 'confirmationUnit',
  confirmationDepartment: 'confirmationDepartment',
  confirmer: 'confirmer',
  confirmResults: 'confirmResults',
  confirmTime: 'confirmTime',
  confirmOpinion: 'confirmOpinion',
};

const confirmationcounterInfo = {
  confirmationUnit: 'confirmationUnit',
  confirmationDepartment: 'confirmationDepartment',
  confirmer: 'confirmer',
  confirmOpinion: 'confirmOpinion',
};

const problemcloseInfo = {
  closeUnit: 'closeUnit',
  confirmationDepartment: 'confirmationDepartment',
  confirmer: 'confirmer',
  confirmOpinion: 'confirmOpinion',
};

export default {
  'GET /api/problemList': problemList,
  // 'POST /api/besolveList': (req, res) => {
  //   const count = 50;
  //   const data = mockBesolve(count);
  //   res.json({
  //     data: {
  //       data,
  //       total: count,
  //     },
  //   });
  // }
  'GET /api/besolveList': besolveList,
  'GET /api/problemRegistration': problemRegistration,
  'GET /api/problemreviewInfo': problemreviewInfo,
  'GET /api/problemsolvingInfo': problemsolvingInfo,
  'GET /api/problemconfirmInfo': problemconfirmInfo,
  'GET /api/confirmationcounterInfo': confirmationcounterInfo,
  'GET /api/problemcloseInfo': problemcloseInfo,
  'POST /api/mockEvent': (req, res) => {
    const count = 50;
    const data = mockEvent(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
  'POST /api/mockRealse': (req, res) => {
    const count = 50;
    const data = mockRealse(count);
    res.json({
      data: {
        data,
        total: count,
      },
    });
  },
};
