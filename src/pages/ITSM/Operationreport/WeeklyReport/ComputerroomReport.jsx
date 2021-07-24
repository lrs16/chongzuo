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
import InspectionSummary from './components/ComputerroomComponent/InspectionSummary';
import NewTroublelist from './components/ComputerroomComponent/NewTroublelist';
import CopyNewTroublelist from './components/ComputerroomComponent/CopyNewTroublelist';
import CopyUnCloseTroublelist from './components/ComputerroomComponent/CopyUnCloseTroublelist';
import UnCloseTroublelist from './components/ComputerroomComponent/UnCloseTroublelist';
import LastweekHomework from './components/LastweekHomework';
import CopyLast from './components/CopyLast';
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
let initial = false;

function ComputerroomReport(props) {
  const pagetitle = props.route.name;
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
    nextweekHomeworklist,
    loading,
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
  const [copyData, setCopyData] = useState('');

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  //  保存表单
  const computerReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          content: value.content || '',
          contentFiles: value.contentFiles || '',
          patrolAndExamineContent: value.patrolAndExamineContent || '',
          materialsFiles: value.materialsFiles || '',
          troubleFiles: value.troubleFiles || '',
          operationContent: value.operationContent || '',
          billingContent: value.billingContent || '',
          nextOperationFiles: value.nextOperationFiles || '',
          meetingSummaryFiles: value.meetingSummaryFiles || '',
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '机房运维周报' : '机房运维月报',
          reporttype,
          mainId,
          time1: reporttype === 'week' ? moment(startTime).format('YYYY-MM-DD') : moment(startTime).startOf('month').format('YYYY-MM-DD'),
          time2: reporttype === 'week' ? moment(endTime).format('YYYY-MM-DD') : moment(endTime).endOf('month').format('YYYY-MM-DD'),
          materialsList: JSON.stringify(materialsList || ''),
          meetingSummaryList: JSON.stringify(meetingSummaryList || ''),
          newTroubleList: JSON.stringify(newTroubleList || ''),
          nextOperationList: JSON.stringify(nextOperationList || ''),
          operationList: JSON.stringify(operationList || ''),
          unCloseTroubleList: JSON.stringify(unCloseTroubleList || ''),
        }
        dispatch({
          type: 'softreport/saveComputer',
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
        setCopyData(res)
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
    const currentstartTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    const currentendTime = moment().format('YYYY-MM-DD');

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
    setMaterialsList(copyData.materialsList ? copyData.materialsList : []);
    setNewTroubleList(copyData.newTroubleList ? copyData.newTroubleList : faultQueryList);
    setUnCloseTroubleList(copyData.unCloseTroubleList ? copyData.unCloseTroubleList : nofaultQueryList);
    setOperationList(copyData.operationList ? copyData.operationList : lastweekHomeworklist);
    setNextOperationList(copyData.nextOperationList ? copyData.nextOperationList : nextweekHomeworklist);
  }, [loading])

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
  const lastweekHomework = () => {
    dispatch({
      type: 'softreport/lastweekHomework',
      payload: {
        plannedEndTime1: reporttype === 'week' ? `${startTime} 00:00:00`: moment(startTime).startOf('month').format('YYYY-MM-DD 00:00:00'),
        plannedEndTime2: reporttype === 'week' ?`${endTime} 23:59:59`: moment(endTime).endOf('month').format('YYYY-MM-DD 00:00:00'),
        type: '机房作业',
        pageIndex: 0,
        pageSize: 1000,
        database: 'true'
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
  }, []);

  const getReportdata = () => {
    lastweekHomework();
    nextweekHomework();
    getQuerylist();
    initial = true;
  }


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
        // loading === false && (
        <>
          <Button type='primary' onClick={computerReportform}>保存</Button>
          <Button type='primary' onClick={handlePaste}>粘贴</Button>
          <Button onClick={handleBack}>
            返回
          </Button>
        </>
        // )
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
                    <Input style={{ width: 700 }} />
                  )}
              </Form.Item>
            </Col>

            {
              reporttype === 'week' && startTime && timeshow && (
                <Col span={24}>
                  <div>
                    <span style={{ marginLeft: 10 }}>填报时间 :</span>
                    {
                      timeshow && (
                        <span
                          style={{ marginRight: 10, marginLeft: 10 }}
                        >
                          <DatePicker
                             allowClear={false}
                            // defaultValue={moment(endTime, dateFormat)}
                            format={dateFormat}
                            defaultValue={moment(startTime)}
                            onChange={onChange}
                          />
                        </span>
                      )
                    }

                    <span
                      style={{ marginRight: 10 }}
                    >-</span>

                    {
                      timeshow && (
                        <span>
                          <DatePicker
                             allowClear={false}
                            // defaultValue={moment(endTime, dateFormat)}
                            format={dateFormat}
                            defaultValue={moment(endTime)}
                            onChange={endonChange}

                          />
                        </span>

                      )
                    }

                    <Button
                      type='primary'
                      style={{ marginLeft: 10, marginTop: 5 }}
                      onClick={getReportdata}
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
                      allowClear
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
              initial && loading === false && faultQueryList && startTime && (
                <>
                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px', marginTop: 24 }}>{reporttype === 'week' ? '一、本周运维总结' : '一、本月运维总结'}</p></Col>
                  {/* 本周运维总结 */}
                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('content', {
                          initialValue: copyData.main ? copyData.main.content : ''
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
                        initialValue: copyData.contentFiles ? copyData.contentFiles : ''
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData.contentFiles ? JSON.parse(copyData.contentFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ contentFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>二、巡检汇总</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('patrolAndExamineContent', {
                          initialValue: copyData.patrolAndExamineContent ? copyData.patrolAndExamineContent : ''
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  {/* 运维材料提交情况 */}
                  <Col span={24}>
                    <InspectionSummary
                      formItemLayout={formItemLayout}
                      forminladeLayout={forminladeLayout}
                      startTime={startTime}
                      endTime={endTime}
                      tabActiveKey={tabActiveKey}
                      materialsList={contentrowdata => {
                        setMaterialsList(contentrowdata)
                      }}
                      materialsArr={copyData.materialsList ? copyData.materialsList : []}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('materialsFiles', {
                        initialValue: copyData.materialsFiles ? copyData.materialsFiles : ''
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData.materialsFiles ? JSON.parse(copyData.materialsFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ materialsFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>


                  {/* 3 本周新增故障及故障修复情况统计 */}

                  {/* {
                    copyData.operationList !== undefined && (
                      <Col span={24}>
                        <CopyNewTroublelist
                          forminladeLayout={forminladeLayout}
                          faultlist={copyData.newTroubleList}
                          type={reporttype}
                          startTime={startTime}
                          endTime={endTime}
                          newTroubleList={contentrowdata => {
                            setNewTroubleList(contentrowdata)
                          }}
                        />
                      </Col>
                    )
                  } */}

                  {/* {
                    copyData.operationList === undefined && ( */}
                  <Col span={24}>
                    <NewTroublelist
                      forminladeLayout={forminladeLayout}
                      faultlist={copyData.newTroubleList ? copyData.newTroubleList : faultQueryList}
                      mainId={copyData.newTroubleList ? true : mainId}
                      type={reporttype}
                      startTime={startTime}
                      endTime={endTime}
                      newTroubleList={contentrowdata => {
                        setNewTroubleList(contentrowdata)
                      }}
                    />
                  </Col>
                  {/* //   )
                  // } */}

                  <Col span={24}>
                    <UnCloseTroublelist
                      forminladeLayout={forminladeLayout}
                      uncloseaultlist={copyData.unCloseTroubleList ? copyData.unCloseTroubleList : nofaultQueryList}
                      type={reporttype}
                      mainId={copyData.unCloseTroubleList ? true : mainId}
                      startTime={startTime}
                      endTime={endTime}
                      unCloseTroubleList={contentrowdata => {
                        setUnCloseTroubleList(contentrowdata)
                      }}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('troubleFiles', {
                        initialValue: copyData.troubleFiles ? copyData.troubleFiles : ''
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData.troubleFiles ? JSON.parse(copyData.troubleFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ troubleFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px' }}> 四、作业管控情况（含预防性运维）</p>
                  </Col>

                  <Col span={24}><p>{reporttype === 'week' ? '(1)本周作业完成情况' : '(1)本月作业完成情况'}</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('operationContent', {
                          initialValue: copyData.operationContent ? copyData.operationContent : ''
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  {/* 4.本周作业完成情况 */}
                  {/* {
                    copyData.operationList !== undefined && (
                      <Col span={24}>
                        <CopyLast
                          forminladeLayout={forminladeLayout}
                          operationArr={copyData.operationList}
                          type={reporttype}
                          operationList={contentrowdata => {
                            setOperationList(contentrowdata)
                          }}
                        />
                      </Col>
                    )
                  } */}

                  {/* {
                    copyData.operationList === undefined && ( */}
                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      operationArr={copyData.operationList !== undefined ? copyData.operationList : lastweekHomeworklist}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setOperationList(contentrowdata)
                      }}
                      mainId={copyData.operationList ? true : mainId}
                      databaseParams='true'
                    />
                  </Col>
                  {/* //   )
                  // } */}

                  <Col span={24}><p style={{ marginTop: 20 }}>{reporttype === 'week' ? '(2)本周工作票开具情况及服务器查询操作票情况统计' : '(2)本月工作票开具情况及服务器查询操作票情况统计'}</p></Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('billingContent', {
                          initialValue: copyData.billingContent ? copyData.billingContent : ''
                        })
                          (<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  <Col span={24}>{reporttype === 'week' ? '(3)下周作业完成情况' : '(3)下月作业完成情况'}</Col>

                  {/* {
                    copyData.operationList !== undefined && (
                      <Col span={24}>
                        <CopyLast
                          forminladeLayout={forminladeLayout}
                          operationArr={copyData.nextOperationList}
                          type={reporttype}
                          operationList={contentrowdata => {
                            setNextOperationList(contentrowdata)
                          }}
                        />
                      </Col>
                    )
                  } */}

                  {/* 下周工作计划 */}
                  {/* {
                    copyData.operationList === undefined && ( */}
                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      operationArr={copyData.nextOperationList !== undefined ? copyData.nextOperationList : nextweekHomeworklist}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setNextOperationList(contentrowdata)
                      }}
                      databaseParams='true'
                    />
                  </Col>
                  {/* //   )
                  // } */}

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('nextOperationFiles', {
                        initialValue: copyData.nextOperationFiles ? copyData.nextOperationFiles : ''
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData.nextOperationFiles ? JSON.parse(copyData.nextOperationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ meetingSummaryFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>

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
                      meetingSummaryarr={copyData.meetingSummaryList ? copyData.meetingSummaryList : []}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('meetingSummaryFiles', {
                        initialValue: copyData.meetingSummaryFiles ? copyData.meetingSummaryFiles : ''
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData.meetingSummaryFiles ? JSON.parse(copyData.meetingSummaryFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ meetingSummaryFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
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
              // onClick={() => {newMember(); setAddrow(true)}}
              onClick={() => { newMember() }}
              // disabled={addrow}
              icon="plus"
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
  connect(({ softreport, loading }) => ({
    lastweekHomeworklist: softreport.lastweekHomeworklist,
    nextweekHomeworklist: softreport.nextweekHomeworklist,
    faultQueryList: softreport.faultQueryList,
    nofaultQueryList: softreport.nofaultQueryList,
    loading: loading.models.softreport,
  }))(ComputerroomReport),
);
