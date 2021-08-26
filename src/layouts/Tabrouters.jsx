import React, { useEffect } from 'react';


// 工单处理或工单详情
const alonepath = [
  { path: '/ITSM/eventmanage/to-do/record/workorder' },
  { path: '/ITSM/eventmanage/query/details' },
  { path: '/ITSM/faultmanage/todolist/record' },
  { path: '/ITSM/faultmanage/querylist/record' },
  { path: '/ITSM/problemmanage/besolveddetail/workorder' },
  { path: '/ITSM/problemmanage/problemquery/detail' },
  { path: '/ITSM/demandmanage/to-do/record/workorder' },
  { path: '/ITSM/demandmanage/query/details' },
  { path: '/ITSM/operationplan/operationplanform' },
  { path: '/ITSM/operationplan/operationplansearchdetail' },
  { path: '/ITSM/operationreport/weeklyreport/detailSoft' },
  { path: '/ITSM/operationreport/weeklyreport/computerroomreportdetail' },
  { path: '/ITSM/operationreport/weeklyreport/databasereportdetail' },
  { path: '/ITSM/operationreport/weeklyreport/otherreportdetail' },
  { path: '/ITSM/operationreport/monthlyreport/monthdetailSoft' },
  { path: '/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail' },
  { path: '/ITSM/operationreport/monthlyreport/monthdatabasereportdetail' },
  { path: '/ITSM/operationreport/monthlyreport/monthotherreportdetail' },
  { path: '/ITSM/knowledgemanage/:id/operation' },
  { path: '/ITSM/servicequalityassessment/detailserviceprovidermaintenance' },
  { path: '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform' },
  { path: '/ITSM/servicequalityassessment/addserviceprovidermaintenance' },
  { path: '/ITSM/servicequalityassessment/detailserviceprovidermaintenance' },
  { path: '/ITSM/servicequalityassessment/detailscoringrulesmaintenance' },
  { path: '/ITSM/servicequalityassessment/detailscoringrulesmaintenance' },
  { path: '/ITSM/servicequalityassessment/creditcard/creditcardregisterdetail' },
];

// 登记或新建
const multiplepath = [
  { path: '/ITSM/eventmanage/registration', type: 'event' },
  { path: '/ITSM/faultmanage/registration', type: 'fault' },
  { path: '/ITSM/problemmanage/registration', type: 'problem' },
  { path: '/ITSM/demandmanage/registration', type: 'demand' },
  { path: '/ITSM/operationplan/operationplanfillin', type: 'operation' },
  { path: '/ITSM/operationreport/weeklyreport/softreport', type: 'softreport' },
  { path: '/ITSM/operationreport/weeklyreport/computerroomreport', type: 'computerroomreport' },
  { path: '/ITSM/operationreport/weeklyreport/databasereport', type: 'databasereport' },
  { path: '/ITSM/operationreport/weeklyreport/otherreport', type: 'otherreport' },
  { path: '/ITSM/operationreport/monthlyreport/monthotherreport', type: 'monthotherreport' },
  { path: '/ITSM/operationreport/monthlyreport/monthdatabasereport', type: 'monthdatabasereport' },
  { path: '/ITSM/operationreport/monthlyreport/monthcomputerroomreport', type: 'monthcomputerroomreport' },
  { path: '/ITSM/operationreport/monthlyreport/monthsoftreport', type: 'monthsoftreport' },
  { path: '/ITSM/knowledgemanage/myknowledge/new', type: 'knowledge' },
  { path: '/ITSM/releasemanage/registration', type: 'release' },
  { path: '/ITSM/servicequalityassessment/addserviceprovidermaintenance', type: 'addscoringrulesmaintenance' },
  { path: '/ITSM/servicequalityassessment/creditcard/creditcardregister', type: 'creditcardregister' },
  { path: '/ITSM/servicequalityassessment/addscoringrulesmaintenance', type: 'addscoringrulesmaintenance' },
  { path: '/ITSM/servicequalityassessment/creditcard/creditcardregister', type: 'creditcardregister' },
]
function Tabrouters(props) {
  const { Changealonepath, Changemultiple } = props;
  useEffect(() => {
    Changealonepath(alonepath);
    Changemultiple(multiplepath);
  }, [])
  return null;
}

export default Tabrouters;