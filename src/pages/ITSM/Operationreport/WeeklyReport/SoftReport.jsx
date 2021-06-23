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
import Development from './components/Development';
import ThisweekMaintenance from './components/ThisweekMaintenance';
import ServiceCompletion from './components/ServiceCompletion';
import ThisWeekitsm from './components/ThisWeekitsm';
// import SoftCompletion from './components/SoftCompletion';
import RemainingDefects from './components/RemainingDefects';
import DefectTracking from './components/DefectTracking';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
import ServiceTableone from './components/ServiceTableone';
import EventTop from './components/EventTop';
import PatrolAndExamine from './components/PatrolAndExamine';
import UpgradeList from './components/UpgradeList';
import UpdateList from './components/UpdateList';
import ServiceCompletionone from './components/ServiceCompletionone';
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
    sm: { span: 2 },
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
let value = 5;
function SoftReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query:
      {
        reporttype,
        mainId,
        listreportType,
        listId,
        detailParams,
      } },
    dispatch,
    serviceCompletionthreelist,
    thisWeekitsmlist,
    softCompletionlist,
    completionsecondTablelist,
    remainingDefectslist,
    ordertopnArr,
    lastweekHomeworklist,
    nextweekHomeworklist,
    maintenanceService,
    soluteArr,
    maintenanceArr, // 事件统计
    loading,
  } = props;

  const required = true;
  const thisWeekitsmRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [secondbutton, setSecondbutton] = useState(false);
  const [addTitle, setAddTitle] = useState([]);
  const [contentRow, setContentRow] = useState([]); // 本周运维情况综述列表 
  const [patrolAndExamineList, setPatrolAndExamine] = useState([]) // 软件运维巡检
  const [materialsList, setMaterialsList] = useState([]) // 运维材料提交情况
  const [eventList, setEventList] = useState([]) // 软件运维巡检
  const [upgradeList, setUpgradeList] = useState([]) // 补丁升级列表
  const [updateList, setUpdateList] = useState([]) // 更新列表
  const [legacyList, setLegacyList] = useState([]) // 更新列表
  const [operationList, setOperationList] = useState([]) // 上周作业计划
  const [selfhandleRow, setSelfhandleRow] = useState([]) // 运维分类统计
  const [statisList, setStatisList] = useState([]) // 运维分类统计
  const [topNList, setTopNList] = useState([]) // TOPN列表
  const [typeList, setTypeList] = useState([]) // TOPN列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [list, setList] = useState([]);
  const [buttonVisible, setButtonVisible] = useState(false)
  // const [value, setValue] = useState('5')
  const [copyData, setCopyData] = useState('');

  const lastSolute = [soluteArr[soluteArr.length - 1]];

  const addData = [
    {
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
      field7: '',
      field8: ''
    }
  ]
  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const savedata = {
          ...values,
          status: 'add',
          editStatus: mainId ? 'edit' : 'add',
          addData: JSON.stringify(list),
          type: reporttype === 'week' ? '软件运维周报' : '软件运维月报',
          reporttype,
          mainId,
          time1: startTime,
          time2: endTime,
          // contentRow: contentRow.length?JSON.stringify(contentRow):detail?.contentRow?detail.contentRow:'[]',
          contentRow: JSON.stringify(contentRow),
          patrolAndExamineList: JSON.stringify(patrolAndExamineList),
          materialsList: JSON.stringify(materialsList),
          eventList: JSON.stringify(eventList),
          upgradeList: JSON.stringify(upgradeList),
          updateList: JSON.stringify(updateList),
          legacyList: JSON.stringify(legacyList),
          operationList: JSON.stringify(operationList),
          nextOperationList: JSON.stringify(nextOperationList),
          statisList: JSON.stringify(statisList),
          topNList: JSON.stringify(topNList),
          typeList: JSON.stringify(typeList),
          selfhandleRow: JSON.stringify(selfhandleRow),
        }
        dispatch({
          type: 'softreport/saveSoft',
          payload: savedata
        })
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

  const defaultTime = () => {
    //  周统计
    if (reporttype === 'week') {
      startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else {
      startTime = moment().startOf('month').format('YYYY-MM-DD');
      endTime = moment().endOf('month').format('YYYY-MM-DD');
    }
  }

  const searchNumber = (value) => {
    console.log('value: ', value);
  }

  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);



  const handleBack = () => {
    router.push({
      pathname: `/ITSM/operationreport/weeklyreport/myweeklyreport`,
      query: { mainId, closetab: true },
      state: { cache: false }
    }
    )
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
    nowNumber.push({ 'add': '1', tableNumber: [] });
    setAddTitle(nowNumber);
    setButtonVisible(true)
  }


  const handlemaintenanserviceceArr = () => {
    const tabActiveKey = reporttype;
    dispatch({
      type: 'softreport/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  const handleListdata = (params) => {
    // validateFields((err, values) => {
    dispatch({
      type: 'softreport/fetchordertopnList',
      payload: { value, startTime, endTime }
    })
    // })
  }

  const handlesoftservice = () => {
    const tabActiveKey = reporttype;
    dispatch({
      type: 'softreport/fetcheventServiceList',
      payload: { tabActiveKey, startTime, endTime }
    })

    dispatch({
      type: 'softreport/fetchSelfHandleList',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  const handlePaste = () => {
    if (!listreportType || !listId) {
      message.info('请在列表选择一条数据复制哦')
      return false;
    }

    if (reporttype === 'week') {
      if (listreportType !== '软件运维周报') {
        message.info('只能粘贴同种周报类型哦');
        return false;
      }
    }

    if (reporttype === 'month') {
      if (listreportType !== '软件运维月报') {
        message.info('只能粘贴同种月报类型哦');
        return false;
      }
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

  useEffect(() => {
    lastweekHomework();
    nextweekHomework();
    defaultTime();
    handlemaintenanserviceceArr();
    handleListdata();
    handlesoftservice()
  }, []);

  console.log(copyData.operationList ? 'aa' : 'bb')

  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '新建软件运维周报' : '新建软件运维月报'}
      extra={
        <>
          {
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

        </>
      }
    >
      <Card style={{ paddingLeft: 24 }}>
        {loading === false && startTime && (
          <Row gutter={24}>
            <Form>
              <Col span={24} style={{ textAlign: 'left' }}>
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
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
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
                  <Col span={8}>
                    <Form.Item label='起始时间'>
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
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '一、本周运维情况综述' : '一、本月运维情况综述'}</p>
              </Col>

              <Col span={24}>
                <ThisweekMaintenance
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue);
                  }}
                  mainId={copyData.contentRow ? true : mainId}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  contentRow={contentrowdata => {
                    setContentRow(contentrowdata)
                  }}
                  contentArr={copyData.contentRow ? copyData.contentRow : addData}
                />
              </Col>

              {/* </Col> */}
              {/* {reporttype === 'week' ? "本周运维" : "本月运维"} */}
              <Col span={24} style={{ marginTop: 15 }}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('content', {
                      initialValue: ''
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


              {/* 二、常规运维工作开展情况 */}
              <Col span={24}>
                <PatrolAndExamine
                  forminladeLayout={forminladeLayout}
                  patrolAndExamineList={contentrowdata => {
                    setPatrolAndExamine(contentrowdata)
                  }}
                  patrolAndExamine={copyData.patrolAndExamineList ? copyData.patrolAndExamineList : []}
                />
              </Col>

              {/* 业务保障 */}
              <Col style={{ marginTop: 24 }} span={24}>
                <p>（二）重要时期业务保障</p>
              </Col>

              <Col span={24} style={{ marginTop: 15 }}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('security', {
                      initialValue: ''
                    })(<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <Development
                  forminladeLayout={forminladeLayout}
                  materialsList={contentrowdata => {
                    setMaterialsList(contentrowdata)
                  }}
                  materials={copyData.materialsList ? copyData.materialsList : []}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('materialsFiles', {
                    initialValue: ''
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

              {/* 三、运维服务指标完成情况 */}
              {/* 运维分类统计情况列表 */}
              <Col span={24}>
                <ServiceTableone
                  forminladeLayout={forminladeLayout}
                  // maintenanceArr={copyData.typeList?copyData.typeList:maintenanceArr.data}
                  maintenanceArr={maintenanceArr.data}
                  startTime={startTime}
                  endTime={endTime}
                  typeList={contentrowdata => {
                    setTypeList(contentrowdata)
                  }}
                  typeArr={[]}
                  // mainId={copyData.typeList?copyData.typeList:mainId}
                  mainId={mainId}
                />
              </Col>

              {/* 运维统计 */}
              <Col span={24} style={{ marginTop: 15 }}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('typeContent', {
                      initialValue: ''
                    })(<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>

              {/* 软件运维付服务指标完成情况 */}
              {/* 一线问题解决情况汇总统计 */}
              <Col span={24}>
                <ServiceCompletionone
                  forminladeLayout={forminladeLayout}
                  maintenanceService={maintenanceService}
                  soluteArr={copyData.statisList ? copyData.statisList : [soluteArr[soluteArr.length - 1]]}
                  serviceCompletionthreelist={serviceCompletionthreelist}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={reporttype}
                  statisList={contentrowdata => {
                    setStatisList(contentrowdata)
                  }}
                />
              </Col>

              <Col span={24}>
                <ServiceCompletion
                  forminladeLayout={forminladeLayout}
                  soluteArr={lastSolute}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={reporttype}
                  // statisList={contentrowdata => {
                  //   setStatisList(contentrowdata)
                  // }}
                  selfhandleRow={contentrowdata => {
                    setSelfhandleRow(contentrowdata)
                  }}
                />
              </Col>

              <Col span={24}>
                <p style={{ marginTop: '20px' }}>（二）软件运维服务指标完成情况</p>
              </Col>

              {/* 服务指标 */}
              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('selfhandleContent', {
                      initialValue: ''
                    })
                      (<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <EventTop
                  formItemLayout={formItemLayout}
                  formincontentLayout={formincontentLayout}
                  startTime={startTime}
                  endTime={endTime}
                  topNList={contentrowdata => {
                    setTopNList(contentrowdata)
                  }}
                  // topArr={[]}
                  topArr={copyData.topNList ? copyData.topNList : ordertopnArr}
                  mainId={copyData.topNList ? true : ''}
                  defaultValue={value}
                  value={data => {
                    value = data;
                    handleListdata(data)
                  }}
                  loading={loading}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('topNFiles', {
                    initialValue: ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ topNFiles: JSON.stringify(newvalue.arr) })
                            setFilesList(newvalue);
                            setFiles(newvalue)
                          }}
                        />
                      </div>
                    )}
                </Form.Item>
              </Col>

              {/* 四、本周事件、问题及故障 */}
              <Col span={24}>
                <ThisWeekitsm
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  formincontentLayout={formincontentLayout}
                  thisWeekitsmlist={thisWeekitsmlist}
                  ref={thisWeekitsmRef}
                  searchNumber={(searchParams) => searchNumber(searchParams)}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue);
                  }}
                  reportType={reporttype}
                  eventList={contentrowdata => {
                    setEventList(contentrowdata)
                  }}
                  mainId={copyData.eventList ? true : ''}
                  eventArr={copyData.eventList ? copyData.eventList : []}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('eventFiles', {
                    initialValue: ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ eventFiles: JSON.stringify(newvalue.arr) })
                            setFilesList(newvalue);
                            setFiles(newvalue)
                          }}
                        />
                      </div>
                    )}
                </Form.Item>
              </Col>

              {/* 五、软件作业完成情况 */}
              {/* 补丁升级 */}
              <Col span={20}>
                <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>五、软件作业完成情况</p>
              </Col>

              {/* 软件情况 */}
              <Col span={24} style={{ marginTop: 15 }}>
                <Form.Item
                  label=''
                  {...formincontentLayout}
                >
                  {
                    getFieldDecorator('completeContent', {
                      initialValue: ''
                    })
                      (<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <UpgradeList
                  forminladeLayout={forminladeLayout}
                  softCompletionlist={softCompletionlist}
                  completionsecondTablelist={completionsecondTablelist}
                  startTime={startTime}
                  endTime={endTime}
                  upgradeList={contentrowdata => {
                    setUpgradeList(contentrowdata)
                  }}
                  upgradeArr={copyData.upgradeList ? copyData.upgradeList : []}
                />
              </Col>

              {/* 变更 */}
              <Col span={24}>
                <UpdateList
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  updateList={contentrowdata => {
                    setUpdateList(contentrowdata)
                  }}
                  updateArr={copyData.updateList ? copyData.updateList : []}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('updateFiles', {
                    initialValue: ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ updateFiles: JSON.stringify(newvalue.arr) })
                            setFilesList(newvalue);
                            setFiles(newvalue)
                          }}
                        />
                      </div>
                    )}

                </Form.Item>
              </Col>


              {/* 六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件） */}
              <Col span={24}>
                <DefectTracking
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  legacyList={contentrowdata => {
                    setLegacyList(contentrowdata)
                  }}
                  legacyArr={copyData.legacyList ? copyData.legacyList : []}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('legacyFiles', {
                    initialValue: ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ legacyFiles: JSON.stringify(newvalue.arr) })
                            setFilesList(newvalue);
                            setFiles(newvalue)
                          }}
                        />
                      </div>
                    )}
                </Form.Item>
              </Col>

              {/* 七、上周作业完成情况 */}
              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '七、上周作业完成情况' : '七、上月作业完成情况'}</p>
              </Col>

              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  operationArr={copyData.operationList ? copyData.operationList : lastweekHomeworklist.rows}
                  // mainId={copyData.operationList?true:''}
                  loading={loading}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('operationFiles', {
                    initialValue: ''
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

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '八、下周作业计划' : '八、下月作业计划'}</p>
              </Col>

              {/* 八、 下周作业计划 */}

              <Col span={24}>
                <NextweekHomework
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  nextOperationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  nextOperationArr={copyData.nextOperationList ? copyData.nextOperationList : nextweekHomeworklist.rows}
                  // mainId={copyData.nextOperationList?true:''}
                  loading={loading}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('nextOperationFiles', {
                    initialValue: ''
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
                          px={index + 9}
                          addTable={newdata => {
                            handleaddTable(newdata)
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
  }))(SoftReport),
);
