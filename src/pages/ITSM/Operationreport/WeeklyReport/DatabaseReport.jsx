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
import Diskgroup from './components/DatabaseComponent/Diskgroup';
import Top10Surface from './components/DatabaseComponent/Top10Surface';
import Top10Increase from './components/DatabaseComponent/Top10Increase';
import Morethan5g from './components/DatabaseComponent/Morethan5g';
import QuestionsComments from './components/DatabaseComponent/QuestionsComments';
import LastweekHomework from './components/LastweekHomework';
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

let initial = false;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;
function DatabaseReport(props) {
  const pagetitle = props.route.name;
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
    loading,
  } = props;


  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileslist, setFilesList] = useState([]);
  const [discList, setDiscList] = useState([]); // 本周运维情况综述列表 
  const [tablespaceList, setTablespaceList] = useState([]) // 软件运维巡检
  const [tableUpList, setTableUpList] = useState([]) // 运维材料提交情况
  const [defectList, setDefectList] = useState([]) // 软件运维巡检
  const [operationList, setOperationList] = useState([]) // 上周作业计划
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [table5GList, setTable5GList] = useState([]) // 下周作业列表
  const [list, setList] = useState([]);
  const [copyData, setCopyData] = useState('');

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  //  保存表单
  const databaseReportform = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const savedata = {
          ...values,
          content: values.content || '',
          contentFiles: values.contentFiles || '',
          patrolAndExamineContent: values.patrolAndExamineContent || '',
          tableUpFiles: values.tableUpFiles || '',
          defectFiles: values.defectFiles || '',
          operationFiles: values.operationFiles || '',
          nextOperationFiles: values.nextOperationFiles || '',
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: list?.length ? JSON.stringify(list) : '',
          type: reporttype === 'week' ? '数据库运维周报' : '数据库运维月报',
          reporttype,
          mainId,
          time1: moment(startTime).format('YYYY-MM-DD'),
          time2: moment(endTime).format('YYYY-MM-DD'),
          discList: JSON.stringify(discList || ''),
          tablespaceList: JSON.stringify(tablespaceList || ''),
          tableUpList: JSON.stringify(tableUpList || ''),
          defectList: JSON.stringify(defectList || ''),
          operationList: JSON.stringify(operationList || ''),
          nextOperationList: JSON.stringify(nextOperationList || ''),
          table5GList: JSON.stringify(table5GList || ''),
        }
        console.log(savedata,'savedata')
        dispatch({
          type: 'softreport/saveDataBase',
          payload: savedata
        })
      }
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

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      databaseReportform();
    }
  }, [files]);

  useEffect(() => {
    setOperationList(copyData.operationList ? copyData.operationList : lastweekHomeworklist);
    setNextOperationList(copyData.nextOperationList ? copyData.nextOperationList : nextweekHomeworklist);
  }, [loading])


  //   七、上周作业完成情况--表格
  const lastweekHomework = () => {
    dispatch({
      type: 'softreport/lastweekHomework',
      payload: {
        plannedEndTime1: reporttype === 'week' ? `${startTime} 00:00:00` : moment(startTime).startOf('month').format('YYYY-MM-DD 00:00:00'),
        plannedEndTime2: reporttype === 'week' ? `${endTime} 23:59:59` : moment(endTime).endOf('month').format('YYYY-MM-DD 00:00:00'),
        type: '数据库作业',
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
        type: '数据库作业',
        pageIndex: 0,
        pageSize: 1000,
        database: 'true'
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

  // 上传删除附件触发保存
  useEffect(() => {
    initial = false;
    defaultTime();
  }, []);

  const getDatabasereportdata = () => {
    lastweekHomework();
    nextweekHomework();
    initial = true;
  }

  //  粘贴
  const handlePaste = () => {
    if (!listreportType || !listId) {
      message.info('请在列表选择一条数据复制哦')
      return false;
    }

    if (listreportType !== '数据库运维周报') {
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
        initial = true;
      } else {
        message.info('您无法复制该条记录，请返回列表重新选择')
      }
    })
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

  useEffect(() => {
    if (startTime) {
      setTimeshow(true);
    }
  }, [timeshow])

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
      title={pagetitle}
      extra={
        <>
          <Button type='primary' onClick={databaseReportform}>保存</Button>
          <Button type='primary' onClick={handlePaste}>粘贴</Button>
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
                      onClick={getDatabasereportdata}
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
                          message: '请输入填报时间'
                        }
                      ],
                      initialValue: copyData.main ? moment(copyData.main.time1) : moment(startTime)
                    })(<MonthPicker
                      allowClear={false}
                      onChange={onChange}
                    />)}
                  </Form.Item>

                  <Button
                    type='primary'
                    style={{ marginLeft: 10, marginTop: 5 }}
                    onClick={getDatabasereportdata}
                  >
                    获取数据
                  </Button>
                </Col>
              )
            }

            {/* 一、本周运维情况综述 */}
            {
              initial && loading === false && lastweekHomeworklist && startTime && (
                <>
                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>{reporttype === 'week' ? '一、本周运维情况综述' : '一、本月运维情况综述'}</p>
                  </Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('content', {
                          initialValue: copyData && copyData.main ? copyData.main.content : ''
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData && copyData.contentFiles ? JSON.parse(copyData.contentFiles) : []}
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

                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px' }}>二、巡检汇总</p>
                  </Col>

                  <Col span={24}>
                    <Form.Item label=''>
                      {
                        getFieldDecorator('patrolAndExamineContent', {
                          initialValue: copyData.patrolAndExamineContent ? copyData.patrolAndExamineContent : ''
                        })(<TextArea autoSize={{ minRows: 3 }} />)
                      }
                    </Form.Item>
                  </Col>

                  {/* 二、常规运维工作开展情况 */}
                  {/* 磁盘组 */}
                  <Col span={24}>
                    <Diskgroup
                      forminladeLayout={forminladeLayout}
                      discArr={[]}
                      discList={contentrowdata => {
                        setDiscList(contentrowdata)
                      }}
                    />
                  </Col>

                  <Col span={24}>
                    <Top10Surface
                      forminladeLayout={forminladeLayout}
                      tablespaceArr={copyData.tablespaceList ? copyData.tablespaceList : []}
                      tablespaceList={contentrowdata => {
                        setTablespaceList(contentrowdata)
                      }}
                      startTime={startTime}
                      endTime={endTime}
                    />
                  </Col>

                  <Col span={24}>
                    <Top10Increase
                      forminladeLayout={forminladeLayout}
                      tableUpArr={copyData.tableUpList ? copyData.tableUpList : []}
                      tableUpList={contentrowdata => {
                        setTableUpList(contentrowdata)
                      }}
                      startTime={startTime}
                      endTime={endTime}
                    />
                  </Col>

                  <Col span={24}>
                    <Morethan5g
                      forminladeLayout={forminladeLayout}
                      table5Garr={copyData.table5GList ? copyData.table5GList : []}
                      table5GList={contentrowdata => {
                        setTable5GList(contentrowdata)
                      }}
                      startTime={startTime}
                      endTime={endTime}
                    />
                  </Col>

                  {/* Top10表增长附件 */}
                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('tableUpFiles', {
                        initialValue: copyData && copyData.tableUpFiles
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData && copyData.tableUpFiles ? JSON.parse(copyData.tableUpFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ tableUpFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>

                  {/* 三、发现问题及修改建议 */}
                  <Col span={24}>
                    <QuestionsComments
                      forminladeLayout={forminladeLayout}
                      defectArr={copyData.defectList ? copyData.defectList : []}
                      defectList={contentrowdata => {
                        setDefectList(contentrowdata)
                      }}
                      startTime={startTime}
                      endTime={endTime}
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('defectFiles', {
                        initialValue: copyData && copyData.defectFiles
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData && copyData.defectFiles ? JSON.parse(copyData.defectFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ defectFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}
                    </Form.Item>
                  </Col>

                  {/* 上周作业完成情况 */}

                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '四、上周作业完成情况' : '四、上月作业完成情况'}</p>
                  </Col>

                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      operationArr={copyData.operationList !== undefined ? copyData.operationList : lastweekHomeworklist}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setOperationList(contentrowdata)
                      }}
                      databaseParams='true'
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
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData && copyData.operationFiles ? JSON.parse(copyData.operationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ operationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>

                  {/* 下周工作计划 */}
                  <Col span={24}>
                    <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '五、下周作业计划' : '五、下月作业计划'}</p>
                  </Col>

                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setNextOperationList(contentrowdata)
                      }}
                      operationArr={copyData.nextOperationList !== undefined ? copyData.nextOperationList : nextweekHomeworklist}
                      mainId={mainId}
                      databaseParams='true'
                    />
                  </Col>

                  <Col span={24} style={{ marginTop: 20 }}>
                    <Form.Item
                      label='上传附件'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('nextOperationFiles', {
                        initialValue: copyData && copyData.operationFiles
                      })
                        (
                          <div style={{ width: 400 }}>
                            <SysUpload
                              fileslist={copyData && copyData.operationFiles ? JSON.parse(copyData.operationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ nextOperationFiles: JSON.stringify(newvalue.arr) })
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
              onClick={() => newMember()}
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
    maintenanceArr: softreport.maintenanceArr,
    ordertopnArr: softreport.ordertopnArr,
    maintenanceService: softreport.maintenanceService,
    soluteArr: softreport.soluteArr,
    thisWeekitsmlist: softreport.thisWeekitsmlist,
    lastweekHomeworklist: softreport.lastweekHomeworklist,
    nextweekHomeworklist: softreport.nextweekHomeworklist,
    loading: loading.models.softreport,
  }))(DatabaseReport),
);
