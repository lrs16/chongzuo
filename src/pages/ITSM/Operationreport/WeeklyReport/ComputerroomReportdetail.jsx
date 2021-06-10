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
  Divider
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
function ComputerroomReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query: { type, reporttype, status, mainId } },
    dispatch,
    developmentList,
    submitdevelopmentlist,
    // remainingDefectslist,
    lastweekHomeworklist,
    nextweekHomeworklist,
    maintenanceArr, // 事件统计
    loading,
  } = props;
  let tabActiveKey = 'week';

  const required = true;
  const saveformRef = useRef();
  const developmentformRef = useRef();
  const thisWeekitsmRef = useRef();
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [tableIndex, setTableIndex] = useState('1');
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

  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const savedata = {
          ...value,
          status,
          editStatus: mainId ? 'edit' : 'add',
          // addData: JSON.stringify(list),
          type: '软件运维周报',
          reporttype,
          mainId,
          time1: startTime,
          time2: endTime,
          billingContent: JSON.stringify(billingContent),
          materialsList: JSON.stringify(materialsList),
          meetingSummaryList: JSON.stringify(meetingSummaryList),
          newTroubleList: JSON.stringify(newTroubleList),
          nextOperationList: JSON.stringify(nextOperationList),
          operationList: JSON.stringify(operationList),
          unCloseTroubleList: JSON.stringify(unCloseTroubleList),
        }
        dispatch({
          type: 'softreport/saveSoft',
          payload: savedata
        })
      }

    })
  }

  //  本周运维情况综述表格数据
  const maintenanceTable = () => {
    dispatch({
      type: 'thisweekly/fetchMaintance'
    })
  }

  //  常规运维工作开展情况第一个表格
  const developmentTable = () => {
    dispatch({
      type: 'thisweekly/developmentListdata'
    })
  }
  //  常规运维工作开展情况第二个表格
  const submitdevelopmentData = () => {
    dispatch({
      type: 'thisweekly/submitdevelopmentData'
    })
  }
  //  三、运维服务指标完成情况---第一个表格
  const serviceCompletionfirst = () => {
    dispatch({
      type: 'thisweekly/serviceCompletionone'
    })
  }
  //  三、运维服务指标完成情况---第二个表格
  const serviceCompletiontwo = () => {
    dispatch({
      type: 'thisweekly/serviceCompletiontwo'
    })
  }
  //  三、运维服务指标完成情况---第三个表格
  const serviceCompletionthree = () => {
    dispatch({
      type: 'thisweekly/serviceCompletionthree'
    })
  }
  //  四、本周事件、问题及故障表格数据
  const thisWeekitsm = () => {
    dispatch({
      type: 'thisweekly/thisWeekitsm'
    })
  }
  //  五、软件作业完成情况第一个表格
  const completionfirstlyTable = () => {
    dispatch({
      type: 'thisweekly/completionfirstlyTable'
    })
  }
  //  五、软件作业完成情况第二个表格
  const completionsecondTable = () => {
    dispatch({
      type: 'thisweekly/completionsecondTable'
    })
  }
  //   六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件）
  const remainingDefects = () => {
    dispatch({
      type: 'thisweekly/remainingDefects'
    })
  }

  //   七、上周作业完成情况--表格
  const lastweekHomework = () => {
    dispatch({
      type: 'thisweekly/lastweekHomework'
    })
  }
  //   七、下周作业完成情况--表格
  const nextweekHomework = () => {
    dispatch({
      type: 'thisweekly/nextweekHomework'
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

  const searchNumber = (value) => {
    console.log('value: ', value);

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

  // 上传删除附件触发特定表单保存
  useEffect(() => {
    switch (tableIndex) {
      case '1':
        break;

      default:
        break;
    }
  }, [tableIndex]);

  // 上传删除附件触发保存
  useEffect(() => {
    maintenanceTable();
    developmentTable();
    submitdevelopmentData();
    serviceCompletionfirst();
    serviceCompletiontwo();
    serviceCompletionthree();
    thisWeekitsm();
    completionfirstlyTable();
    completionsecondTable();
    remainingDefects();
    lastweekHomework();
    nextweekHomework();
    defaultTime();
  }, []);

  const handleBack = () => {
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }

  //  保存第一表格的数据
  const handleSavethisweek = (saveParams) => {
    console.log('saveParams: ', saveParams);
  }

  //  保存第二表格

  const handleSavedevelopment = (saveParams, rowId, params) => {
    console.log('params: ', params);
    // console.log('saveParams: ', saveParams);
    // console.log('rowId: ', rowId);
    // console.log('params: ', params);
  }

  // 删除数据
  const handleDelete = (deleteId) => {
    console.log('deleteId: ', deleteId);

  }

  const onChange = () => {
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

  const addTable = (index) => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    // nowNumber.push({ 'add': '1',tableIndexindex:[] });
    nowNumber[index].tableIndex.push({ columns: 'aa' });
    setAddTitle(nowNumber);
  }

  // 新增一条记录
  const handleAddrows = (params) => {
    setFilesList([]);
    // setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      addTime1: '新增数据',
      addTime2: '',
      addTime3: 'dd',
      addTime4: '',
      isNew: true
    });
    setData(newData);
    // setNewButton(true);
  };



  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
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

  // 编辑记录
  const toggleEditable = (e, key, record) => {

    e.preventDefault();
    const newData = data.map(item => ({ ...item })
    );
    const target = getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      target.isNew = true;
      setData(newData);
    }
  }

  //  点击编辑生成filelist
  const handlefileedit = (key, values) => {
    if (!values) {
      setFilesList([]);
    } else {
      setFilesList(JSON.parse(values))
    }
  }

  const savedata = (target, id) => {
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};

    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false;
      setNewButton(false);
    }
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    const newarr = remainingDefectslist.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }


  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '机房运维周报' : '机房运维月报'}
      extra={
        <>
          <Button type='primary'>导出</Button>
          <Button type='primary' onClick={softReportform}>保存</Button>
          <Button type='primary' onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {loading === false && startTime && (
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
                    ]
                  })
                    (
                      <Input />
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
                  <Col span={8}>
                    <Form.Item label='起始时间'>
                      {getFieldDecorator('time1', {
                        initialValue: moment(startTime)
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
              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>1 本周运维总结</p></Col>
              {/* 本周运维总结 */}
              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '本周运维总结' : '本月运维总结'} {...formincontentLayout}>
                  {
                    getFieldDecorator('content', {
                      initialValue: ''
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
                  {getFieldDecorator('contentFiles', {})
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

              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>2 巡检汇总</p></Col>

              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '1.本周运维总结' : '2.本月运维总结'} {...formincontentLayout}>
                  {
                    getFieldDecorator('patrolAndExamineContent', {
                      initialValue: ''
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
                  // remainingDefectslist={remainingDefectslist}
                  maintenanceArr={maintenanceArr.data}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={tabActiveKey}
                  materialsList={contentrowdata => {
                    setNewTroubleList(contentrowdata)
                  }}
                // upgradeArr={detail.upgradeList ? detail.upgradeList : []}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('materialsFiles', {
                      initialValue:'[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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
                  developmentList={developmentList}
                  submitdevelopmentlist={submitdevelopmentlist}
                  handleSavedevelopment={(newValue, editId, params) => handleSavedevelopment(newValue, editId, params)}
                  handleDelete={(deleteId => handleDelete(deleteId))}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue)
                  }}
                  type={type}
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
                  developmentList={developmentList}
                  submitdevelopmentlist={submitdevelopmentlist}
                  ref={developmentformRef}
                  handleSavedevelopment={(newValue, editId, params) => handleSavedevelopment(newValue, editId, params)}
                  handleDelete={(deleteId => handleDelete(deleteId))}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue)
                  }}
                  type={type}
                  startTime={startTime}
                  endTime={endTime}
                  unCloseTroubleList={contentrowdata => {
                    setUnCloseTroubleList(contentrowdata)
                  }}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('troubleFiles', {
                    initialValue: '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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
                    getFieldDecorator('content3', {
                      initialValue: '[]'
                    })
                      (<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>


              {/* 4.本周作业完成情况 */}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  lastweekHomeworklist={lastweekHomeworklist}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  // operationArr={detail.operationList ? detail.operationList : []}
                  mainId={mainId}
                />
              </Col>


              <Col span={24}><p>{reporttype === 'week' ? '4.2本周工作票开具情况及服务器查询操作票情况统计' : '4.2本月工作票开具情况及服务器查询操作票情况统计'}</p></Col>

              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? '本周统计情况' : '本月统计情况'} {...formincontentLayout}>
                  {
                    getFieldDecorator('operationContent', {})
                      (<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>{reporttype === 'week' ? '4.3下周作业完成情况' : '4.3下月作业完成情况'}</Col>

              {/* 下周工作计划 */}
              <Col span={24}>
                <NextweekHomework
                  forminladeLayout={forminladeLayout}
                  nextweekHomeworklist={nextweekHomeworklist}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  nextOperationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  // nextOperationArr={detail.nextOperationList ? detail.nextOperationList : []}
                  mainId={mainId}
                />
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
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('meetingSummaryFiles ', {
                    initialValue: '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
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
                disabled={secondbutton}
              >
                新增
            </Button>


              {loading === false && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      {
                        (addTitle[index].tableIndex).map(items => {
                          return (
                            <Table
                              columns={columns}
                              dataSource={data}
                            />
                          )
                        })
                      }
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
  connect(({ thisweekly, eventstatistics, loading }) => ({
    maintenanceList: thisweekly.maintenanceList,
    developmentList: thisweekly.developmentList,
    submitdevelopmentlist: thisweekly.submitdevelopmentlist,
    serviceCompletionlist: thisweekly.serviceCompletionlist,
    serviceCompletionsecondlist: thisweekly.serviceCompletionsecondlist,
    serviceCompletionthreelist: thisweekly.serviceCompletionthreelist,
    thisWeekitsmlist: thisweekly.thisWeekitsmlist,
    softCompletionlist: thisweekly.softCompletionlist,
    completionsecondTablelist: thisweekly.completionsecondTablelist,
    // remainingDefectslist: thisweekly.remainingDefectslist,
    lastweekHomeworklist: thisweekly.lastweekHomeworklist,
    nextweekHomeworklist: thisweekly.nextweekHomeworklist,
    loading: loading.models.thisweekly,
    maintenanceArr: eventstatistics.maintenanceArr,
  }))(ComputerroomReport),
);
