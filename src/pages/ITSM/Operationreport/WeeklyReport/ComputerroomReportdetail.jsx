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
import ThisWeek from './components/ComputerroomComponent/ThisWeek';
import NextWeek from './components/ComputerroomComponent/NextWeek';
import LastweekHomework from '../WeeklyReport/components/LastweekHomework';
import NextweekHomework from '../WeeklyReport/components/NextweekHomework';
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
let monthStarttime;
let endTime;
function ComputerroomReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query: {
      type,
      reporttype,
      status,
      mainId,
      reportSearch
    } },
    dispatch,
    developmentList,
    submitdevelopmentlist,// 事件统计
    openReportlist,
    loading,
  } = props;
  let tabActiveKey = 'week';

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [secondbutton, setSecondbutton] = useState(false);
  const [addTitle, setAddTitle] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [fileslist, setFilesList] = useState([]);

  const [billingContent, setBillingContent] = useState([]); // 工作票情况
  const [materialsList, setMaterialsList] = useState([]) // 材料列表
  const [meetingSummaryList, setMeetingSummaryList] = useState([]) // 周例会会议纪要完成情况列表
  const [newTroubleList, setNewTroubleList] = useState([]) // 新故障列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [operationList, setOperationList] = useState([]) // 更新列表
  const [unCloseTroubleList, setUnCloseTroubleList] = useState([]) // 运维分类统计
  const [list, setList] = useState([]);
  const { main } = openReportlist;
  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          status,
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
        return dispatch({
          type: 'softreport/saveComputer',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            getopenFlow()
          }
        })
      }

    })
  }


  const defaultTime = () => {
    //  周
    if (type === 'week') {
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

  const handlemaintenanceArr = () => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    })
  }

  useEffect(() => {
    if (mainId) {
      getopenFlow()
    }
  }, [mainId])

  // 上传删除附件触发保存
  useEffect(() => {
    defaultTime();
  }, []);

  useEffect(() => {
    const { addData } = openReportlist;
    setAddTitle(addData)
  }, [loading])

  const handleBack = () => {
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }


  const onChange = (date, dateString) => {
    if (type === 'week') {
      startTime = dateString;
      endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
      setFieldsValue({ time2: moment(endTime) });
    } else {
      startTime = date.startOf('month').format('YYYY-MM-DD');
      console.log('startTime: ', startTime);
      endTime = date.endOf('month').format('YYYY-MM-DD');
      console.log('endTime: ', endTime);
    }
  }

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableIndex: [] });
    setAddTitle(nowNumber)
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

  const addTable = (index) => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    // nowNumber.push({ 'add': '1',tableIndexindex:[] });
    nowNumber[index].tableIndex.push({ columns: 'aa' });
    setAddTitle(nowNumber);
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
    // dispatch({
    //   type: 'chacklist/trackdelete',
    //   payload: {
    //     id: target.id,
    //   },
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.success(res.msg, 2);
    //     getlistdata();
    //   }
    // });
  };


  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '机房运维周报' : '机房运维月报'}
      extra={
        <>
          <Button type='primary'>导出</Button>

          {!reportSearch && (
            <Button type='primary' onClick={softReportform}>保存</Button>
          )}

          <Button type='primary' onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {loading === false && (
          <Row gutter={16}>
            <Form {...formItemLayout}>

              <Col span={8}>
                <Form.Item label={reporttype === 'week' ? '周报名称' : '月报名称'}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '请输入周报名称'
                      }
                    ],
                    initialValue: main ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && (
                  <Col span={8}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: [moment(startTime), moment(endTime)]
                      })(<RangePicker
                        allowClear={false}
                        disabled={reportSearch}
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {
                reporttype === 'month' && (
                  <Col span={8}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(startTime)
                      })(<MonthPicker
                        allowClear={false}
                        disabled={reportSearch}
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }
              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>1 本周运维总结</p></Col>
              {/* 本周运维总结 */}
              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '本周运维总结' : '本月运维总结'} {...formincontentLayout}>
                  {
                    getFieldDecorator('content', {
                      initialValue: main.content
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
              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('contentFiles', {
                    initialValue: openReportlist.contentFiles ? openReportlist.contentFiles : ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.contentFiles ? JSON.parse(openReportlist.contentFiles) : []}
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

              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>2 巡检汇总</p></Col>

              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '(1)本周巡检汇总' : '(2)本月巡检汇总'} {...formincontentLayout}>
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
                  // remainingDefectslist={remainingDefectslist}
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

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('materialsFiles', {
                    initialValue: openReportlist.materialsFiles ? openReportlist.materialsFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.materialsFiles ? JSON.parse(openReportlist.materialsFiles) : []}
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
                  type={type}
                  startTime={startTime}
                  endTime={endTime}
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

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('troubleFiles', {
                    initialValue: openReportlist.troubleFiles ? openReportlist.troubleFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.troubleFiles ? JSON.parse(openReportlist.troubleFiles) : []}
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
                <Form.Item label={reporttype === 'week' ? '本周作业完成情况' : '本月作业完成情况'} {...formincontentLayout}>
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
                  operationArr={openReportlist.operationList ? openReportlist.operationList : lastweekHomeworklist.rows}
                  mainId={mainId}
                  detailParams={reportSearch}
                />
              </Col>


              <Col span={24}><p>{reporttype === 'week' ? '4.2本周工作票开具情况及服务器查询操作票情况统计' : '4.2本月工作票开具情况及服务器查询操作票情况统计'}</p></Col>

              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '本周统计情况' : '本月统计情况'} {...formincontentLayout}>
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

              <Col span={24}>{reporttype === 'week' ? '4.3下周作业完成情况' : '4.3下月作业完成情况'}</Col>

              {/* 下周工作计划 */}
              <Col span={24}>
                <NextweekHomework
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  nextOperationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  nextOperationArr={openReportlist.nextOperationList ? openReportlist.nextOperationList : nextweekHomeworklist.rows}
                  mainId={mainId}
                  detailParams={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('nextOperationFiles', {
                    initialValue: openReportlist.nextOperationFiles ? openReportlist.nextOperationFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.nextOperationFiles ? JSON.parse(openReportlist.nextOperationFiles) : []}
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



              {/* 5 周例会会议纪要完成情况 */}
              <Col span={24}>
                <WeeklyMeeting
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={type}
                  meetingSummaryList={contentrowdata => {
                    setMeetingSummaryList(contentrowdata)
                  }}
                  meetingSummaryarr={openReportlist.meetingSummaryList ? openReportlist.meetingSummaryList : []}
                  reportSearch={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('meetingSummaryFiles', {
                    initialValue: openReportlist.meetingSummaryFiles ? openReportlist.meetingSummaryFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.meetingSummaryFiles ? JSON.parse(openReportlist.meetingSummaryFiles) : []}
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
                          list={addData => {
                            setList(addData)
                          }}
                        />
                      </Col>

                      {!reportSearch && (
                        <Col span={1}>
                          <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => removeForm(index)}
                          />
                        </Col>
                      )}


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
                disabled={reportSearch}
              >
                新增内容
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
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
  }))(ComputerroomReportdetail),
);
