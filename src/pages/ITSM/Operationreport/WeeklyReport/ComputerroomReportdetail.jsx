import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Descriptions,
  Icon,
  message,
  Spin
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import InspectionSummary from './components/ComputerroomComponent/InspectionSummary';
import NewTroublelist from './components/ComputerroomComponent/NewTroublelist';
import UnCloseTroublelist from './components/ComputerroomComponent/UnCloseTroublelist';
import LastweekHomework from './components/LastweekHomework';
import WeeklyMeeting from './components/ComputerroomComponent/WeeklyMeeting';
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
    sm: { span: 6 },
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

let saveSign = true;

function ComputerroomReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      type,
      reporttype,
      status,
      mainId,
      reportSearch
    } },
    dispatch,
    openReportlist,
    loading,
    olduploadstatus,
    location
  } = props;
  const tabActiveKey = 'week';

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileslist, setFilesList] = useState([]);

  const [materialsList, setMaterialsList] = useState([]) // 材料列表
  const [meetingSummaryList, setMeetingSummaryList] = useState([]) // 周例会会议纪要完成情况列表
  const [newTroubleList, setNewTroubleList] = useState([]) // 新故障列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [operationList, setOperationList] = useState([]) // 更新列表
  const [unCloseTroubleList, setUnCloseTroubleList] = useState([]) // 运维分类统计
  const [list, setList] = useState([]);

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { main } = openReportlist;

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
          patrolAndExamineContent: value.patrolAndExamineContent || '',
          status,
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '机房运维周报' : '机房运维月报',
          reporttype,
          mainId,
          time1: moment(startTime).format('YYYY-MM-DD'),
          time2: moment(endTime).format('YYYY-MM-DD'),
          materialsList: JSON.stringify(materialsList || ''),
          meetingSummaryList: JSON.stringify(meetingSummaryList || ''),
          newTroubleList: JSON.stringify(newTroubleList || ''),
          nextOperationList: JSON.stringify(nextOperationList || ''),
          operationList: JSON.stringify(operationList || ''),
          unCloseTroubleList: JSON.stringify(unCloseTroubleList || ''),
        }
        return dispatch({
          type: 'softreport/saveComputer',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            getopenFlow();
          } else {
            message.info('保存失败')
          }
        })
      }

    })
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      computerReportform();
    }
  }, [files]);

  useEffect(() => {
    if (loading === false && saveSign) {
      const { addData } = openReportlist;
      setList(addData);
    }

    const materialsArr = openReportlist.materialsList;
    const meetingSummaryArr = openReportlist.meetingSummaryList;
    const newTroubleArr = openReportlist.newTroubleList;
    const nextOperationArr = openReportlist.nextOperationList;
    const operationArr = openReportlist.operationList;
    const unCloseTroubleArr = openReportlist.unCloseTroubleList;

    setMaterialsList(materialsArr);
    setMeetingSummaryList(meetingSummaryArr);
    setNewTroubleList(newTroubleArr);
    setNextOperationList(nextOperationArr);
    setOperationList(operationArr);
    setUnCloseTroubleList(unCloseTroubleArr);

    if (openReportlist && main) {
      const saveInitlatime1 = openReportlist.main.time1;
      const saveInitlatime2 = openReportlist.main.time2;
      setStartTime(saveInitlatime1)
      setEndTime(saveInitlatime2)
    }
  }, [loading])

  useEffect(() => {
    saveSign = true;
  }, [])

  useEffect(() => {
    if (mainId) {
      getopenFlow()
    }
  }, [mainId])

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

  useEffect(() => {
    if (startTime) {
      setTimeshow(true);
    }
  }, [timeshow])

  useEffect(() => {
    if(location.state && location.state.reset && mainId) {
      getopenFlow()
    }
  },[location.state])

  // 动态保存
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


  const exportWord = () => {
    dispatch({
      type: 'softreport/exportWord',
      payload: { mainId }
    }).then(res => {
      const fieldName = '下载机房运维月报.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fieldName;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  const dateFormat = 'YYYY-MM-DD';

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {loading === false && (
            <Button
              type='primary'
              onClick={exportWord}
              disabled={olduploadstatus}
            >导出</Button>
          )}

          {loading === false && !reportSearch && main && main.time1 && unCloseTroubleList !== undefined && (
            <Button
              type='primary'
              onClick={() => { saveSign = false; computerReportform() }}
              disabled={olduploadstatus}
            >保存</Button>
          )}

          <Button onClick={handleBack}>
            返回
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
        {loading === false && main && main.time1 && unCloseTroubleList !== undefined && (
          <Row gutter={24}>
            <Form>
              <Col span={24}>
                <Form.Item
                  label={reporttype === 'week' ? '周报名称' : '月报名称'}
                  style={{ display: 'inline-flex' }}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '请输入名称'
                      }
                    ],
                    initialValue: main ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} style={{ width: 700 }} placeholder={`省级集中计量自动化系统机房运维${reporttype === 'week' ? '周' : '月'}报`} />
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
                        initialValue: main ? moment(main.time1) : ''
                      })(<MonthPicker
                        allowClear={false}
                        onChange={onChange}
                        disabled={reportSearch}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '一、本周运维总结' : '一、本月运维总结'}</p></Col>
              {/* 本周运维总结 */}
              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('content', {
                      initialValue: main ? main.content : ''
                    })
                      (
                        <TextArea
                          disabled={reportSearch}
                          autoSize={{ minRows: 3 }}
                        />)
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
                        initialValue: openReportlist.contentFiles ? openReportlist.contentFiles : ''
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


              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>二、巡检汇总</p></Col>

              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('patrolAndExamineContent', {
                      initialValue: openReportlist.patrolAndExamineContent
                    })
                      (
                        <TextArea
                          autoSize={{ minRows: 3 }}
                          disabled={reportSearch}
                        />
                      )
                  }
                </Form.Item>
              </Col>

              {/* 运维材料提交情况 */}
              <Col span={24}>
                <InspectionSummary
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  maintenanceArr={[]}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={tabActiveKey}
                  materialsList={contentrowdata => {
                    setMaterialsList(contentrowdata)
                  }}
                  materialsArr={openReportlist.materialsList ? openReportlist.materialsList : []}
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
                      {getFieldDecorator('materialsFiles', {
                        initialValue: openReportlist.materialsFiles ? openReportlist.materialsFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.materialsFiles ? JSON.parse(openReportlist.materialsFiles) : []}
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.materialsFiles === '' ? '[]' : openReportlist.materialsFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              {/* 3 本周新增故障及故障修复情况统计 */}

              <Col span={24}>
                <NewTroublelist
                  forminladeLayout={forminladeLayout}
                  type={reporttype}
                  newTroubleList={contentrowdata => {
                    setNewTroubleList(contentrowdata)
                  }}
                  faultlist={openReportlist.newTroubleList ? openReportlist.newTroubleList : []}
                  mainId={mainId}
                  reportSearch={reportSearch}
                />
              </Col>

              <Col span={24}>
                <UnCloseTroublelist
                  forminladeLayout={forminladeLayout}
                  type={type}
                  startTime={startTime}
                  endTime={endTime}
                  unCloseTroubleList={contentrowdata => {
                    setUnCloseTroubleList(contentrowdata)
                  }}
                  uncloseaultlist={openReportlist.unCloseTroubleList ? openReportlist.unCloseTroubleList : []}
                  mainId={mainId}
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
                      {getFieldDecorator('troubleFiles', {
                        initialValue: openReportlist.troubleFiles ? openReportlist.troubleFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.troubleFiles ? JSON.parse(openReportlist.troubleFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ troubleFiles: JSON.stringify(newvalue.arr) })
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
                          {openReportlist && <Downloadfile files={openReportlist.troubleFiles === '' ? '[]' : openReportlist.troubleFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }


              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}> 四、作业管控情况（含预防性运维）</p>
              </Col>

              <Col span={24}><p>{reporttype === 'week' ? '(1)本周作业完成情况' : '(1)本月作业完成情况'}</p></Col>

              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('operationContent', {
                      initialValue: openReportlist.operationContent ? openReportlist.operationContent : ''
                    })
                      (<TextArea
                        autoSize={{ minRows: 3 }}
                        disabled={reportSearch}
                      />)
                  }
                </Form.Item>
              </Col>


              {/* 4.本周作业完成情况 */}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  operationArr={openReportlist.operationList ? openReportlist.operationList : []}
                  mainId={mainId}
                  detailParams={reportSearch}
                  databaseParams='true'
                />
              </Col>


              <Col span={24}><p style={{ marginTop: 20 }}>{reporttype === 'week' ? '(2)本周工作票开具情况及服务器查询操作票情况统计' : '(2)本月工作票开具情况及服务器查询操作票情况统计'}</p></Col>

              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('billingContent', {
                      initialValue: openReportlist.billingContent ? openReportlist.billingContent : ''
                    })
                      (<TextArea
                        autoSize={{ minRows: 3 }}
                        disabled={reportSearch}
                      />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>{reporttype === 'week' ? '(3)下周作业完成情况' : '(3)下月作业完成情况'}</Col>

              {/* 下周工作计划 */}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  operationArr={openReportlist.nextOperationList ? openReportlist.nextOperationList : []}
                  mainId={mainId}
                  detailParams={reportSearch}
                  databaseParams='true'
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('nextOperationFiles', {
                        initialValue: openReportlist.nextOperationFiles ? openReportlist.nextOperationFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.nextOperationFiles ? JSON.parse(openReportlist.nextOperationFiles) : []}
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.nextOperationFiles === '' ? '[]' : openReportlist.nextOperationFiles} />}
                        </span>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>

                )
              }

              {/* 5 周例会会议纪要完成情况 */}
              <Col span={24}>
                <WeeklyMeeting
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  meetingSummaryList={contentrowdata => {
                    setMeetingSummaryList(contentrowdata)
                  }}
                  meetingSummaryarr={openReportlist.meetingSummaryList ? openReportlist.meetingSummaryList : []}
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
                      {getFieldDecorator('meetingSummaryFiles', {
                        initialValue: openReportlist.meetingSummaryFiles ? openReportlist.meetingSummaryFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.meetingSummaryFiles ? JSON.parse(openReportlist.meetingSummaryFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ meetingSummaryFiles: JSON.stringify(newvalue.arr) })
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
                          {openReportlist && <Downloadfile files={openReportlist.meetingSummaryFiles === '' ? '[]' : openReportlist.meetingSummaryFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              {(loading === false && list && list.length > 0) && (
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
                          // dynamicData={undefined}
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
                disabled={olduploadstatus || reportSearch}
              >
                新增其他内容
              </Button>

            </Form>
          </Row>

        )}

      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ softreport, viewcache, loading }) => ({
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(ComputerroomReportdetail),
);
