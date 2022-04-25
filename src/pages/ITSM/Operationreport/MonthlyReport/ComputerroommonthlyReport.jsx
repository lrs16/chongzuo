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
import MaintenanceList from './components/MaintenanceList.';
import MaintenanceScope from './components/MaintenanceScope';
import FaultSummary from './components/FaultSummary';
import AddForm from '../WeeklyReport/components/AddForm';

import styles from '../WeeklyReport/index.less';
import { conformsTo } from 'lodash';

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
// let getInfoparams = false;

function ComputerroommonthlyReport(props) {
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      mainId,
      listreportType,
      listId,
      reportSearch
    } },
    dispatch,
    faultQueryList,
    nofaultQueryList,
    lastweekHomeworklist,
    computerroom,
    loading,
    olduploadstatus
  } = props;
  const tabActiveKey = 'week';

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileslist, setFilesList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]) // 材料列表
  const [eventList, setEventList] = useState([]) // 运维事件列表
  const [troubleList, settroubleList] = useState([]) // 本月运维事件故障列表
  const [newTroubleList, setNewTroubleList] = useState([]) // 新故障列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [operationList, setOperationList] = useState([]) // 更新列表
  const [list, setList] = useState([]);
  const [copyData, setCopyData] = useState('');

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const summarydefaults = '按照合同要求，博联机房运维组对省级集中计量自动化系统机房进行监控值班和巡检运维工作。所运维的设备分布于49个机柜，共计300台（套），其中60台服务器，网络设备96台，安全设备70台，其它设备37台，软件系统37套；运维期内机房新增的设备也在运维范围。'
  const personnelOrganization = `项目经理：梁勇成
技术工程师：利东 刘熙仑 
值班工程师：高永迪 罗智辉 周延昌 欧文贵 林立昆 莫明建 杨名伟`
  const placeWork = '计量中心白沙机房监控室、主机房、蓄电池室、配电室等';
  const jobContent = `1、数据库监控
2、服务器监控、巡检
3、计量自动化系统运行监控
4、机房动力环境系统监控、巡检
5、蓄电池室监控、巡检
6、供配电系统监控、巡检
7、机房环境监控、巡检
8、消防系统巡检
9、网络通道监控、巡检
10、信息安全监控 `
  const maintenanceRecords = '详见每日的《广西计量机房硬件及基础环境日巡检报告》';
  const dutySituation = `本月实行7*24小时值班，共值班${moment(endTime).endOf('month').format('DD')*3}个班次，提交运维简报${moment(endTime).endOf('month').format('DD')*3}次，按时提交率100%；巡检日报，机房出入登记表和值班日志等均按规定做了记录，无违规现象。`
  const TroubleShooting = `本月巡检到设备硬件故障0起，监控到设备软件故障0起0；未发生网络故障和电源故障；修复历史硬件故障1起。
目前机房设备无缺陷或告警，运行状态良好。`
  const monitoringSituation = `本月监控到系统指标异常4起，比上月增加1起；监控到系统登录异常0起；监控到系统功能模块异常0起。
异常情况均得到及时处理或当日恢复正常，系统运行未受影响。`
  const securityMeasures = `IPS、防病毒软件、态势感知系统等网络安全系统监控总体情况正常，未发生攻击成功事件；按计划对安防设备进行了固件版本和特征库、病毒库升级；
按上级通报和指令对系统进行安全加固、补丁升级。`
  const operationControl = `每周均制定作业计划表，并按计划进行作业。
本月开具工作票12份，作业票共13份；每周均对工作票及作业票规范性进行检查，本月规范性情况良好。
本月进行服务器账号授权和查询操作审计共12次，例行审计发现有1起疑似违规操作，已报给相关负责人核实处理。`
  const proposal = '无'
  //  保存表单
  const computerReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          contentFiles: value.contentFiles || '',
          personnelFiles: value.personnelFiles || '',
          workAddressFiles: value.workAddressFiles || '',
          workFiles: value.workFiles || '',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: '机房运维月报',
          reporttype,
          mainId,
          time1: moment(startTime).startOf('month').format('YYYY-MM-DD'),
          time2: moment(endTime).endOf('month').format('YYYY-MM-DD'),
          rangeList: JSON.stringify(newTroubleList || []),
          rangeFiles: value.rangeFiles || '',
          eventFiles: value.eventFiles || '',
          nextOperationList: JSON.stringify(nextOperationList || []),
          operationFiles: value.operationFiles || '',
          troubleList: JSON.stringify(troubleList || []),
          eventList: JSON.stringify(eventList || []),
        }
        dispatch({
          type: 'softreport/saveComputerRoomByMonth',
          payload: savedata
        })
      }

    })
  }

  //  粘贴
  const handlePaste = () => {
    if (!listreportType || !listId) {
      message.info('请在列表选择一条数据复制哦')
      return false;
    }

    if (listreportType !== '机房运维周报') {
      message.info('只能粘贴同种周报类型哦');
      return false;
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
        setMaterialsList(res.materialsList);
        settroubleList(res.troubleList);
        setNewTroubleList(res.newTroubleList);
        setOperationList(res.operationList);
        setNextOperationList(res.nextOperationList);
        message.success('粘贴成功')
        initial = true;
      } else {
        message.info('您无法复制该条记录，请返回列表重新选择')
      }
    })
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

  //  移除表格
  const removeForm = (tableIndex) => {
    list.splice(tableIndex, 1);
    const resultArr = list.map((item, index) => {
      const newItem = item;
      newItem.px = (index + 6).toString();
      return newItem;
    })
    setList(resultArr);
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
  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      computerReportform();
    }
  }, [files]);

  useEffect(() => {
    if (startTime) {
      setTimeshow(true);
    }
  }, [timeshow])

  useEffect(() => {
    setMaterialsList(copyData.materialsList || materialsList);
    setNewTroubleList(copyData.newTroubleList || faultQueryList);
    setEventList(copyData.eventList || eventList);
    setOperationList(copyData.operationList || lastweekHomeworklist);
    settroubleList(copyData.troubleList || troubleList);
  }, [loading]);

  const getQuerylist = () => {
    dispatch({
      type: 'softreport/getfaultQueryList',
      payload: {
        time1: startTime,
        time2: endTime,
        type: '001',
        result: '根本解决'
      }
    });
    dispatch({
      type: 'softreport/getnofaultQueryList',
      payload: {
        time1: startTime,
        time2: endTime,
        type: '001',
        result: '无法解决'
      }
    })
  }

  //   七、上周作业完成情况--表格
  const getTroubleByComputerRoom = () => {
    dispatch({
      type: 'monthly/getTroubleByComputerRoom',
      payload: {
        startTime: moment(startTime).startOf('month').format('YYYY-MM-DD 00:00:00'),
        endTime: moment(endTime).endOf('month').format('YYYY-MM-DD 23:59:59'),
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
          : moment(endTime).endOf('month').add('month', 1).endOf('month').format('YYYY-MM-DD 23:59:59'),
        type: '机房作业',
        pageIndex: 0,
        pageSize: 1000,
        database: 'true'
      }
    })
  }

  useEffect(() => {
    defaultTime();
    initial = false;
    // getInfoparams = false;
  }, []);

  const getReportdata = () => {
    getTroubleByComputerRoom();
    // nextweekHomework();
    // getQuerylist();
    initial = true;
  }

  //  暂时保留
  // useEffect(() => {
  //   if (getInfoparams) {
  //     const obj = copyData || {};
  //     obj.operationList = lastweekHomeworklist;
  //     obj.nextOperationList = nextweekHomeworklist;
  //     obj.newTroubleList = faultQueryList;
  //     obj.unCloseTroubleList = nofaultQueryList;
  //     setCopyData(obj)
  //   }
  // }, [loading])

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

  const newMember = () => {
    const nowNumber = list.map(item => ({ ...item }));
    const newarr = nowNumber.map((item, index) => {
      return Object.assign(item, { px: (index + 6).toString() })
    });
    const addObj = {
      files: '',
      content: '',
      title: '',
      list: '',
      px: (nowNumber.length + 6).toString()
    }
    newarr.push(addObj);
    setList(newarr);
    setNewButton(true);
    setDeleteSign(false);
  }

  const dateFormat = 'YYYY-MM-DD';

  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '新建机房运维周报' : '新建机房运维月报'}
      extra={
        <>
          {/* {
          loading === false && (
            <>
            <Button
            type='primary'
            onClick={handlePaste}
            disabled={olduploadstatus}
          >粘贴</Button>
          <Button
            type='primary'
            onClick={computerReportform}
            disabled={olduploadstatus}
          >
            保存
          </Button>
          <Button onClick={handleBack}>
            返回
          </Button>
            </>
          )
        } */}
          <Button
            type='primary'
            onClick={computerReportform}
            disabled={olduploadstatus}
          >
            保存
          </Button>
        </>
      }
    >

      {
        loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={loading} />
          </div>
        )
      }

      <Card style={{ padding: 24 }}>
        <Row gutter={24}>
          <Form>
            <Col span={24}>
              <Form.Item
                label='月报名称'
                style={{ display: 'inline-flex' }}
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
                    <Input style={{ width: 700 }} placeholder={`省级集中计量自动化系统机房运维${reporttype === 'week' ? '周' : '月'}报`} />
                  )}
              </Form.Item>
            </Col>

            {
              reporttype === 'month' && (
                <Col span={24}>
                  <Form.Item
                    label='填报日期'
                    style={{ display: 'inline-flex' }}
                  >
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
              initial && loading === false && startTime && (

                <>
                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px', marginTop: 24 }}>一、概述</p></Col>
                  {/* 本周运维总结 */}
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('content', {
                          initialValue: (copyData.main && copyData.main.content) || summarydefaults
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  {/* 本周运维附件 */}
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
                              fileslist={copyData.contentFiles ? JSON.parse(copyData.contentFiles) : []}
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

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>二、人员组织安排</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('personnelContent', {
                          initialValue: (copyData && copyData.personnelContent) || personnelOrganization
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('personnelFiles', {
                        initialValue: copyData && copyData.personnelFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.personnelFiles ? JSON.parse(copyData.personnelFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ personnelFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>三、工作地点</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('workAddressContent', {
                          initialValue: copyData && copyData.workAddressContent || placeWork
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('workAddressFiles', {
                        initialValue: copyData && copyData.workAddressFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.workAddressFiles ? JSON.parse(copyData.workAddressFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ workAddressFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>四、工作内容</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('workContent', {
                          initialValue: copyData && copyData.workContent || jobContent
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('workFiles', {
                        initialValue: copyData && copyData.workFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.workFiles ? JSON.parse(copyData.workFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ workFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>五、运行运维范围如下</p></Col>

                  <Col span={24}>
                    <MaintenanceScope
                      forminladeLayout={forminladeLayout}
                      maintenanceList={copyData.rangeList ? copyData.rangeList : []}
                      mainId={copyData.rangeList ? true : mainId}
                      type={reporttype}
                      startTime={startTime}
                      endTime={endTime}
                      newTroubleList={contentrowdata => {
                        setNewTroubleList(contentrowdata)
                      }}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('rangeFiles', {
                        initialValue: copyData && copyData.rangeFiles
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={copyData && copyData.rangeFiles ? JSON.parse(copyData.rangeFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ rangeFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>六、运维记录</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('operationContent', {
                          initialValue: copyData && copyData.operationContent || maintenanceRecords
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
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

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>七、本月运维事件（故障）记录</p></Col>

                  <Col span={24}>
                    <FaultSummary
                      forminladeLayout={forminladeLayout}
                      eventList={copyData.eventList ? copyData.eventList : computerroom.eventList}
                      type={reporttype}
                      mainId={copyData.eventList ? true : mainId}
                      startTime={startTime}
                      endTime={endTime}
                      getEventList={contentrowdata => {
                        setEventList(contentrowdata)
                      }}
                    />
                  </Col>

                  <Col span={24}>
                    <MaintenanceList
                      forminladeLayout={forminladeLayout}
                      troubleList={copyData.troubleList ? copyData.troubleList : computerroom.troubleList}
                      type={reporttype}
                      mainId={copyData.troubleList ? true : mainId}
                      startTime={startTime}
                      endTime={endTime}
                      gettroubleList={contentrowdata => {
                        settroubleList(contentrowdata)
                      }}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('eventFiles ', {
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

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>八、运维工作小结</p></Col>

                  <Col span={24}><p>（1）值班情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('dutyContent', {
                          initialValue: copyData && copyData.dutyContent || dutySituation
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（2）故障处理情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('troubleHandleContent', {
                          initialValue: copyData && copyData.troubleHandleContent || TroubleShooting
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（3）监控情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('monitorContent', {
                          initialValue: copyData && copyData.monitorContent || monitoringSituation
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（4）网络安全及安防措施</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('networkContent', {
                          initialValue: copyData && copyData.networkContent || securityMeasures
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（5）作业管控情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('controlContent', {
                          initialValue: copyData && copyData.controlContent || operationControl
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>九、发现的问题、建议或改进措施</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('problemContent', {
                          initialValue: copyData && copyData.problemContent || proposal
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
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
                        px={(index + 6).toString()}
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
              onClick={() => { newMember() }}
              icon="plus"
              disabled={olduploadstatus}
            >
              新增其他内容
            </Button>

          </Form>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ monthly, viewcache, loading }) => ({
    computerroom: monthly.computerroom,
    nextweekHomeworklist: monthly.nextweekHomeworklist,
    loading: loading.models.monthly,
    olduploadstatus: viewcache.olduploadstatus,
  }))(ComputerroommonthlyReport),
);
