import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Icon,
  message
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import InspectionSummary from './components/ComputerroomComponent/InspectionSummary';
import NewTroublelist from './components/ComputerroomComponent/NewTroublelist';
import UnCloseTroublelist from './components/ComputerroomComponent/UnCloseTroublelist';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
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

const { RangePicker, MonthPicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let endTime;
function ComputerroomReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query: {
      reporttype,
      mainId,
      listreportType,
      listId,
    } },
    dispatch,
    faultQueryList,
    // remainingDefectslist,
    lastweekHomeworklist,
    nextweekHomeworklist,
    maintenanceArr, // 事件统计
    loading,
  } = props;
  let tabActiveKey = 'week';

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [addTitle, setAddTitle] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [billingContent, setBillingContent] = useState([]); // 工作票情况
  const [materialsList, setMaterialsList] = useState([]) // 材料列表
  const [meetingSummaryList, setMeetingSummaryList] = useState([]) // 周例会会议纪要完成情况列表
  const [newTroubleList, setNewTroubleList] = useState([]) // 新故障列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [operationList, setOperationList] = useState([]) // 更新列表
  const [unCloseTroubleList, setUnCloseTroubleList] = useState([]) // 运维分类统计
  const [list, setList] = useState([]);
  const [copyData, setCopyData] = useState('');
  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '机房运维周报' : '机房运维月报',
          reporttype,
          mainId,
          time1: startTime,
          time2: endTime,
          materialsList: JSON.stringify(materialsList),
          meetingSummaryList: JSON.stringify(meetingSummaryList),
          newTroubleList: JSON.stringify(newTroubleList),
          nextOperationList: JSON.stringify(nextOperationList),
          operationList: JSON.stringify(operationList),
          unCloseTroubleList: JSON.stringify(unCloseTroubleList),
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
        setAddTitle(res.addData)
      } else {
        message.info('您无法复制该条记录，请返回列表重新选择')
      }
    })
  }


  // 新增一条记录
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData)
  };

  //  移除表格
  const removeForm = (tableIndex) => {
    addTitle.splice(tableIndex, 1);
    list.splice(tableIndex, 1);
    const resultArr = [];
    const listArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    for (let i = 0; i < list.length; i++) {
      listArr.push(list[i])
    }
    setAddTitle(resultArr)
    setList(listArr)
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

  const getQuerylist = () => {
    dispatch({
      type: 'softreport/getfaultQueryList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        addTimeBegin: startTime,
        addTimeEnd: endTime,
      }
    })
  }

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

  useEffect(() => {
    lastweekHomework();
    nextweekHomework();
    defaultTime();
    getQuerylist();
  }, []);

  const handleBack = () => {
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }

  const onChange = (date, dateString) => {
    if (reporttype === 'week') {
      startTime = dateString[0];
      endTime = dateString[1];
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      endTime = date.endOf('month').format('YYYY-MM-DD');
    }
  }

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableIndex: [] });
    setAddTitle(nowNumber)
  }

  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '新建机房运维周报' : '新建机房运维月报'}
      extra={
        loading === false && (
          <>
            <Button type='primary' onClick={softReportform}>保存</Button>
            <Button type='primary' onClick={handlePaste}>粘贴</Button>
            <Button type='primary' onClick={handleBack}>
              返回
            </Button>
          </>
        )

      }
    >
      <Card>
        {loading === false && (
          <Row gutter={16}>
            <Form>
              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '周报名称' : '月报名称'}>
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
                      <Input />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && (
                  <Col span={24}>
                    <Form.Item label='起始时间'>
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
              }

              {
                reporttype === 'month' && (
                  <Col span={24}>
                    <Form.Item label='起始时间'>
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

              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '一、本周运维总结':'一、本月运维总结'}</p></Col>
              {/* 本周运维总结 */}
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

              <Col span={24} style={{marginTop:20}}>
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

              <Col span={24}>
                <NewTroublelist
                  forminladeLayout={forminladeLayout}
                  faultlist={copyData.newTroubleList ? copyData.newTroubleList : faultQueryList.rows}
                  mainId={copyData.newTroubleList ? true : mainId}
                  type={reporttype}
                  startTime={startTime}
                  endTime={endTime}
                  newTroubleList={contentrowdata => {
                    setNewTroubleList(contentrowdata)
                  }}
                />
              </Col>

              <Col span={24}>
                <UnCloseTroublelist
                  forminladeLayout={forminladeLayout}
                  uncloseaultlist={copyData.unCloseTroubleList ? copyData.unCloseTroubleList : faultQueryList.rows}
                  type={reporttype}
                  mainId={copyData.unCloseTroubleList ? true : mainId}
                  startTime={startTime}
                  endTime={endTime}
                  unCloseTroubleList={contentrowdata => {
                    setUnCloseTroubleList(contentrowdata)
                  }}
                />
              </Col>

              <Col span={24} style={{marginTop:20}}>
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
                <p style={{ fontWeight: '900', fontSize: '16px' }}> 4 作业管控情况（含预防性运维）</p>
              </Col>

              <Col span={24}><p>{reporttype === 'week' ? '4.1本周作业完成情况' : '4.1本月作业完成情况'}</p></Col>

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
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  operationArr={copyData.operationList ? copyData.operationList : lastweekHomeworklist.rows}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  mainId={copyData.operationList ? true : mainId}
                />
              </Col>

              <Col span={24}><p style={{marginTop:20}}>{reporttype === 'week' ? '4.2本周工作票开具情况及服务器查询操作票情况统计' : '4.2本月工作票开具情况及服务器查询操作票情况统计'}</p></Col>

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

              <Col span={24}>{reporttype === 'week' ? '4.3下周作业完成情况' : '4.3下月作业完成情况'}</Col>

              {/* 下周工作计划 */}
              <Col span={24}>
                <NextweekHomework
                  forminladeLayout={forminladeLayout}
                  nextOperationArr={copyData.nextOperationList ? copyData.nextOperationList : nextweekHomeworklist.rows}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  nextOperationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  mainId={copyData.nextOperationList ? true : mainId}
                />
              </Col>

              <Col span={24} style={{marginTop:20}}>
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

              <Col span={24} style={{marginTop:20}}>
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

              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="primary"
                ghost
                onClick={() => newMember()}
                icon="plus"
              >
                新增其他内容
              </Button>

              {loading === false && addTitle && addTitle.length > 0 && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={index + 6}
                          addTable={newdata => {
                            handleaddTable(newdata);
                            // saveForm(newdata)
                          }}
                          dynamicData={addTitle[index]}
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
            </Form>
          </Row>

        )}

      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ softreport, loading }) => ({
    lastweekHomeworklist: softreport.lastweekHomeworklist,
    nextweekHomeworklist: softreport.nextweekHomeworklist,
    faultQueryList: softreport.faultQueryList,
    loading: loading.models.softreport,
  }))(ComputerroomReport),
);
