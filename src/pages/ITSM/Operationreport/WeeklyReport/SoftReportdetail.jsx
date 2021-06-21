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
  message,
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
import WorkOrderTop from './components/WorkOrderTop';
import Developmentone from './components/Developmentone';
import EventTop from './components/EventTop';
import PatrolAndExamine from './components/PatrolAndExamine';
import UpgradeList from './components/UpgradeList';
import UpdateList from './components/UpdateList';
import AddForm from './components/AddForm';
import styles from './index.less';
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
function SoftReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    location: { query: {
      type,
      reporttype,
      status,
      mainId,
      reportSearch,
    } },
    dispatch,
    serviceCompletionlist,
    serviceCompletionsecondlist,
    serviceCompletionthreelist,
    thisWeekitsmlist,
    softCompletionlist,
    completionsecondTablelist,
    remainingDefectslist,
    lastweekHomeworklist,
    nextweekHomeworklist,
    openReportlist,
    maintenanceArr, // 事件统计
    loading,
  } = props;


  const required = true;
  const thisWeekitsmRef = useRef();
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
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
  // const [detail, setDetail] = useState({});
  const { main } = openReportlist;

  const titleNumber = (index) => {
    return `标题${9 + index}`
  }

  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      const savedata = {
        ...value,
        status,
        editStatus: mainId ? 'edit' : 'add',
        addData: list.length === 0 ? '' : JSON.stringify(list),
        type: reporttype === 'week' ? '软件运维周报' : '软件运维月报',
        reporttype,
        mainId,
        time1: startTime,
        time2: endTime,
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
      // if (mainId) {
      return dispatch({
        type: 'softreport/saveSoft',
        payload: savedata
      }).then(res => {
        if (res.code === 200) {
          message.info(res.msg)
          getopenFlow();
          // props.history.go(0);

        }
      })
      // }

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
      getopenFlow();
      // setAddTitle(addData)
    }
  }, [mainId])


  // 上传删除附件触发保存
  useEffect(() => {
    defaultTime();
  }, []);

  const handleBack = () => {
    if (reporttype === 'week') {
      router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
    } else {
      router.push('/ITSM/operationreport/monthlyreport/mymonthlyreport');
    }

  }

  // const handleListdata = () => {
  //   validateFields((err, values) => {
  //     dispatch({
  //       type: 'eventstatistics/fetchordertopnList',
  //       payload: { value, startTime, endTime }
  //     })
  //   })
  // }

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

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableNumber: [] });
    setAddTitle(nowNumber);
    setButtonVisible(true)
  }

  // 新增一条记录
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData)
  };


  const saveForm = (params) => {
    if (params.files) {
      console.log('params.files: ', params.files);
      softReportform()
    }
  }


  //  移除表格
  const removeForm = (tableIndex) => {
    addTitle.splice(tableIndex, 1);
    list.splice(tableIndex, 1);
    const resultArr = [];
    const listArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    // for (let i = 0; i < list.length; i++) {
    //   listArr.push(list[i])
    // }
    setAddTitle(resultArr)
    // setList(listArr)
  }

  console.log(list, 'list')


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

  useEffect(() => {
    const { addData } = openReportlist;
    setAddTitle(addData);
    setList(addData)
  }, [loading])

  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '软件运维周报详情页' : '软件运维月报详情页'}
      extra={
        <>
          <Button type='primary' onClick={exportWord}>导出</Button>

          {
            !reportSearch && (
              <Button type='primary' onClick={softReportform}>保存</Button>
            )
          }

          <Button onClick={handleBack}>
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
                        message: '请输入名称'
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
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
                        initialValue: main ? [moment(main.time1), moment(main.time2)] : [moment(startTime), moment(endTime)]
                      })(<RangePicker
                        disabled={reportSearch}
                        allowClear={false}
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
                        initialValue: moment(startTime)
                      })(<MonthPicker
                        allowClear
                        disabled={reportSearch}
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
                <ThisweekMaintenance
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  mainId={mainId}
                  contentRow={contentrowdata => {
                    setContentRow(contentrowdata)
                  }}
                  contentArr={openReportlist.contentRow ? openReportlist.contentRow : []}
                  detailParams={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Form.Item label={reporttype === 'week' ? "本周运维描述" : "本月运维描述"} {...formincontentLayout}>
                  {
                    getFieldDecorator('content', {
                      initialValue: main ? main.content : ''
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
                    initialValue: openReportlist.contentFiles ? openReportlist.contentFiles : '[]'
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


              {/* 二、常规运维工作开展情况 */}
              <Col span={24}>
                <PatrolAndExamine
                  forminladeLayout={forminladeLayout}
                  patrolAndExamineList={contentrowdata => {
                    setPatrolAndExamine(contentrowdata)
                  }}
                  patrolAndExamine={openReportlist.patrolAndExamineList ? openReportlist.patrolAndExamineList : []}
                  detailParams={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Development
                  forminladeLayout={forminladeLayout}
                  materialsList={contentrowdata => {
                    setMaterialsList(contentrowdata)
                  }}
                  materials={openReportlist.materialsList ? openReportlist.materialsList : []}
                  detailParams={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Form.Item label='重要时期业务保障' {...formincontentLayout}>
                  {
                    getFieldDecorator('security', {
                      initialValue: openReportlist.security ? openReportlist.security : ''
                    })(
                      <TextArea
                        autoSize={{ minRows: 3 }}
                        disabled={reportSearch}
                      />)
                  }
                </Form.Item>
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

              {/* 三、运维服务指标完成情况 */}
              <Col span={24}>
                <ServiceTableone
                  forminladeLayout={forminladeLayout}
                  serviceCompletionlist={serviceCompletionlist}
                  serviceCompletionsecondlist={serviceCompletionsecondlist}
                  serviceCompletionthreelist={serviceCompletionthreelist}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={reporttype}
                  typeList={contentrowdata => {
                    setTypeList(contentrowdata)
                  }}
                  maintenanceArr={openReportlist.typeList ? openReportlist.typeList : []}
                  mainId={mainId}
                  detailParams={reportSearch}

                />
              </Col>



              <Col span={24}>
                <Form.Item label='运维统计描述' {...formincontentLayout}>
                  {
                    getFieldDecorator('typeContent', {
                      initialValue: openReportlist.typeContent ? openReportlist.typeContent : ''
                    })(
                      <TextArea
                        autoSize={{ minRows: 3 }}
                        disabled={reportSearch}
                      />)
                  }
                </Form.Item>
              </Col>

              {/* 软件运维付服务指标完成情况 */}
              <Col span={24}>
                <ServiceCompletion
                  forminladeLayout={forminladeLayout}
                  serviceCompletionlist={serviceCompletionlist}
                  serviceCompletionsecondlist={serviceCompletionsecondlist}
                  serviceCompletionthreelist={serviceCompletionthreelist}
                  startTime={startTime}
                  endTime={endTime}
                  mainId={mainId}
                  tabActiveKey={reporttype}
                  selfhandleRow={contentrowdata => {
                    setSelfhandleRow(contentrowdata)
                  }}
                  soluteArr={openReportlist.selfhandleRow ? openReportlist.selfhandleRow : []}
                  detailParams={reportSearch}
                />
              </Col>

              <Col span={24}>
                <p style={{ marginTop: '20px' }}>（二）重要时期业务保障</p>
              </Col>

              <Col span={24}>
                <Form.Item label='运维服务指标完成情况' {...formincontentLayout}>
                  {
                    getFieldDecorator('selfhandleContent', {
                      initialValue: openReportlist.selfhandleContent ? openReportlist.selfhandleContent : ''
                    })
                      (
                        <TextArea
                          autoSize={{ minRows: 3 }}
                          disabled={reportSearch}
                        />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <EventTop
                  formItemLayout={formItemLayout}
                  startTime={startTime}
                  endTime={endTime}
                  topNList={contentrowdata => {
                    setTopNList(contentrowdata)
                  }}
                  topArr={openReportlist.topNList ? openReportlist.topNList : []}
                  mainId={mainId}
                  detailParams={reportSearch}
                />
              </Col>

              {/* <Col span={24}>
                <WorkOrderTop
                  formItemLayout={formItemLayout}
                  startTime={startTime}
                  endTime={endTime}
                  topNList={contentrowdata => {
                    setTopNList(contentrowdata)
                  }}
                />
              </Col> */}


              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('topNFiles', {
                    initialValue: openReportlist.topNFiles ? openReportlist.topNFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.topNFiles ? JSON.parse(openReportlist.topNFiles) : []}
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
                  thisWeekitsmlist={thisWeekitsmlist}
                  ref={thisWeekitsmRef}
                  searchNumber={(searchParams) => searchNumber(searchParams)}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue);
                  }}
                  type={reporttype}
                  eventList={contentrowdata => {
                    setEventList(contentrowdata)
                  }}
                  mainId={mainId}
                  eventArr={openReportlist.eventList ? openReportlist.eventList : []}
                  detailParams={reportSearch}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('eventFiles', {
                    initialValue: openReportlist.eventFiles ? openReportlist.eventFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.eventFiles ? JSON.parse(openReportlist.eventFiles) : []}
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

              <Col span={24}>
                <RemainingDefects
                  forminladeLayout={forminladeLayout}
                  softCompletionlist={softCompletionlist}
                  completionsecondTablelist={completionsecondTablelist}
                  startTime={startTime}
                  endTime={endTime}
                  legacyList={contentrowdata => {
                    setLegacyList(contentrowdata)
                  }}
                  legacyArr={openReportlist.legacyList ? openReportlist.legacyList : []}
                  detailParams={reportSearch}
                />
              </Col>



              {/* 五、软件作业完成情况 */}
              {/* 补丁升级 */}
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
                  upgradeArr={openReportlist.upgradeList ? openReportlist.upgradeList : []}
                  detailParams={reportSearch}
                />
              </Col>

              {/* 变更 */}
              <Col span={24}>
                <UpdateList
                  forminladeLayout={forminladeLayout}
                  softCompletionlist={softCompletionlist}
                  completionsecondTablelist={completionsecondTablelist}
                  startTime={startTime}
                  endTime={endTime}
                  updateList={contentrowdata => {
                    setUpdateList(contentrowdata)
                  }}
                  updateArr={openReportlist.updateList ? openReportlist.updateList : []}
                  detailParams={reportSearch}
                />
              </Col>


              <Col span={24}>
                <Form.Item
                  label='软件作业情况描述'
                  {...formincontentLayout}
                >
                  {
                    getFieldDecorator('completeContent', {
                      initialValue: openReportlist.completeContent ? openReportlist.completeContent : ''
                    })
                      (
                        <TextArea
                          autoSize={{ minRows: 3 }}
                          disabled={reportSearch}
                        />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('updateFiles', {
                    initialValue: openReportlist.updateFiles ? openReportlist.updateFiles : ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.materialsFiles ? JSON.parse(openReportlist.materialsFiles) : []}
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
                  softCompletionlist={softCompletionlist}
                  completionsecondTablelist={completionsecondTablelist}
                  startTime={startTime}
                  endTime={endTime}
                  legacyList={contentrowdata => {
                    setLegacyList(contentrowdata)
                  }}
                  legacyArr={openReportlist.legacyList ? openReportlist.legacyList : []}
                  detailParams={reportSearch}
                />
              </Col>


              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('legacyFiles', {
                    initialValue: openReportlist.legacyFiles ? openReportlist.legacyFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.legacyFiles ? JSON.parse(openReportlist.legacyFiles) : []}
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
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('operationFiles', {
                    initialValue: openReportlist.operationFiles ? openReportlist.operationFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={openReportlist.operationFiles ? JSON.parse(openReportlist.operationFiles) : []}
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
                  nextOperationArr={openReportlist.nextOperationList ? openReportlist.nextOperationList : []}
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

              {loading === false && addTitle && addTitle.length > 0 && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          detailParams={reportSearch}
                          formincontentLayout={formincontentLayout}
                          px={index + 9}
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
                disabled={reportSearch}
              >
                新增
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
  }))(SoftReportdetail),
);
