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
    location: { query: { reporttype, status, mainId } },
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
    // openReportlist,
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
  const [detail, setDetail] = useState({});
  const { main } = detail;

  const titleNumber = (index) => {
    return `标题${9 + index}`
  }

  //  保存表单
  const softReportform = (params) => {
    props.form.validateFields((err, value) => {
      const savedata = {
        ...value,
        status,
        editStatus: mainId ? 'edit' : 'add',
        addData: JSON.stringify(list),
        type: '软件运维周报',
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
      // if (mainId) {
        return dispatch({
          type: 'softreport/saveSoft',
          payload: savedata
        }).then(res => {
          if (res.code === 200) {
            message.info(res.msg)
            props.history.go(0);
           
          }
        })
      // }

      // if (!mainId) {
      //   dispatch({
      //     type: 'softreport/saveSoft',
      //     payload: savedata
      //   })
      // }
    })
  }

  const uploadSave = () => {
    props.form.validateFields((err, value) => {
      const savedata = {
        ...value,
        status,
        editStatus: mainId ? 'edit' : 'add',
        addData: '',
        type: '软件运维周报',
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
      return dispatch({
        type: 'softreport/uploadSave',
        payload: savedata
      }).then(res => {
        if (res.code === 200) {
          props.history.go(0);
        }
      })
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
      uploadSave();
    }
  }, [files]);


  const getMainid = () => {
    dispatch({
      type: 'softreport/fetchaddReport'
    })
  }

  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    }).then(res => {
      if (res.code === 200) {
        setAddTitle(res.addData)
        setDetail(res);
      }
    })
  }

  useEffect(() => {
    getMainid();
    if (mainId) {
      getopenFlow()
    }
  }, [mainId])


  // 上传删除附件触发保存
  useEffect(() => {
    lastweekHomework();
    nextweekHomework();
    defaultTime();
  }, []);

  const handleBack = () => {
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }


  // 删除数据
  const handleDelete = (deleteId) => {
    console.log('deleteId: ', deleteId);

  }

  const onChange = (date, dateString) => {
    if (type === 'week') {
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


  // const addTable = (index) => {
  //   const nowNumber = addTitle.map(item => ({ ...item }));
  //   nowNumber[index].tableNumber.push({ columns: 'aa' });
  //   setAddTitle(nowNumber);
  // }

  // 新增一条记录
  const handleaddTable = (params) => {
    const newData = (list).map(item => ({ ...item }));
    newData.push({
      ...params
    });
    setList(newData)
    setButtonVisible(false);
  };


  const remove = (index) => {
    addTitle.splice(index, 1);
    const resultArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    setAddTitle(resultArr)
  }


  const removeTable = (index, tableIndexs) => {
    addTitle.map(item => ({ ...item }));
    (addTitle[index].tableNumber).splice(tableIndexs, 1)
    const resultTable = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultTable.push(addTitle[i])
    }
    setAddTitle(resultTable)
  }



  // console.log(list)




  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '软件运维周报' : '软件运维月报'}
      extra={
        <>
          <Button type='primary'>导出</Button>

          {
            loading === false && (
              <Button type='primary' onClick={softReportform}>保存</Button>
            )
          }

          <Button type='primary'>粘贴</Button>
          <Button onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        {loading === false && startTime && (detail && detail.code === 200) && (
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
                      <Input />
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
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
                        initialValue: moment(startTime)
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
                <ThisweekMaintenance
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ChangeFiles={(newvalue) => {
                    setFiles(newvalue);
                  }}
                  maintenanceArr={detail.contentRow ? detail.contentRow : []}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  contentRow={contentrowdata => {
                    setContentRow(contentrowdata)
                  }}
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
                    initialValue: detail.contentFiles ? detail.contentFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.contentFiles ? JSON.parse(detail.contentFiles) : []}
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
                  patrolAndExamine={detail.patrolAndExamineList ? detail.patrolAndExamineList : []}
                />
              </Col>

              <Col span={24}>
                <Development
                  forminladeLayout={forminladeLayout}
                  materialsList={contentrowdata => {
                    setMaterialsList(contentrowdata)
                  }}
                  materials={detail.materialsList ? detail.materialsList : []}
                />
              </Col>

              <Col span={24}>
                <Form.Item label='重要时期业务保障' {...formincontentLayout}>
                  {
                    getFieldDecorator('security', {
                      initialValue: detail.security ? detail.security : ''
                    })(<TextArea autoSize={{ minRows: 3 }} />)
                  }
                </Form.Item>
              </Col>



              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('materialsFiles', {
                    initialValue: detail.materialsFiles ? detail.materialsFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.materialsFiles ? JSON.parse(detail.materialsFiles) : []}
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
                />
              </Col>



              <Col span={24}>
                <Form.Item label='运维统计描述' {...formincontentLayout}>
                  {
                    getFieldDecorator('typeContent', {
                      initialValue: detail.typeContent ? detail.typeContent : ''
                    })(<TextArea autoSize={{ minRows: 3 }} />)
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
                  tabActiveKey={reporttype}
                  statisList={contentrowdata => {
                    setStatisList(contentrowdata)
                  }}
                  selfhandleRow={contentrowdata => {
                    setSelfhandleRow(contentrowdata)
                  }}
                />
              </Col>

              <Col span={24}>
                <p style={{ marginTop: '20px' }}>（二）重要时期业务保障</p>
              </Col>

              <Col span={24}>
                <Form.Item label='运维服务指标完成情况' {...formincontentLayout}>
                  {
                    getFieldDecorator('selfhandleContent', {
                      initialValue: detail.selfhandleContent ? detail.selfhandleContent : ''
                    })
                      (<TextArea autoSize={{ minRows: 3 }} />)
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
                  topArr={detail.topNList ? detail.topNList : []}
                  mainId={mainId}
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
                    initialValue: detail.topNFiles ? detail.topNFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.topNFiles ? JSON.parse(detail.topNFiles) : []}
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
                  eventArr={detail.eventList ? detail.eventList : []}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('eventFiles', {
                    initialValue: detail.eventFiles ? detail.eventFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.eventFiles ? JSON.parse(detail.eventFiles) : []}
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
                  upgradeArr={detail.upgradeList ? detail.upgradeList : []}
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
                  updateArr={detail.updateList ? detail.updateList : []}
                />
              </Col>


              <Col span={24}>
                <Form.Item
                  label='软件作业情况描述'
                  {...formincontentLayout}
                >
                  {
                    getFieldDecorator('completeContent', {
                      initialValue: detail.completeContent ? detail.completeContent : ''
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
                  {getFieldDecorator('updateFiles', {
                    initialValue: detail.updateFiles ? detail.updateFiles : ''
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.materialsFiles ? JSON.parse(detail.materialsFiles) : []}
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
                <RemainingDefects
                  forminladeLayout={forminladeLayout}
                  remainingDefectslist={remainingDefectslist}
                  legacyList={contentrowdata => {
                    setLegacyList(contentrowdata)
                  }}
                  legacyArr={detail.legacyList ? detail.legacyList : []}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('legacyFiles', {
                    initialValue: detail.legacyFiles ? detail.legacyFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.legacyFiles ? JSON.parse(detail.legacyFiles) : []}
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
                  lastweekHomeworklist={lastweekHomeworklist}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setOperationList(contentrowdata)
                  }}
                  operationArr={detail.operationList ? detail.operationList : []}
                  mainId={mainId}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('operationFiles', {
                    initialValue: detail.operationFiles ? detail.operationFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.operationFiles ? JSON.parse(detail.operationFiles) : []}
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
                  nextweekHomeworklist={nextweekHomeworklist}
                  startTime={startTime}
                  endTime={endTime}
                  type={reporttype}
                  nextOperationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  nextOperationArr={detail.nextOperationList ? detail.nextOperationList : []}
                  mainId={mainId}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('nextOperationFiles', {
                    initialValue: detail.nextOperationFiles ? detail.nextOperationFiles : '[]'
                  })
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={detail.nextOperationFiles ? JSON.parse(detail.nextOperationFiles) : []}
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

              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="primary"
                ghost
                onClick={() => newMember()}
                icon="plus"
                disabled={buttonVisible}
              >
                新增
            </Button>

              {loading === false && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={24}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={index + 9}
                          addTable={newdata => {
                            handleaddTable(newdata)
                          }}
                          dynamicData={addTitle[index]}
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
  connect(({ thisweekly, eventstatistics, softreport, loading }) => ({
    serviceCompletionlist: thisweekly.serviceCompletionlist,
    serviceCompletionsecondlist: thisweekly.serviceCompletionsecondlist,
    serviceCompletionthreelist: thisweekly.serviceCompletionthreelist,
    thisWeekitsmlist: thisweekly.thisWeekitsmlist,
    softCompletionlist: thisweekly.softCompletionlist,
    completionsecondTablelist: thisweekly.completionsecondTablelist,
    remainingDefectslist: thisweekly.remainingDefectslist,
    lastweekHomeworklist: thisweekly.lastweekHomeworklist,
    nextweekHomeworklist: thisweekly.nextweekHomeworklist,
    loading: loading.models.softreport,
    maintenanceArr: eventstatistics.maintenanceArr,
  }))(SoftReportdetail),
);
