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
  Descriptions
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import Development from './components/Development';
import ThisweekMaintenance from './components/ThisweekMaintenance';
import ServiceCompletion from './components/ServiceCompletion';
import ServiceCompletionone from './components/ServiceCompletionone';
import ThisWeekitsm from './components/ThisWeekitsm';
import DefectTracking from './components/DefectTracking';
import LastweekHomework from './components/LastweekHomework';
import ServiceTableone from './components/ServiceTableone';
import EventTop from './components/EventTop';
import PatrolAndExamine from './components/PatrolAndExamine';
import UpgradeList from './components/UpgradeList';
import AddForm from './components/AddForm';
import Downloadfile from '@/components/SysUpload/Downloadfile';
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

const { MonthPicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let endTime;
function SoftReportdetail(props) {
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      reporttype,
      status,
      mainId,
      reportSearch,
    } },
    dispatch,
    serviceCompletionlist,
    serviceCompletionsecondlist,
    serviceCompletionthreelist,
    softCompletionlist,
    completionsecondTablelist,
    openReportlist,
    loading,
  } = props;


  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
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
  const { main } = openReportlist;

  const addcolumnsData = [
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
  ];

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
    }
  }, [mainId])

  // 上传删除附件触发保存
  useEffect(() => {
    defaultTime();
  }, []);

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
        console.log(1)
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlyreport',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
      if (reportSearch) {
        console.log(2)
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

  //  移除表格
  const removeForm = (tableIndex) => {
    addTitle.splice(tableIndex, 1);
    list.splice(tableIndex, 1);
    const resultArr = [];
    for (let i = 0; i < addTitle.length; i += 1) {
      resultArr.push(addTitle[i])
    }
    setAddTitle(resultArr)
  }

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
          {loading === false && (
            <Button type='primary' onClick={exportWord}>导出</Button>
          )}

          {
            loading === false && !reportSearch && (
              <Button type='primary' onClick={softReportform}>保存</Button>
            )
          }

          {loading === false && (
            <Button onClick={handleBack}>
              返回
            </Button>
          )}
        </>
      }
    >
      <Card style={{ padding: 24 }}>
        {loading === false && startTime && (
          <Row gutter={24}>
            <Form>
              <Col span={24}>
                <Form.Item
                  label={reporttype === 'week' ? '周报名称' : '月报名称'}
                  style={{ display: 'flex' }}
                >
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
                      <Input disabled={reportSearch} style={{ width: 500 }} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && (
                  <div>
                    <Col span={24}>
                      <Form.Item label='填报时间' style={{ display: 'inline-flex' }}>
                        {getFieldDecorator('time1', {
                          rules: [
                            {
                              required,
                              message: '请输入名称'
                            }
                          ],
                          initialValue: moment(main.time1)
                        })(
                          <DatePicker
                            allowClear={false}
                            style={{ marginRight: 10 }}
                            onChange={onChange}
                          />
                        )}
                      </Form.Item>

                      <Form.Item label='' style={{ display: 'inline-flex' }}>
                        {
                          getFieldDecorator('time2', {
                            initialValue: moment(main.time2)
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
                    <Form.Item label='填报日期' style={{ display: 'inline-flex' }}>
                      {getFieldDecorator('time1', {
                        rules: [
                          {
                            required,
                            message: '请选择填报日期'
                          }
                        ],
                        initialValue: moment(main.time1)
                      })(<MonthPicker
                        allowClear
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

              {
                openReportlist.contentRow && openReportlist.contentRow.length > 0 && (
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
                      contentArr={openReportlist.contentRow}
                      detailParams={reportSearch}
                    />
                  </Col>
                )
              }

              {
                openReportlist.contentRow && openReportlist.contentRow.length === 0 && (
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
                      contentArr={addcolumnsData}
                      detailParams={reportSearch}
                    />
                  </Col>
                )
              }

              {/* {reporttype === 'week' ? "本周运维" : "本月运维"} */}
              <Col span={24} style={{ marginTop: 15 }}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('content', {
                      initialValue: main ? main.content : ''
                    })
                      (
                        <TextArea
                          autoSize={{ minRows: 3 }}
                          disabled={reportSearch}
                        />)
                  }
                </Form.Item>
              </Col>

              {
                !reportSearch && (
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.contentFiles === '' ? '[]' : openReportlist.contentFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

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

              {/* 业务保障 */}
              <Col style={{ marginTop: 24 }} span={24}>
                <p>（二）重要时期业务保障</p>
              </Col>

              <Col span={24}>
                <Form.Item label=''>
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
                <Development
                  forminladeLayout={forminladeLayout}
                  materialsList={contentrowdata => {
                    setMaterialsList(contentrowdata)
                  }}
                  materials={openReportlist.materialsList ? openReportlist.materialsList : []}
                  detailParams={reportSearch}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }
              {/* 查询页的附件 */}
              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 10 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.materialsFiles === '' ? '[]' : openReportlist.materialsFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              {/* 三、运维服务指标完成情况 */}
              <Col span={24}>
                <ServiceTableone
                  forminladeLayout={forminladeLayout}
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

              {/* 运维统计 */}
              <Col span={24} style={{ marginTop: 15 }}>
                <Form.Item label=''>
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
                <ServiceCompletionone
                  forminladeLayout={forminladeLayout}
                  maintenanceService={openReportlist.statisList ? openReportlist.statisList : []}
                  startTime={startTime}
                  endTime={endTime}
                  tabActiveKey={reporttype}
                  statisList={contentrowdata => {
                    setStatisList(contentrowdata)
                  }}
                  mainId={mainId}
                />
              </Col>

              <Col span={24}>
                <ServiceCompletion
                  forminladeLayout={forminladeLayout}
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
                <p style={{ marginTop: '20px' }}>（二）软件运维服务指标完成情况</p>
              </Col>

              {/* 服务指标 */}
              <Col span={24}>
                <Form.Item label=''>
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
                  formincontentLayout={formincontentLayout}
                  startTime={startTime}
                  endTime={endTime}
                  topNList={contentrowdata => {
                    setTopNList(contentrowdata)
                  }}
                  topArr={openReportlist.topNList ? openReportlist.topNList : []}
                  mainId={mainId}
                  detailParams={reportSearch}
                  loading={loading}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.topNFiles === '' ? '[]' : openReportlist.topNFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }
              {/* 四、本周事件、问题及故障 */}
              <Col span={24}>
                <ThisWeekitsm
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  formincontentLayout={formincontentLayout}
                  type={reporttype}
                  eventList={contentrowdata => {
                    setEventList(contentrowdata)
                  }}
                  mainId={mainId}
                  eventArr={openReportlist.eventList ? openReportlist.eventList : []}
                  detailParams={reportSearch}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.eventFiles === '' ? '[]' : openReportlist.eventFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              {/* 五、软件作业完成情况 */}
              {/* 补丁升级 */}
              <Col span={20}>
                <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>五、软件作业完成情况</p>
              </Col>

              {/* 软件情况 */}
              <Col span={24}>
                <Form.Item
                  label=''
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
                <UpgradeList
                  forminladeLayout={forminladeLayout}
                  upgradeList={contentrowdata => {
                    setUpgradeList(contentrowdata)
                  }}
                  upgradeArr={openReportlist.upgradeList ? openReportlist.upgradeList : []}
                  detailParams={reportSearch}
                />
              </Col>

              {/* 变更 */}
              <Col span={24}>
                <UpgradeList
                  forminladeLayout={forminladeLayout}
                  upgradeList={contentrowdata => {
                    setUpdateList(contentrowdata)
                  }}
                  upgradeArr={openReportlist.updateList ? openReportlist.updateList : []}
                  detailParams={reportSearch}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.updateFiles === '' ? '[]' : openReportlist.updateFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              {/* 六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件） */}
              <Col span={24}>
                <DefectTracking
                  forminladeLayout={forminladeLayout}
                  startTime={startTime}
                  endTime={endTime}
                  legacyList={contentrowdata => {
                    setLegacyList(contentrowdata)
                  }}
                  legacyArr={openReportlist.legacyList ? openReportlist.legacyList : []}
                  detailParams={reportSearch}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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

                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.legacyFiles === '' ? '[]' : openReportlist.legacyFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }
              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '七、上周作业完成情况' : '七、上月作业完成情况'}</p>
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
                  loading={loading}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.operationFiles === '' ? '[]' : openReportlist.operationFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '八、下周作业计划' : '八、下月作业计划'}</p>
              </Col>

              {/* 八、 下周作业计划 */}
              <Col span={24}>
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  operationArr={openReportlist.nextOperationList ? openReportlist.nextOperationList : []}
                  mainId={mainId}
                  detailParams={reportSearch}
                  loading={loading}
                />
              </Col>

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.nextOperationFiles === '' ? '[]' : openReportlist.nextOperationFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

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
                disabled={reportSearch}
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
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
  }))(SoftReportdetail),
);
