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
  Descriptions,
  Spin
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import MaintenanceList from './components/MaintenanceList.';
import MaintenanceScope from './components/MaintenanceScope';
import FaultSummary from './components/FaultSummary';
import AddForm from '../WeeklyReport/components/AddForm';

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
// let getInfoparams = false;

function ComputerroommonthlyReportdetail(props) {
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      mainId,
      reportSearch
    } },
    location,
    dispatch,
    faultQueryList,
    openReportlist,
    lastweekHomeworklist,
    computerroom,
    loading,
    olduploadstatus
  } = props;

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
  const { main } = openReportlist;
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
  const dutySituation = `本月实行7*24小时值班，共值班${moment(endTime).endOf('month').format('DD') * 3}个班次，提交运维简报${moment(endTime).endOf('month').format('DD') * 3}次，按时提交率100%；巡检日报，机房出入登记表和值班日志等均按规定做了记录，无违规现象。`
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


  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    })
  }
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
          editStatus: 'edit',
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
        return dispatch({
          type: 'softreport/saveComputerRoomByMonth',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            getopenFlow()
          } else {
            message.error(res.msg);
            router.push({
              pathname: '/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail',
              query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
            });
          }
        })
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
    const currentstartTime = moment().startOf('month').format('YYYY-MM-DD');
    const currentendTime = moment().endOf('month').format('YYYY-MM-DD');
    setStartTime(currentstartTime);
    setEndTime(currentendTime);
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
    if (loading === false && openReportlist && openReportlist.main && openReportlist.main.addTime) {
      const { addData } = openReportlist;
      setList(addData);
      setEventList(openReportlist.eventList);
      settroubleList(openReportlist.troubleList);
      setNewTroubleList(openReportlist.rangeList);
    }
  }, [loading]);

  useEffect(() => {
    if (mainId) {
      getopenFlow()
    }
  }, [mainId])

  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      getopenFlow()
    }
  }, [location.state])

  //   七、上周作业完成情况--表格
  const getTroubleByComputerRoom = () => {
    dispatch({
      type: 'softreport/getTroubleByComputerRoom',
      payload: {
        startTime: moment(startTime).startOf('month').format('YYYY-MM-DD 00:00:00'),
        endTime: moment(endTime).endOf('month').format('YYYY-MM-DD 23:59:59'),
      }
    })
  }

  useEffect(() => {
    defaultTime();
    return () => {
      dispatch({
        type: 'softreport/setclearcomputerroom',
        payload: []
      })
    }
  }, []);

  const getReportdata = () => {
    getTroubleByComputerRoom();
  }

  const handleBack = () => {
    router.push({
      pathname: `/ITSM/operationreport/weeklyreport/myweeklyreport`,
      query: { mainId, closetab: true },
      state: { cache: false }
    });

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

  const newMember = () => {
    const nowNumber = list.map(item => ({ ...item }));
    const newarr = nowNumber.map((item, index) => {
      return Object.assign(item, { px: (index + 10).toString() })
    });
    const addObj = {
      files: '',
      content: '',
      title: '',
      list: '',
      px: (nowNumber.length + 10).toString()
    }
    newarr.push(addObj);
    setList(newarr);
    setNewButton(true);
    setDeleteSign(false);
  }

  const exportWord = () => {
    dispatch({
      type: 'softreport/exportWord',
      payload: { mainId }
    }).then(res => {
      const fieldName = '下载.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fieldName;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  return (
    <PageHeaderWrapper
      title='机房运维月报'
      extra={
        <>
          {
            loading === false && !reportSearch && main && main.time1 && troubleList !== undefined && (
              <>
                <Button
                  type='primary'
                  onClick={exportWord}
                  disabled={olduploadstatus}
                >导出</Button>

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
          }

          {
            loading === false && reportSearch && (
              <>
                <Button
                  type='primary'
                  onClick={exportWord}
                  disabled={olduploadstatus}
                >导出</Button>
                
                <Button onClick={handleBack}>
                  返回
                </Button>
              </>
            )
          }
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
                  initialValue: main && main.name || ''
                })
                  (
                    <Input disabled={reportSearch} style={{ width: 700 }} placeholder={`省级集中计量自动化系统机房运维${reporttype === 'week' ? '周' : '月'}报`} />
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
                      initialValue: moment(main && main.time1 || startTime)
                    })(<MonthPicker
                      allowClear={false}
                      disabled={reportSearch}
                      onChange={onChange}
                    />)}
                  </Form.Item>

                  <Button
                    type='primary'
                    style={{ marginLeft: 10, marginTop: 5 }}
                    onClick={getReportdata}
                    disabled={reportSearch}
                  >
                    获取数据
                  </Button>
                </Col>
              )
            }

            {
              loading === false && main && main.time1 && troubleList !== undefined && (
                <>
                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px', marginTop: 24 }}>一、概述</p></Col>
                  {/* 本周运维总结 */}
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('content', {
                          initialValue: main.content || summarydefaults
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  {/* 本周运维附件 */}
                  {
                    !reportSearch && (
                      <Col span={24}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('contentFiles', {
                            initialValue: openReportlist.contentFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.contentFiles ? JSON.parse(openReportlist.contentFiles) : []}
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
                    )
                  }

                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.contentFiles === '' ? '[]' : openReportlist.contentFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }


                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>二、人员组织安排</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('personnelContent', {
                          initialValue: openReportlist.personnelContent || personnelOrganization
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  {
                    !reportSearch && (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('personnelFiles', {
                            initialValue: openReportlist.personnelFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.personnelFiles ? JSON.parse(openReportlist.personnelFiles) : []}
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
                    )
                  }

                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.personnelFiles === '' ? '[]' : openReportlist.personnelFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }



                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>三、工作地点</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('workAddressContent', {
                          initialValue: openReportlist.workAddressContent || placeWork
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  {
                    !reportSearch && (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('workAddressFiles', {
                            initialValue: openReportlist.workAddressFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.workAddressFiles ? JSON.parse(openReportlist.workAddressFiles) : []}
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

                    )
                  }

                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.workAddressFiles === '' ? '[]' : openReportlist.workAddressFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }


                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>四、工作内容</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('workContent', {
                          initialValue: openReportlist.workContent || jobContent
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  {
                    !reportSearch && (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('workFiles', {
                            initialValue: openReportlist.workFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.workFiles ? JSON.parse(openReportlist.workFiles) : []}
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
                    )
                  }

                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.workFiles === '' ? '[]' : openReportlist.workFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>五、运行运维范围如下</p></Col>

                  <Col span={24}>
                    <MaintenanceScope
                      forminladeLayout={forminladeLayout}
                      maintenanceList={openReportlist.rangeList || []}
                      mainId={copyData.rangeList ? true : mainId}
                      type={reporttype}
                      startTime={startTime}
                      endTime={endTime}
                      newTroubleList={contentrowdata => {
                        setNewTroubleList(contentrowdata)
                      }}
                      reportSearch={reportSearch}
                    />
                  </Col>

                  {
                    !reportSearch && (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('rangeFiles', {
                            initialValue: openReportlist.rangeFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.rangeFiles ? JSON.parse(openReportlist.rangeFiles) : []}
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
                    )
                  }

                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.rangeFiles === '' ? '[]' : openReportlist.rangeFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>六、运维记录</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('operationContent', {
                          initialValue: openReportlist.operationContent || maintenanceRecords
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  {
                    !reportSearch && (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('operationFiles', {
                            initialValue: openReportlist.operationFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.operationFiles ? JSON.parse(openReportlist.operationFiles) : []}
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
                    )
                  }


                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.operationFiles === '' ? '[]' : openReportlist.operationFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>七、本月运维事件（故障）记录</p></Col>

                  <Col span={24}>
                    <FaultSummary
                      forminladeLayout={forminladeLayout}
                      eventList={computerroom.eventList || openReportlist.eventList || []}
                      type={reporttype}
                      getEventList={contentrowdata => {
                        setEventList(contentrowdata)
                      }}
                      reportSearch={reportSearch}
                    />
                  </Col>

                  <Col span={24}>
                    <MaintenanceList
                      forminladeLayout={forminladeLayout}
                      troubleList={computerroom.troubleList || openReportlist.troubleList || []}
                      type={reporttype}
                      gettroubleList={contentrowdata => {
                        settroubleList(contentrowdata)
                      }}
                      reportSearch={reportSearch}
                    />
                  </Col>

                  {
                    !reportSearch && (
                      <Col span={24} style={{ marginTop: 20 }}>
                        <Form.Item
                          label='上传附件'
                          {...formincontentLayout}
                        >
                          {getFieldDecorator('eventFiles', {
                            initialValue: openReportlist.eventFiles
                          })
                            (
                              <div>
                                <SysUpload
                                  fileslist={openReportlist.eventFiles ? JSON.parse(openReportlist.eventFiles) : []}
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
                    )
                  }

                  {
                    reportSearch && (
                      <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                        <Descriptions size="middle">
                          <Descriptions.Item label='上传附件'>
                            <span style={{ color: 'blue', textDecoration: 'underline' }} >
                              {openReportlist && <Downloadfile files={openReportlist.eventFiles === '' ? '[]' : openReportlist.eventFiles} />}
                            </span>
                          </Descriptions.Item>

                        </Descriptions>
                      </div>
                    )
                  }

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>八、运维工作小结</p></Col>

                  <Col span={24}><p>（1）值班情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('dutyContent', {
                          initialValue: openReportlist.dutyContent || dutySituation
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（2）故障处理情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('troubleHandleContent', {
                          initialValue: openReportlist.troubleHandleContent || TroubleShooting
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（3）监控情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('monitorContent', {
                          initialValue: openReportlist.monitorContent || monitoringSituation
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（4）网络安全及安防措施</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('networkContent', {
                          initialValue: openReportlist.networkContent || securityMeasures
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p>（5）作业管控情况</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('controlContent', {
                          initialValue: openReportlist.controlContent || operationControl
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>九、发现的问题、建议或改进措施</p></Col>
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('problemContent', {
                          initialValue: openReportlist.problemContent || proposal
                        })
                          (<TextArea autoSize={{ minRows: 3 }} disabled={reportSearch} />)
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
                        px={(index + 10).toString()}
                        addTable={(newdata, addpx, rowdelete) => {
                          handleaddTable(newdata, addpx, rowdelete)
                        }}
                        index={index}
                        dynamicData={list.length ? list[index] : {}}
                        loading={loading}
                        ChangeAddRow={v => setAddrow(v)}
                        sign={deleteSign}
                        detailParams={reportSearch}
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
                            disabled={olduploadstatus || reportSearch}
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
              disabled={olduploadstatus || reportSearch}
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
  connect(({ softreport, viewcache, loading }) => ({
    computerroom: softreport.computerroom,
    openReportlist: softreport.openReportlist || {},
    nextweekHomeworklist: softreport.nextweekHomeworklist,
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(ComputerroommonthlyReportdetail),
);
