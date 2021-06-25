import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Table,
  Popconfirm,
  Divider,
  Icon,
  message
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import Diskgroup from './components/DatabaseComponent/Diskgroup';
import Top10Surface from './components/DatabaseComponent/Top10Surface';
import Top10Increase from './components/DatabaseComponent/Top10Increase';
import QuestionsComments from './components/DatabaseComponent/QuestionsComments';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
import CopyLast from './components/CopyLast';
import CopyNext from './components/CopyNext';
import AddForm from './components/AddForm';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';

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

const { RangePicker, MonthPicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let monthStarttime;
let endTime;
function DatabaseReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    match: { params: { id } },
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
  const [addTitle, setAddTitle] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [discList, setDiscList] = useState([]); // 本周运维情况综述列表 
  const [tablespaceList, setTablespaceList] = useState([]) // 软件运维巡检
  const [tableUpList, setTableUpList] = useState([]) // 运维材料提交情况
  const [defectList, setDefectList] = useState([]) // 软件运维巡检
  const [operationList, setOperationList] = useState([]) // 上周作业计划
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [list, setList] = useState([]);
  const [copyData, setCopyData] = useState('');

  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const savedata = {
          ...values,
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: list?.length ? JSON.stringify(list) : '',
          type: reporttype === 'week' ? '数据库运维周报' : '数据库运维月报',
          reporttype,
          mainId,
          time1: startTime,
          time2: endTime,
          discList: JSON.stringify(discList),
          tablespaceList: JSON.stringify(tablespaceList),
          tableUpList: JSON.stringify(tableUpList),
          defectList: JSON.stringify(defectList),
          operationList: JSON.stringify(operationList),
          nextOperationList: JSON.stringify(nextOperationList),
        }
        dispatch({
          type: 'softreport/saveDataBase',
          payload: savedata
        })
      }

    })

  }

  const defaultTime = () => {
    //  周
    if (reporttype === 'week') {
      startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else {
      //  月
      startTime = moment().startOf('month').format('YYYY-MM-DD');
      endTime = moment().endOf('month').format('YYYY-MM-DD');
    }
  }
  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);

  //   七、上周作业完成情况--表格
  const lastweekHomework = () => {
    dispatch({
      type: 'softreport/lastweekHomework',
      payload: {
        time1: startTime,
        time2: endTime,
        pageIndex: 0,
        pageSize: 10
      }
    })
  }
  //   七、下周作业完成情况--表格
  const nextweekHomework = () => {
    dispatch({
      type: 'softreport/nextweekHomework',
      payload: {
        time1: startTime,
        time2: endTime,
        pageIndex: 0,
        pageSize: 10
      }
    })
  }

  // 新增一条记录
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData);
    // if(params.files) {
    //   softReportform()
    // }
  };


  const removeForm = (tableIndex) => {
    addTitle.splice(tableIndex, 1);
    const resultArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    setAddTitle(resultArr)
  }

  // 上传删除附件触发保存
  useEffect(() => {
    defaultTime();
    lastweekHomework();
    nextweekHomework();
  }, []);

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
        setCopyData(res)
        setAddTitle(res.addData)
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
      startTime = dateString;
      endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setFieldsValue({ time2: moment(endTime) });
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      endTime = date.endOf('month').format('YYYY-MM-DD');
    }
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(startTime) })
  }

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableNumber: [] });
    setAddTitle(nowNumber)
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        loading === false && (
          <>
            <Button type='primary' onClick={softReportform}>保存</Button>
            <Button type='primary' onClick={handlePaste}>粘贴</Button>
            <Button onClick={handleBack}>
              返回
            </Button>
          </>
        )

      }
    >
      <Card style={{ padding: 24 }}>
        {loading === false && (
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
                      <Input style={{ width: 700 }}/>
                    )}
                </Form.Item>
              </Col>

              {/* {
                reporttype === 'week' && (
                  <Col span={24}>
                    <Form.Item label='填报日期'>
                      {getFieldDecorator('time1', {
                        initialValue: [moment(copyData.main ? copyData.main.time1 : startTime), moment(copyData.main ? copyData.main.time2 : endTime)]
                      })(<RangePicker
                        allowClear={false}
                        // disabledDate={startdisabledDate}
                        // placeholder='请选择'
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              } */}

              {
                reporttype === 'week' && (
                  <div>
                    <Col span={24}>
                      <Form.Item label='填报时间' style={{ display: 'inline-flex' }}>
                        {getFieldDecorator('time1', {
                          rules: [
                            {
                              required,
                              message: '请输入填报时间'
                            }
                          ],
                          initialValue: moment(startTime)
                        })(
                          <DatePicker
                            allowClear={false}
                            style={{ marginRight: 10 }}
                            onChange={onChange}
                          />)}
                      </Form.Item>

                      <Form.Item label='' style={{ display: 'inline-flex' }}>
                        {
                          getFieldDecorator('time2', {
                            initialValue: moment(endTime)
                          })
                            (<DatePicker
                              allowClear={false}
                              onChange={endonChange}
                            />)
                        }
                      </Form.Item>
                    </Col>
                  </div>
                )
              }

              {
                reporttype === 'month' && (
                  <Col span={24}>
                    <Form.Item label='填报日期'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(copyData.main ? copyData.main.time1 : startTime)
                      })(<MonthPicker
                        allowClear={false}
                        // disabledDate={startdisabledDate}
                        // placeholder='请选择'
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {/* 一、本周运维情况综述 */}

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>{reporttype === 'week' ? '一、本周运维情况综述' : '一、本月运维情况综述'}</p>
              </Col>

              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('content', {
                      initialValue: copyData.content ? copyData.content : ''
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
                    initialValue: ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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
                  // discArr={copyData.discList ? copyData.discList : []}
                  discList={contentrowdata => {
                    // setDiscList(contentrowdata)
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

              {/* Top10表增长附件 */}
              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('tableUpFiles', {
                    initialValue: '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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
                    initialValue: '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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

              {/* 上周作业完成情况*/}
              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}> 四、上周作业完成情况</p>
              </Col>

              {
                copyData.operationList !== undefined && (
                  <Col span={24}>
                    <CopyLast
                      forminladeLayout={forminladeLayout}
                      operationArr={copyData.operationList}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setOperationList(contentrowdata)
                      }}
                      mainId={mainId}
                    />
                  </Col>
                )
              }

              {
                copyData.operationList === undefined && (
                  <Col span={24}>
                    <LastweekHomework
                      forminladeLayout={forminladeLayout}
                      operationArr={lastweekHomeworklist.rows}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      operationList={contentrowdata => {
                        setOperationList(contentrowdata)
                      }}
                    />
                  </Col>
                )
              }


              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('operationFiles', {
                    initialValue: '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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
                <p style={{ fontWeight: '900', fontSize: '16px' }}>五、下周作业计划</p>
              </Col>

              {
                copyData.operationList !== undefined && (
                  <Col span={24}>
                    <CopyNext
                      forminladeLayout={forminladeLayout}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      nextOperationList={contentrowdata => {
                        setNextOperationList(contentrowdata)
                      }}
                      nextOperationArr={copyData.nextOperationList}
                      mainId={mainId}
                    />
                  </Col>
                )
              }

              {
                copyData.operationList === undefined && (
                  <Col span={24}>
                    <NextweekHomework
                      forminladeLayout={forminladeLayout}
                      startTime={startTime}
                      endTime={endTime}
                      type={reporttype}
                      nextOperationList={contentrowdata => {
                        setNextOperationList(contentrowdata)
                      }}
                      nextOperationArr={nextweekHomeworklist.rows}
                      mainId={mainId}
                    />
                  </Col>
                )
              }


              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('nextOperationFiles', {
                    initialValue: '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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

              {loading === false && addTitle && addTitle.length > 0 && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={index + 6}
                          addTable={newdata => {
                            handleaddTable(newdata)
                          }}
                          dynamicData={addTitle[index]}
                          index={index}
                          loading={loading}
                        />
                      </Col>

                      <Col span={1}>
                        <Icon
                          className="dynamic-delete-button"
                          type="minus-circle-o"
                          onClick={() => removeForm(index)}
                        />
                      </Col>

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

        )}

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
