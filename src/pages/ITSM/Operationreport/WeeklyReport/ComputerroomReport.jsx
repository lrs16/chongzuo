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
import Development from './components/Development';
import ThisweekMaintenance from './components/ThisweekMaintenance';
import ServiceCompletion from './components/ServiceCompletion';
import ThisWeekitsm from './components/ThisWeekitsm';
import SoftCompletion from './components/SoftCompletion';
import RemainingDefects from './components/RemainingDefects';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
import ServiceTableone from './components/ServiceTableone';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import InspectionSummary from './components/ComputerroomComponent/InspectionSummary';
import RepairStatistics from './components/ComputerroomComponent/RepairStatistics';
import ThisWeek from './components/ComputerroomComponent/ThisWeek';
import NextWeek from './components/ComputerroomComponent/NextWeek';
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

const { RangePicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let monthStarttime;
let endTime;
function ComputerroomReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    dispatch,
    maintenanceList,
    developmentList,
    submitdevelopmentlist,
    serviceCompletionlist,
    serviceCompletionsecondlist,
    serviceCompletionthreelist,
    thisWeekitsmlist,
    softCompletionlist,
    completionsecondTablelist,
    remainingDefectslist,
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



  useEffect(() => {
    setColumns(initiacColumn)
  }, [])
  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      console.log('value: ', value);
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
    //  周统计
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
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

  useEffect(() => {
    // handlemaintenanceArr();
  }, [])

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
    validateFields((err, value) => {
      startTime = moment(value.time1[0]).format('YYYY-MM-DD');
      endTime = moment(value.time1[1]).format('YYYY-MM-DD');
    })
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


  const initiacColumn = [
    {
      title: '测试表头1',
      dataIndex: 'addTime1',
      key: 'addTime1',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime1', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '测试表头2',
      dataIndex: 'addTime2',
      key: 'addTime2',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime2', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '测试表头3',
      dataIndex: 'addTime3',
      key: 'addTime3',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime3', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '测试表头4',
      dataIndex: 'addTime4',
      key: 'addTime4',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime4', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        // if (record.editable) {
        if (record.isNew === true) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type='vertical' />
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
        // }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record);
                // handlefileedit(record.key, record.attachment)
              }}
            >编辑</a>
            <Divider type='vertical' />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ]




  return (
    <PageHeaderWrapper
      title={pagetitle}
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
                <Form.Item label='周报名称'>
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

              <Col span={24}>
                <Form.Item label="本周运维总结" {...formincontentLayout}>
                  {
                    getFieldDecorator('content1', {})
                      (<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>


              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('field1', {})
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ field1: JSON.stringify(newvalue.arr) })
                            setFilesList(newvalue);
                            setFiles(newvalue)
                          }}
                        />
                      </div>
                    )}
                </Form.Item>
              </Col>

              {/* 2 巡检汇总 */}
              <Col span={24}>
                <InspectionSummary
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={saveformRef}
                  remainingDefectslist={remainingDefectslist}
                  maintenanceArr={maintenanceArr.data}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={tabActiveKey}
                />
              </Col>

              <Col span={24}>
                <Form.Item label='常规运维工作描述' {...formincontentLayout}>
                  {
                    getFieldDecorator('content2', {})
                    (<TextArea autoSize={{ minRows: 3 }}/>)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('field2', {})
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ field2: JSON.stringify(newvalue.arr) })
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
                <RepairStatistics
                  forminladeLayout={forminladeLayout}
                  developmentList={developmentList}
                  submitdevelopmentlist={submitdevelopmentlist}
                  ref={developmentformRef}
                  handleSavedevelopment={(newValue, editId, params) => handleSavedevelopment(newValue, editId, params)}
                  handleDelete={(deleteId => handleDelete(deleteId))}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue)
                  }}
                  getTableindex={index => setTableIndex(index)}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('field3', {})
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ field3: JSON.stringify(newvalue.arr) })
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

              <Col span={24}><p>4.1本周作业完成情况</p></Col>

              <Col span={24}>
                <Form.Item label='本周作业完成情况' {...formincontentLayout}>
                  {
                    getFieldDecorator('content3', {})
                    (<TextArea autoSize={{ minRows: 3 }}/>)
                  }
                </Form.Item>
              </Col>


              {/* 4.本周作业完成情况 */}
              <Col span={24}>
                <ThisWeek
                  forminladeLayout={forminladeLayout}
                  lastweekHomeworklist={lastweekHomeworklist}
                />
              </Col>

              
              <Col span={24}><p>4.2本周工作票开具情况及服务器查询操作票情况统计</p></Col>

              <Col span={24}>
                <Form.Item label='本周统计情况' {...formincontentLayout}>
                  {
                    getFieldDecorator('content3', {})
                    (<TextArea autoSize={{ minRows: 3 }}/>)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>4.3下周作业完成情况</Col>


              {/* 下周工作计划 */}
               <Col span={24}>
                <NextWeek
                  forminladeLayout={forminladeLayout}
                  lastweekHomeworklist={lastweekHomeworklist}
                />
              </Col>

             

              {/* 5 周例会会议纪要完成情况 */}
              <Col span={24}>
                <WeeklyMeeting
                  forminladeLayout={forminladeLayout}
                  remainingDefectslist={remainingDefectslist}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={tabActiveKey}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('field4', {})
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ field4: JSON.stringify(newvalue.arr) })
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
                      <Col span={24}>
                        <Form.Item label='标题' {...formincontentLayout}>
                          {getFieldDecorator(`title${index}`, {
                          })(
                            <Input />
                          )}
                        </Form.Item>
                      </Col>


                      <Col span={24}>
                        <Form.Item label='内容' {...formincontentLayout}>
                          {getFieldDecorator(`content${index}`, {

                          })(
                            <TextArea />
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item label='上传附件'    {...formincontentLayout}>
                          {getFieldDecorator(`field${index}`, {

                          })(
                            <SysUpload
                              fileslist={[]}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ field1: JSON.stringify(newvalue.arr) })
                                // setFilesList(newvalue)
                              }}
                            />
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Button onClick={() => addTable(index)}>添加表格</Button>
                      </Col>

                      <Button onClick={() => handleAddrows(index)}>添加行</Button>
                      <Button>添加列</Button>

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
    remainingDefectslist: thisweekly.remainingDefectslist,
    lastweekHomeworklist: thisweekly.lastweekHomeworklist,
    nextweekHomeworklist: thisweekly.nextweekHomeworklist,
    loading: loading.models.thisweekly,
    maintenanceArr: eventstatistics.maintenanceArr,
  }))(ComputerroomReport),
);
