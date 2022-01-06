import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Icon,
  message,
  Spin
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import Development from './components/Development';
import ThisweekMaintenance from './components/ThisweekMaintenance';
import ServiceCompletion from './components/ServiceCompletion';
import ThisWeekitsm from './components/ThisWeekitsm';
import DefectTracking from './components/DefectTracking';
import LastweekHomework from './components/LastweekHomework';
import ServiceTableone from './components/ServiceTableone';
import EventTop from './components/EventTop';
import PatrolAndExamine from './components/PatrolAndExamine';
import UpgradeList from './components/UpgradeList';
import ServiceCompletionone from './components/ServiceCompletionone';
import AddForm from './components/AddForm';

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const formincontentLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const { MonthPicker } = DatePicker;
const { TextArea } = Input;
let initial = false;
let getInfoparams = false;

const TopnAnalysis = [
  {
    field1: '1',
    field2: '档案',
    field3: '【档案数据修改】',
    field4: '',
    field5: `原因:基本上为需要删除冗余数据、修改存量数据以及批量修改关键字段等
    措施:
    冗余数据、存量数据帮助用户进行后台维护。修改关键字段可以与营销运维人员协商，在营销系统后台批量修改数据的时候更新操作时间字段，计量通过接口同步；`
  },
  {
    field1: '2',
    field2: '档案',
    field3: '【指标核查】',
    field4: '',
    field5: `原因：
    （1）用户刚修改了档案，但是由于系统没有进行重算，所以导致指标还没有变更；
    （2）电表、终端等表示关联不上
    措施：
    （1）告知用户系统的重算策略；
    （2）与用户确认档案并后台维护；`
  },
  {
    field1: '3',
    field2: '档案',
    field3: '【主网数据维护】',
    field4: '',
    field5: `原因：
    主网档案没有数据来源，需要协助用户进行后台维护档案，比如修改主网电表、厂站终端的运行状态，删除主网电表等；
    措施：
    （1）协助用户后台维护主网档案，根据用户需求，进一步完善主网工具，并在2020年进行主网数据同源的档案整改工作，使主网数据可以通过营销接口进行同步；
    （2）培训解决；`
  },
  {
    field1: '4',
    field2: '档案',
    field3: '【营销档案质量】',
    field4: '',
    field5: `原因：
    基本上都是用户营销维护档案不规范，主要字段为版本规约、测量点号和通信地址等，导致推送到中间库后计量同步不了；
    措施：
    （1）告知用户同步失败原因（JK校验异常），要求用户在营销按规范维护档案；
    （2）培训解决；`
  },
  {
    field1: '5',
    field2: '采集',
    field3: '【配网采集】',
    field4: '',
    field5: `问题：抄不到冻结数
    （1）召测日冻结，终端返回ffff,ff无效数据或终端回否认现场核查处理终端问题。
    （2）召测日冻结时间错误，计量档案正常，召测档案查看终端内费率为4正常，查看日冻结的报文发现终端回的上行报文的费率错误无法正常解析。现场处理咨询终端厂家。
    （3）日冻结可以回数，前台显示正常。
    （4）电表无尖峰平谷数据，单费率电表采不了尖峰平谷数据，终端回的报文就只有总的数据。
    （5）配了任务主站没有主动采集，核查发现凌晨的时候主站是有下发采集报文的，但是主动回FFF无效数据，5点7点等其他补采时间主站也有下发采集报文，但是终端回的否认，直到下午才回的数据。
    （6）档案正常，召测当前数据回FFF无效空值，终端抄不通电表，建议现场检查载波通讯、电表通讯模块等。`
  },
  {
    field1: '6',
    field2: '采集',
    field3: '【主网采集】',
    field4: '',
    field5: `问题：抄不到日冻结
    （1）召测数据可以回数并入库，前台数据显示正常。
    （2）换终端了没有回瞬时量，南网13厂站终端未配置任务，所以没有自动采集瞬时量。
    （3）终端回的数据状态为无效状态，或终端无响应报文。`
  },
  {
    field1: '7',
    field2: '指标',
    field3: '【指标核查】',
    field4: '',
    field5: `问题：抄表成功，却展示在抄表失败
    （1）运行电能表标识和采集关系的标识不一致，需要去批量推运行电能表档案过来，去营销把之前采集关系删掉，再重做采集关系。
    （2）有数还在抄表失败，地方电厂户，电表为单相表，所以缺正向无功总，抄表失败。
    （3）数据档案正常，系统重算后已经不在失败清单或未覆盖。
    （4）可以抄表还在未覆盖，缺少计量点电能表关系，需去营销维护计量点电能表关系。
    （5）刚归档的，出现在前几天抄表失败，系统每天会自动重算前两天的指标，如果没有数就会在抄表失败。
    （6）营销已完成建档，计量还在未覆盖，由于终端规约错误，无法同步到计量。`
  },
  {
    field1: '8',
    field2: '接口',
    field3: '【营销档案质量】',
    field4: '',
    field5: `原因：
    （1）电表（电表地址、通信规约、波特率、运行状态超出同步范围、标识冲突）错误；
    （2）终端（规约版本号、用户编号为空、计量点编号为空、运行状态超出同步范围、标识冲突）；
    （3）采集关系（采集对象运行标识、采集对象用户编号为空）；
    （4）采集关系采集对象运行标识与运行电能表的运行电能表标识不一致；
    （5）因线路台区有多条线路导致用户在营销系统与计量系统所关联的线路不一致
    措施：
    （1）电表或者终端参数错误，建议客户新增先检查档案参数是否正确，在走单；
    （2）对于终端（用户编号为空、计量点编号为空），采集关系（采集对象运行标识、采集对象用户编号为空），建议营销后台整改；
    （3）核查采集关系的采集对象运行标识为旧采集关系，建议营销后台导出清单让客户删除重新维护采集关系；
    （4）须用户提供申请函待审批后，删除错误的线路台区关系。`
  },
  {
    field1: '9',
    field2: '接口',
    field3: '【营销档案质量】',
    field4: '',
    field5: `原因：
    （1）电表（电表地址、通信规约、波特率、运行状态超出同步范围、标识冲突）错误；
    （2）终端（规约版本号、用户编号为空、计量点编号为空、运行状态超出同步范围、标识冲突）；
    （3）采集关系（采集对象运行标识、采集对象用户编号为空）；
    （4）采集关系采集对象运行标识与运行电能表的运行电能表标识不一致；
    （5）因线路台区有多条线路导致用户在营销系统与计量系统所关联的线路不一致
    措施：
    （1）电表或者终端参数错误，建议客户新增先检查档案参数是否正确，在走单；
    （2）对于终端（用户编号为空、计量点编号为空），采集关系（采集对象运行标识、采集对象用户编号为空），建议营销后台整改；
    （3）核查采集关系的采集对象运行标识为旧采集关系，建议营销后台导出清单让客户删除重新维护采集关系；
    （4）须用户提供申请函待审批后，删除错误的线路台区关系。`
  },
  {
    field1: '10',
    field2: '高级功能',
    field3: '【线损管理】',
    field4: '',
    field5: `原因：
    （1）因档案关系缺失、错误或状态停运或存在手动模型致模型无法生成。
    （2）因新装更换终端或电表、装表方向错误、日电量或月电量没有算出来,导致线损电量为零、电量错误。
    措施：
    （1）维护营销档案、删除手动模型。
    （2）新装更换终端或电表，导致月电量没有需找计量中心李捷重算月电量；若是日、月电量没有需找南瑞重算电量；重算线损。`
  },
  {
    field1: '11',
    field2: '高级功能',
    field3: '【抄表结算】',
    field4: '',
    field5: `原因：
    （1）电子化结算系统数据
    （2）计量有数营销没有数
    措施：
    （1）手动把日冻结数据入库
    （2）供电单位不一致导致返回的数据为空，维护营销档案，重召数据后再重抄;抄表方式错误，需用户重抄。`
  },
]

function SoftReport(props) {
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query:
      {
        reporttype,
        mainId,
        listreportType,
        listId,
        reportSearch
      } },
    dispatch,
    lastweekHomeworklist,
    nextweekHomeworklist,
    maintenanceService,
    soluteArr,
    maintenanceArr, // 事件统计
    contentRowlist,
    patrolAndExamineArr,
    loading,
    olduploadstatus
  } = props;

  const required = true;
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [addTitle, setAddTitle] = useState([]);
  const [contentRow, setContentRow] = useState([]); // 本周运维情况综述列表 
  const [patrolAndExamineList, setPatrolAndExamine] = useState([]) // 软件运维巡检
  const [materialsList, setMaterialsList] = useState([]) // 运维材料提交情况
  const [eventList, setEventList] = useState([]) // 软件运维巡检
  const [upgradeList, setUpgradeList] = useState([]) // 补丁升级列表
  const [updateList, setUpdateList] = useState([]) // 更新列表
  const [legacyList, setLegacyList] = useState([]) // 更新列表
  const [operationList, setOperationList] = useState([]) // 上周作业计划
  const [selfhandleRow, setSelfhandleRow] = useState([]) // 运维分类统计
  const [statisList, setStatisList] = useState([]) // 运维分类统计
  const [topNList, setTopNList] = useState([]) // TOPN列表
  const [typeList, setTypeList] = useState([]) // TOPN列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [list, setList] = useState([]);
  const [copyData, setCopyData] = useState('');

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  //  时间
  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  let lastSolute = [];
  if (soluteArr && soluteArr.length > 1) {
    lastSolute = [soluteArr[soluteArr.length - 1]];
  }


  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const savedata = {
          ...values,
          content: values.content || '',
          contentFiles: values.contentFiles || '',
          security: values.security || '',
          materialsFiles: values.materialsFiles || '',
          typeContent: values.typeContent || '',
          selfhandleContent: values.selfhandleContent || '',
          topNFiles: values.topNFiles || '',
          eventFiles: values.eventFiles || '',
          completeContent: values.completeContent || '',
          updateFiles: values.updateFiles || '',
          legacyFiles: values.legacyFiles || '',
          operationFiles: values.operationFiles || '',
          nextOperationFiles: values.nextOperationFiles || '',
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '软件运维周报' : '软件运维月报',
          reporttype,
          mainId,
          time1: reporttype === 'week' ? moment(startTime).format('YYYY-MM-DD') : moment(startTime).startOf('month').format('YYYY-MM-DD'),
          time2: reporttype === 'week' ? moment(endTime).format('YYYY-MM-DD') : moment(endTime).endOf('month').format('YYYY-MM-DD'),
          contentRow: JSON.stringify(contentRow || ''),
          patrolAndExamineList: JSON.stringify(patrolAndExamineList || ''),
          materialsList: JSON.stringify(materialsList || ''),
          eventList: JSON.stringify(eventList || ''),
          upgradeList: JSON.stringify(upgradeList || ''),
          updateList: JSON.stringify(updateList || ''),
          legacyList: JSON.stringify(legacyList || ''),
          operationList: JSON.stringify(operationList || ''),
          nextOperationList: JSON.stringify(nextOperationList || ''),
          statisList: JSON.stringify(statisList || ''),
          topNList: JSON.stringify(topNList || ''),
          typeList: JSON.stringify(typeList || ''),
          selfhandleRow: JSON.stringify(selfhandleRow || ''),
        }
        dispatch({
          type: 'softreport/saveSoft',
          payload: savedata
        })
      }

    })
  }

  //   七、上周作业完成情况--表格
  const lastweekHomework = () => {
    dispatch({
      type: 'softreport/lastweekHomework',
      payload: {
        plannedEndTime1: reporttype === 'week' ? `${startTime} 00:00:00` : moment(startTime).startOf('month').format('YYYY-MM-DD 00:00:00'),
        plannedEndTime2: reporttype === 'week' ? `${endTime} 23:59:59` : moment(endTime).endOf('month').format('YYYY-MM-DD 00:00:00'),
        type: '软件作业',
        pageIndex: 0,
        pageSize: 1000,
      }
    })
  }

  //   七、下周作业完成情况--表格
  const nextweekHomework = () => {
    dispatch({
      type: 'softreport/nextweekHomework',
      payload: {
        plannedEndTime1: reporttype === 'week' ? moment(startTime).add(7, 'days').format('YYYY-MM-DD 00:00:00') :
          moment(startTime).startOf('month').add('month', 1).format('YYYY-MM-DD 00:00:00'),

        plannedEndTime2: reporttype === 'week' ? moment(endTime).add(7, 'days').format('YYYY-MM-DD 23:59:59')
          : moment(startTime).endOf('month').add('month', 1).endOf('month').format('YYYY-MM-DD 23:59:59'),
        type: '软件作业',
        pageIndex: 0,
        pageSize: 1000,
      }
    })
  }

  const getcontentRowlist = () => {
    dispatch({
      type: 'softreport/getContentRow',
      payload: { time1: startTime, time2: endTime }
    })
  }

  const defaultTime = () => {
    //  周统计
    if (reporttype === 'week') {
      const currentstartTime = moment().subtract('days', 6).format('YYYY-MM-DD');
      const currentendTime = moment().format('YYYY-MM-DD');
      setStartTime(currentstartTime);
      setEndTime(currentendTime);
    } else {
      const currentstartTime = moment().startOf('month').format('YYYY-MM-DD');
      const currentendTime = moment().endOf('month').format('YYYY-MM-DD');
      setStartTime(currentstartTime);
      setEndTime(currentendTime);
    }
  }

  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);

  const handleBack = () => {
    router.push({
      pathname: `/ITSM/operationreport/weeklyreport/myweeklyreport`,
      query: { mainId, closetab: true },
      state: { cache: false }
    });

    if (reporttype === 'week') {
      if (!reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/weeklyreport/myweeklyreport',
          query: { pathpush: true },
          state: { cache: false }
        }
        );
      }

      if (reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/weeklyreport/myweeklyreportsearch',
          query: { pathpush: true },
          state: { cache: false }
        }
        );
      }

    }

    if (reporttype === 'month') {
      if (!reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlyreport',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
      if (reportSearch) {
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlysearch',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
    }
  }

  // 动态保存信息
  const handleaddTable = (params, px, rowdelete) => {
    if (deleteSign && rowdelete) {
      const newData = [];
      newData.push({
        ...params
      });

      setList(newData);
      setNewButton(false)
    } else {
      let filtIndex;
      const newData = (list).map(item => ({ ...item }));

      for (let i = 0; i < newData.length; i += 1) {
        if (newData[i].px === px) {
          filtIndex = i;
          break;
        }
      }

      if (newData && newData.length) {
        if (filtIndex !== undefined) {
          newData.splice(filtIndex, 1, params);
        }
      }

      if (newData && (newData.length === 0 || filtIndex === undefined)) {
        newData.push({
          ...params
        });
      }

      setList(newData);
      setNewButton(false)
    }
  };

  const removeForm = (tableIndex) => {
    list.splice(tableIndex, 1);
    const resultArr = list.map((item, index) => {
      const newItem = item;
      newItem.px = (index + 9).toString();
      return newItem;
    })
    setList(resultArr);
  }

  const onChange = (date, dateString) => {
    if (reporttype === 'week') {
      const currentendTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setTimeshow(false);
      setStartTime(dateString);
      setEndTime(currentendTime);
      setFieldsValue({ time2: moment(endTime) });
    } else {
      const monthstartTime = date.startOf('month').format('YYYY-MM-DD');
      const monthendTime = date.endOf('month').format('YYYY-MM-DD');
      setStartTime(monthstartTime);
      setEndTime(monthendTime);
    }
  }

  const endonChange = (date, dateString) => {
    const currendstartTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setTimeshow(false);
    setStartTime(currendstartTime);
    setEndTime(dateString);
    setFieldsValue({ time1: moment(startTime) })
  }

  useEffect(() => {
    if (startTime) {
      setTimeshow(true);
    }
  }, [timeshow])

  const newMember = () => {
    const nowNumber = list.map(item => ({ ...item }));
    const newarr = nowNumber.map((item, index) => {
      return Object.assign(item, { px: (index + 9).toString() })
    });
    const addObj = {
      files: '',
      content: '',
      title: '',
      list: '',
      px: (nowNumber.length + 9).toString()
    }
    newarr.push(addObj);
    setList(newarr);
    setNewButton(true);
    setDeleteSign(false);
  }

  const handlemaintenanserviceceArr = () => {
    const tabActiveKey = reporttype;
    dispatch({
      type: 'softreport/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  const handlesoftservice = () => {
    const tabActiveKey = reporttype;
    dispatch({
      type: 'softreport/fetcheventServiceList',
      payload: { tabActiveKey, startTime, endTime }
    })

    dispatch({
      type: 'softreport/fetchSelfHandleList',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  const handlePaste = () => {
    if (!listreportType || !listId) {
      message.info('请在列表选择一条数据复制哦')
      return false;
    }

    if (reporttype === 'week') {
      if (listreportType !== '软件运维周报') {
        message.info('只能粘贴同种周报类型哦');
        return false;
      }
    }

    if (reporttype === 'month') {
      if (listreportType !== '软件运维月报') {
        message.info('只能粘贴同种月报类型哦');
        return false;
      }
    }

    return dispatch({
      type: 'softreport/pasteReport',
      payload: {
        editStatus: 'edit',
        id: listId
      }
    }).then(res => {
      if (res.code === 200) {
        setCopyData(res);
        setList(res.addData);
        setContentRow(res.contentRow);
        setPatrolAndExamine(res.patrolAndExamineList);
        setMaterialsList(res.materialsList);
        setTypeList(res.typeList);
        setStatisList(res.statisList);
        setSelfhandleRow(res.selfhandleRow);
        setTopNList(res.topNList);
        setEventList(res.eventList);
        setUpgradeList(res.upgradeList);
        setUpdateList(res.updateList);
        setLegacyList(res.legacyList);
        setOperationList(res.operationList);
        setNextOperationList(res.nextOperationList);
        setAddTitle(res.addData);
        message.success('粘贴成功')
        initial = true;
      } else {
        message.info('您无法复制该条记录，请返回列表重新选择')
      }
    })
  }

  const handlepatrolAndExamineList = () => {
    dispatch({
      type: 'softreport/getPatrolAndExamineList',
      payload: {
        time1: startTime,
        time2: endTime
      }
    })
  }

  useEffect(() => {
    defaultTime();
    initial = false;
  }, []);

  const getReportdata = () => {
    lastweekHomework();
    nextweekHomework();
    handlemaintenanserviceceArr();
    getcontentRowlist();
    handlesoftservice();
    handlepatrolAndExamineList();
    initial = true;
  }

  useEffect(() => {
    setContentRow(copyData.contentRow !== undefined ? copyData.contentRow : contentRowlist);
    setPatrolAndExamine(copyData.patrolAndExamineList !== undefined ? copyData.patrolAndExamineList : patrolAndExamineArr);
    setMaterialsList(copyData.materialsList !== undefined ? copyData.materialsList : []);
    setTypeList(copyData.typeList !== undefined ? copyData.typeList : maintenanceArr);
    setStatisList(copyData.statisList !== undefined ? copyData.statisList : maintenanceService);
    setSelfhandleRow(copyData.selfhandleRow !== undefined ? copyData.selfhandleRow : lastSolute);
    setTopNList(copyData.topNList !== undefined ? copyData.topNList : TopnAnalysis);
    setEventList(copyData.eventList !== undefined ? copyData.eventList : []);
    setUpgradeList(copyData.upgradeList !== undefined ? copyData.upgradeList : []);
    setUpdateList(copyData.updateList !== undefined ? copyData.updateList : []);
    setLegacyList(copyData.legacyList !== undefined ? copyData.legacyList : []);
    setOperationList(copyData.operationList !== undefined ? copyData.operationList : lastweekHomeworklist);
    setNextOperationList(copyData.nextOperationList !== undefined ? copyData.nextOperationList : nextweekHomeworklist);
  }, [loading]);

  const dateFormat = 'YYYY-MM-DD';

  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '新建软件运维周报' : '新建软件运维月报'}
      extra={
        <>
          <div>
            <Button
              type='primary'
              style={{ marginRight: 10 }}
              onClick={handlePaste}
              disabled={olduploadstatus}
            >粘贴
            </Button>

            <Button
              type='primary'
              style={{ marginRight: 10 }}
              onClick={softReportform}
              disabled={olduploadstatus}
            >保存
            </Button>

            <Button onClick={handleBack}>
              返回
            </Button>
          </div>

        </>
      }
    >

      {
        loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={loading}>
              {/* {message.info('数据正在加载中，请稍等')} */}
            </Spin>
          </div>

        )
      }

      <Card style={{ padding: 24 }}>
        <Row gutter={24}>
          <Form>
            <Col span={24}>
              <Form.Item
                label={reporttype === 'week' ? '周报名称' : '月报名称'}
                style={{ display: 'flex' }}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required,
                      message: '请输入名称'
                    }
                  ],
                  initialValue: copyData.main ? copyData.main.name : ''
                })
                  (
                    <Input style={{ width: 700 }} placeholder={`省级集中计量自动化系统软件运维${reporttype === 'week'? '周':'月'}报`} />
                  )}
              </Form.Item>
            </Col>

            {
              reporttype === 'week' && startTime && timeshow && (
                <Col span={24}>
                  <div>
                    <span style={{ marginLeft: 10 }}>填报时间 :</span>

                    <span
                      style={{ marginRight: 10, marginLeft: 10 }}
                    >
                      <DatePicker
                        allowClear={false}
                        format={dateFormat}
                        defaultValue={moment(startTime)}
                        onChange={onChange}
                      />
                    </span>

                    <span
                      style={{ marginRight: 10 }}
                    >-</span>

                    <span>
                      <DatePicker
                        allowClear={false}
                        format={dateFormat}
                        defaultValue={moment(endTime)}
                        onChange={endonChange}

                      />
                    </span>

                    <Button
                      type='primary'
                      style={{ marginLeft: 10, marginTop: 5 }}
                      onClick={getReportdata}
                      disabled={olduploadstatus}
                    >
                      获取数据
                    </Button>
                  </div>
                </Col>
              )
            }

            {
              reporttype === 'month' && (
                <Col span={24}>
                  <Form.Item label='填报日期' style={{ display: 'inline-flex' }}>
                    {getFieldDecorator('time1', {
                      rules: [
                        {
                          required,
                          message: '请选择填报日期'
                        }
                      ],
                      initialValue: moment(copyData.main ? copyData.main.time1 : startTime)
                    })(<MonthPicker
                      allowClear={false}
                      onChange={onChange}
                    />)}
                  </Form.Item>

                  <Button
                    type='primary'
                    style={{ marginLeft: 10, marginTop: 5 }}
                    onClick={getReportdata}
                  >
                    获取数据
                  </Button>
                </Col>
              )
            }

            {
              initial && loading === false && contentRowlist && startTime && (
                <>
                  {/* 一、本周运维情况综述 */}
                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px', marginTop: 24 }}>{reporttype === 'week' ? '一、本周运维情况综述' : '一、本月运维情况综述'}</p>
                  </Col>

                  {
                    copyData.contentRow !== undefined && (
                      <Col span={24}>
                        <ThisweekMaintenance
                          type={reporttype}
                          contentRow={contentrowdata => {
                            setContentRow(contentrowdata)
                          }}
                          contentArr={copyData.contentRow}
                        />
                      </Col>
                    )
                  }

                  {
                    copyData.contentRow === undefined && (
                      <Col span={24}>
                        <ThisweekMaintenance
                          type={reporttype}
                          contentRow={contentrowdata => {
                            setContentRow(contentrowdata)
                          }}
                          contentArr={contentRowlist}
                        />
                      </Col>
                    )
                  }

                  <Col span={24} style={{ marginTop: 15 }}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('content', {
                          initialValue: copyData && copyData.content
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('contentFiles', {
                        initialValue: copyData && copyData.contentFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.contentFiles ? JSON.parse(copyData.contentFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ contentFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  {/* 二、常规运维工作开展情况 */}
                  <Col span={24}>
                    <PatrolAndExamine
                      forminladeLayout={forminladeLayout}
                      patrolAndExamineList={contentrowdata => {
                        setPatrolAndExamine(contentrowdata)
                      }}
                      patrolAndExamine={copyData.patrolAndExamineList ? copyData.patrolAndExamineList : patrolAndExamineArr}
                    />
                  </Col>

                  {/* 业务保障 */}
                  <Col style={{ marginTop: 24 }} span={24}>
                    <p>（二）重要时期业务保障</p>
                  </Col>

                  <Col span={24} style={{ marginTop: 15 }}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('security', {
                          initialValue: copyData && copyData.security
                        })(<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Development
                      forminladeLayout={forminladeLayout}
                      materialsList={contentrowdata => {
                        setMaterialsList(contentrowdata)
                      }}
                      materials={copyData.materialsList ? copyData.materialsList : []}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('materialsFiles', {
                        initialValue: copyData && copyData.materialsFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.materialsFiles ? JSON.parse(copyData.materialsFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ materialsFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <ServiceTableone
                      forminladeLayout={forminladeLayout}
                      maintenanceArr={copyData.typeList ? copyData.typeList : maintenanceArr}
                      tabActiveKey={reporttype}
                      typeList={contentrowdata => {
                        setTypeList(contentrowdata)
                      }}
                      typeArr={[]}
                      mainId={mainId}
                    />
                  </Col>

                  {/* 运维统计 */}
                  <Col span={24} style={{ marginTop: 15 }}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('typeContent', {
                          initialValue: copyData && copyData.typeContent
                        })(<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  {/* 软件运维付服务指标完成情况 */}
                  {/* 一线问题解决情况汇总统计 */}
                  <Col span={24}>
                    <ServiceCompletionone
                      forminladeLayout={forminladeLayout}
                      maintenanceService={copyData.statisList ? copyData.statisList : maintenanceService}
                      tabActiveKey={reporttype}
                      statisList={contentrowdata => {
                        setStatisList(contentrowdata)
                      }}
                    />
                  </Col>

                  <Col span={24}>
                    <ServiceCompletion
                      forminladeLayout={forminladeLayout}
                      soluteArr={copyData.selfhandleRow ? copyData.selfhandleRow : lastSolute}
                      startTime={startTime}
                      endTime={endTime}
                      tabActiveKey={reporttype}
                      selfhandleRow={contentrowdata => {
                        setSelfhandleRow(contentrowdata)
                      }}
                    />
                  </Col>

                  {/* 服务指标 */}
                  <Col span={24} style={{ marginTop: 24 }}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('selfhandleContent', {
                          initialValue: copyData && copyData.selfhandleContent
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <EventTop
                      topNList={contentrowdata => {
                        setTopNList(contentrowdata)
                      }}
                      topArr={copyData.topNList ? copyData.topNList : TopnAnalysis}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('topNFiles', {
                        initialValue: copyData && copyData.topNFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.topNFiles ? JSON.parse(copyData.topNFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ topNFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  {/* 四、本周事件、问题及故障 */}
                  <Col span={24}>
                    <ThisWeekitsm
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      formincontentLayout={formincontentLayout}
                      reportType={reporttype}
                      eventList={contentrowdata => {
                        setEventList(contentrowdata)
                      }}
                      mainId={copyData.eventList ? true : ''}
                      eventArr={copyData.eventList ? copyData.eventList : []}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('eventFiles', {
                        initialValue: copyData && copyData.eventFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.eventFiles ? JSON.parse(copyData.eventFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ eventFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  {/* 五、软件作业完成情况 */}
                  {/* 补丁升级 */}
                  <Col span={20}>
                    <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>五、软件作业完成情况</p>
                  </Col>

                  {/* 软件情况 */}
                  <Col span={24} style={{ marginTop: 15 }}>
                    <Form.Item
                      label=''
                      {...formincontentLayout}
                    >
                      {
                        getFieldDecorator('completeContent', {
                          initialValue: copyData && copyData.completeContent
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  {
                    reporttype === 'week' && (
                      <Col span={24}>
                        <p>(1)数据库本周进行了补丁升级工作次</p>
                      </Col>
                    )
                  }

                  {
                    reporttype === 'month' && (
                      <Col span={24}>
                        <p>(1)数据库本月进行了补丁升级工作次</p>
                      </Col>
                    )
                  }

                  <Col span={24}>
                    <UpgradeList
                      forminladeLayout={forminladeLayout}
                      upgradeList={contentrowdata => {
                        setUpgradeList(contentrowdata)
                      }}
                      upgradeArr={copyData.upgradeList ? copyData.upgradeList : []}
                    />
                  </Col>

                  <Col span={24}>
                    <p>(2)计划{startTime}至{endTime},计量自动化系统开展 次发布变更（消缺），变更内容如下</p>
                  </Col>

                  {/* 变更 */}
                  <Col span={24}>
                    <UpgradeList
                      forminladeLayout={forminladeLayout}
                      upgradeList={contentrowdata => {
                        setUpdateList(contentrowdata)
                      }}
                      upgradeArr={copyData.updateList ? copyData.updateList : []}
                      reporttype={reporttype}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('updateFiles', {
                        initialValue: copyData && copyData.updateFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.updateFiles ? JSON.parse(copyData.updateFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ updateFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>

                  {/* 六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件） */}
                  <Col span={24}>
                    <DefectTracking
                      forminladeLayout={forminladeLayout}
                      startTime={startTime}
                      endTime={endTime}
                      legacyList={contentrowdata => {
                        setLegacyList(contentrowdata)
                      }}
                      legacyArr={copyData.legacyList ? copyData.legacyList : []}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('legacyFiles', {
                        initialValue: copyData && copyData.legacyFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.legacyFiles ? JSON.parse(copyData.legacyFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ legacyFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  {/* 七、上周作业完成情况 */}
                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '七、上周作业完成情况' : '七、上月作业完成情况'}</p>
                  </Col>

                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setOperationList(contentrowdata)
                      }}
                      operationArr={copyData.operationList ? copyData.operationList : lastweekHomeworklist}
                      loading={loading}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('operationFiles', {
                        initialValue: copyData && copyData.operationFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.operationFiles ? JSON.parse(copyData.operationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ operationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '八、下周作业计划' : '八、下月作业计划'}</p>
                  </Col>

                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setNextOperationList(contentrowdata)
                      }}
                      operationArr={copyData.nextOperationList ? copyData.nextOperationList : nextweekHomeworklist}
                      loading={loading}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('nextOperationFiles', {
                        initialValue: copyData && copyData.nextOperationFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.nextOperationFiles ? JSON.parse(copyData.nextOperationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ nextOperationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>
                </>
              )
            }

            {loading === false && list && list.length > 0 && (
              list.map((item, index) => {
                return (
                  <>
                    <Col span={23}>
                      <AddForm
                        formincontentLayout={formincontentLayout}
                        px={(index + 9).toString()}
                        addTable={(newdata, addpx, rowdelete) => {
                          handleaddTable(newdata, addpx, rowdelete)
                        }}
                        index={index}
                        dynamicData={list.length ? list[index] : {}}
                        loading={loading}
                        ChangeAddRow={v => setAddrow(v)}
                        sign={deleteSign}
                        uploadStatus={olduploadstatus}
                      />
                    </Col>

                    {
                      list[index] && (
                        <Col span={1}>
                          <Icon
                            className="dynamic-delete-button"
                            type="delete"
                            onClick={() => { removeForm(index); setDeleteSign(true) }}
                          />
                        </Col>
                      )
                    }
                  </>
                )
              })
            )
            }

            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="primary"
              ghost
              onClick={() => newMember()}
              icon="plus"
              disabled={olduploadstatus}
            >
              新增其他内容
            </Button>
          </Form>
        </Row>
        {/* // )} */}
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ softreport,viewcache, loading }) => ({
    maintenanceArr: softreport.maintenanceArr,
    maintenanceService: softreport.maintenanceService,
    soluteArr: softreport.soluteArr,
    thisWeekitsmlist: softreport.thisWeekitsmlist,
    lastweekHomeworklist: softreport.lastweekHomeworklist,
    nextweekHomeworklist: softreport.nextweekHomeworklist,
    contentRowlist: softreport.contentRowlist,
    patrolAndExamineArr: softreport.patrolAndExamineArr,
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(SoftReport),
);
