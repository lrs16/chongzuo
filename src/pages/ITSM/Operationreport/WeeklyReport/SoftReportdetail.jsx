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
  Descriptions,
  Spin
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import Downloadfile from '@/components/SysUpload/Downloadfile';
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

let saveSign = true;
let showTimecomponent = false;
let newtime = ''
let newtime2 = ''

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
    location,
    openReportlist,
    loading,
    olduploadstatus
  } = props;


  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // ????????????
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // ????????????
  const [contentRow, setContentRow] = useState([]); // ?????????????????????????????? 
  const [patrolAndExamineList, setPatrolAndExamine] = useState([]) // ??????????????????
  const [materialsList, setMaterialsList] = useState([]) // ????????????????????????
  const [eventList, setEventList] = useState([]) // ??????????????????
  const [upgradeList, setUpgradeList] = useState([]) // ??????????????????
  const [updateList, setUpdateList] = useState([]) // ????????????
  const [legacyList, setLegacyList] = useState([]) // ????????????
  const [operationList, setOperationList] = useState([]) // ??????????????????
  const [selfhandleRow, setSelfhandleRow] = useState([]) // ??????????????????
  const [statisList, setStatisList] = useState([]) // ??????????????????
  const [topNList, setTopNList] = useState([]) // TOPN??????
  const [typeList, setTypeList] = useState([]) // TOPN??????
  const [nextOperationList, setNextOperationList] = useState([]) // ??????????????????
  const [list, setList] = useState([]);

  const [newbutton, setNewButton] = useState(false);
  const [addrow, setAddrow] = useState(false);
  const [deleteSign, setDeleteSign] = useState(false);

  const [timeshow, setTimeshow] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { main } = openReportlist;

  useEffect(() => {
    if (loading === false && saveSign) {
      const { addData } = openReportlist;
      setList(addData);


    }

    const contentArr = openReportlist.contentRow;
    const patrolAndExamineArr = openReportlist.patrolAndExamineList;
    const materialsArr = openReportlist.materialsList;
    const eventArr = openReportlist.eventList;
    const upgradeArr = openReportlist.upgradeList;
    const legacyArr = openReportlist.legacyList;
    const operationArr = openReportlist.operationList;
    const selfhandleArr = openReportlist.selfhandleRow;
    const statisArr = openReportlist.statisList;
    const topNArr = openReportlist.topNList;
    const typeArr = openReportlist.typeList;
    const nextOperationArr = openReportlist.nextOperationList;


    setContentRow(contentArr);
    setPatrolAndExamine(patrolAndExamineArr);
    setMaterialsList(materialsArr);
    setEventList(eventArr);
    setUpgradeList(upgradeArr);
    setLegacyList(legacyArr);
    setOperationList(operationArr);
    setSelfhandleRow(selfhandleArr);
    setStatisList(statisArr);
    setTopNList(topNArr);
    setTypeList(typeArr);
    setNextOperationList(nextOperationArr);

    if (openReportlist && main) {
      const saveInitlatime1 = openReportlist.main.time1;
      const saveInitlatime2 = openReportlist.main.time2;
      newtime = saveInitlatime1;
      newtime2 = saveInitlatime2;
    }


  }, [loading])
  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    })
  }
  //  ????????????
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      const savedata = {
        ...value,
        status,
        editStatus: mainId ? 'edit' : 'add',
        addData: list.length === 0 ? '' : JSON.stringify(list),
        type: reporttype === 'week' ? '??????????????????' : '??????????????????',
        reporttype,
        mainId,
        time1: reporttype === 'week' ? moment(startTime).format('YYYY-MM-DD') : moment(startTime).startOf('month').format('YYYY-MM-DD'),
        time2: reporttype === 'week' ? moment(endTime).format('YYYY-MM-DD') : moment(endTime).endOf('month').format('YYYY-MM-DD'),
        contentRow: JSON.stringify(contentRow || []),
        patrolAndExamineList: JSON.stringify(patrolAndExamineList || []),
        materialsList: JSON.stringify(materialsList || []),
        eventList: JSON.stringify(eventList || []),
        upgradeList: JSON.stringify(upgradeList || []),
        updateList: JSON.stringify(updateList || []),
        legacyList: JSON.stringify(legacyList || []),
        operationList: JSON.stringify(operationList || []),
        nextOperationList: JSON.stringify(nextOperationList || []),
        statisList: JSON.stringify(statisList || []),
        topNList: JSON.stringify(topNList || []),
        typeList: JSON.stringify(typeList || []),
        selfhandleRow: JSON.stringify(selfhandleRow || []),
      }
      // if (mainId) {
      return dispatch({
        type: 'softreport/saveSoft',
        payload: savedata
      }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          getopenFlow();
          saveSign = true;
        } else {
          message.info('????????????')
        }
      })
    })
  }

  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);

  useEffect(() => {
    newtime = ''
    if (mainId && newtime === '') {
      getopenFlow()
    }
  }, [mainId])

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
      newtime = dateString;
      newtime2 = currentendTime
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
    newtime = currendstartTime;
    newtime2 = dateString
    setFieldsValue({ time1: moment(startTime) })
  }

  const newMember = () => {
    const nowNumber = list.map(item => ({ ...item }));
    const newarr = nowNumber.map((item, index) => {
      return Object.assign(item, { px: (index + 9).toString() })
    });
    const addObj = {
      files: '',
      content: '',
      title: '',
      list: '',
      px: (nowNumber.length + 9).toString()
    }

    newarr.push(addObj);
    setList(newarr);
    setNewButton(true);
    setDeleteSign(false);
  }

  // ????????????
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

  //  ????????????
  const removeForm = (tableIndex) => {
    list.splice(tableIndex, 1);
    const resultArr = list.map((item, index) => {
      const newItem = item;
      newItem.px = (index + 9).toString();
      return newItem;
    })
    setList(resultArr);
  }

  const exportWord = () => {
    dispatch({
      type: 'softreport/exportWord',
      payload: { mainId }
    }).then(res => {
      const fieldName = '??????.doc';
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
    saveSign = true;
  }, [])

  useEffect(() => {
    if (showTimecomponent === false) {
      showTimecomponent = true;
    }
  }, [showTimecomponent])

  useEffect(() => {
    if (newtime && loading === false) {
      setStartTime(newtime)
      setEndTime(newtime2)
      setTimeshow(true);
    }
  }, [timeshow, loading])


  useEffect(() => {
    newtime = ''
    if (location.state && location.state.reset && mainId && newtime === '') {
      getopenFlow()
    }
    setTimeshow(false);
  }, [location.state])

  const dateFormat = 'YYYY-MM-DD';

  return (
    <PageHeaderWrapper
      title={reporttype === 'week' ? '???????????????????????????' : '???????????????????????????'}
      extra={
        <>
          {loading === false && (
            <Button
              type='primary'
              onClick={exportWord}
              disabled={olduploadstatus}
            >
              ??????
            </Button>
          )}

          {
            loading === false && !reportSearch && main && main.time1 && nextOperationList !== undefined && (
              <Button
                type='primary'
                onClick={() => { saveSign = false; softReportform() }}
                disabled={olduploadstatus}
              >
                ??????
              </Button>
            )
          }

          {loading === false && (
            <Button onClick={handleBack} disabled={olduploadstatus}>
              ??????
            </Button>
          )}
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
        {loading === false && main && main.time1 && nextOperationList !== undefined && (
          <Row gutter={24}>
            <Form>
              <Col span={24}>
                <Form.Item
                  label={reporttype === 'week' ? '????????????' : '????????????'}
                  style={{ display: 'flex' }}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '???????????????'
                      }
                    ],
                    initialValue: main ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} style={{ width: 500 }} placeholder={`????????????XXXX??????????????????${reporttype === 'week' ? '???' : '???'}???`} />
                    )}
                </Form.Item>
              </Col>

              {
                reporttype === 'week' && startTime && (
                  <Col span={24}>
                    <div>
                      <span style={{ marginLeft: 10 }}>???????????? :</span>
                      {
                        timeshow && (
                          <span
                            style={{ marginRight: 10, marginLeft: 10 }}
                          >
                            <DatePicker
                              allowClear={false}
                              format={dateFormat}
                              defaultValue={moment(startTime)}
                              onChange={onChange}
                              disabled={reportSearch}
                            />
                          </span>
                        )
                      }

                      <span
                        style={{ marginRight: 10 }}
                      >-</span>

                      {
                        timeshow && (
                          <span>
                            <DatePicker
                              allowClear={false}
                              format={dateFormat}
                              defaultValue={moment(endTime)}
                              onChange={endonChange}
                              disabled={reportSearch}
                            />
                          </span>

                        )
                      }

                    </div>
                  </Col>

                )
              }

              {
                reporttype === 'month' && (
                  <Col span={24}>
                    <Form.Item label='????????????' style={{ display: 'inline-flex' }}>
                      {getFieldDecorator('time1', {
                        rules: [
                          {
                            required,
                            message: '?????????????????????'
                          }
                        ],
                        initialValue: main ? moment(main.time1) : ''
                      })(<MonthPicker
                        allowClear={false}
                        onChange={onChange}
                      />)}
                    </Form.Item>
                  </Col>
                )
              }

              {/* ?????????????????????????????? */}
              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '??????????????????????????????' : '??????????????????????????????'}</p>
              </Col>

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

              {/* {reporttype === 'week' ? "????????????" : "????????????"} */}
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('contentFiles', {
                        initialValue: openReportlist.contentFiles ? openReportlist.contentFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.contentFiles ? JSON.parse(openReportlist.contentFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ contentFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.contentFiles === '' ? '[]' : openReportlist.contentFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              {/* ???????????????????????????????????? */}
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

              {/* ???????????? */}
              <Col style={{ marginTop: 24 }} span={24}>
                <p>?????????????????????????????????</p>
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('materialsFiles', {
                        initialValue: openReportlist.materialsFiles ? openReportlist.materialsFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.materialsFiles ? JSON.parse(openReportlist.materialsFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ materialsFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
                            />
                          </div>
                        )}

                    </Form.Item>
                  </Col>
                )
              }
              {/* ?????????????????? */}
              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 10 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.materialsFiles === '' ? '[]' : openReportlist.materialsFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              {/* ???????????????????????????????????? */}
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

              {/* ???????????? */}
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

              {/* ??????????????????????????????????????? */}
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
                  detailParams={reportSearch}
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

              {/* ???????????? */}
              <Col span={24} style={{ marginTop: 24 }}>
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('topNFiles', {
                        initialValue: openReportlist.topNFiles ? openReportlist.topNFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.topNFiles ? JSON.parse(openReportlist.topNFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ topNFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.topNFiles === '' ? '[]' : openReportlist.topNFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }
              {/* ???????????????????????????????????? */}
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('eventFiles', {
                        initialValue: openReportlist.eventFiles ? openReportlist.eventFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.eventFiles ? JSON.parse(openReportlist.eventFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ eventFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.eventFiles === '' ? '[]' : openReportlist.eventFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              {/* ?????????????????????????????? */}
              {/* ???????????? */}
              <Col span={20}>
                <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>??????????????????????????????</p>
              </Col>

              {/* ???????????? */}
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

              {
                reporttype === 'week' && (
                  <Col span={24}>
                    <p>(1)?????????????????????????????????????????????</p>
                  </Col>
                )
              }

              {
                reporttype === 'month' && (
                  <Col span={24}>
                    <p>(1)?????????????????????????????????????????????</p>
                  </Col>
                )
              }

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

              <Col span={24}>
                <p>(2)??????{main ? main.time1 : ''}???{main ? main.time2 : ''},XXXX???????????? ????????????????????????????????????????????????</p>
              </Col>

              {/* ?????? */}
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('updateFiles', {
                        initialValue: openReportlist.updateFiles ? openReportlist.updateFiles : ''
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.updateFiles ? JSON.parse(openReportlist.updateFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ updateFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.updateFiles === '' ? '[]' : openReportlist.updateFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }

              {/* ??????????????????????????????,????????????????????????????????????????????????????????????????????? */}
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('legacyFiles', {
                        initialValue: openReportlist.legacyFiles ? openReportlist.legacyFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.legacyFiles ? JSON.parse(openReportlist.legacyFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ legacyFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.legacyFiles === '' ? '[]' : openReportlist.legacyFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }
              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '??????????????????????????????' : '??????????????????????????????'}</p>
              </Col>

              {/* ?????????????????????????????? */}
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('operationFiles', {
                        initialValue: openReportlist.operationFiles ? openReportlist.operationFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.operationFiles ? JSON.parse(openReportlist.operationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ operationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.operationFiles === '' ? '[]' : openReportlist.operationFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              <Col span={24}>
                <p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '????????????????????????' : '????????????????????????'}</p>
              </Col>

              {/* ?????? ?????????????????? */}
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
                      label='????????????'
                      {...formincontentLayout}
                    >
                      {getFieldDecorator('nextOperationFiles', {
                        initialValue: openReportlist.nextOperationFiles ? openReportlist.nextOperationFiles : '[]'
                      })
                        (
                          <div>
                            <SysUpload
                              fileslist={openReportlist.nextOperationFiles ? JSON.parse(openReportlist.nextOperationFiles) : []}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ nextOperationFiles: JSON.stringify(newvalue.arr) })
                                setFilesList(newvalue);
                                setFiles(newvalue)
                              }}
                              banOpenFileDialog={olduploadstatus}
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
                      <Descriptions.Item label='????????????'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.nextOperationFiles === '' ? '[]' : openReportlist.nextOperationFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>
                )
              }

              {(loading === false && list && list.length > 0) && (
                list.map((item, index) => {
                  return (
                    <>
                      <Col span={23}>
                        <AddForm
                          formincontentLayout={formincontentLayout}
                          px={(index + 9).toString()}
                          addTable={(newdata, addpx, rowdelete) => {
                            handleaddTable(newdata, addpx, rowdelete)
                          }}
                          index={index}
                          dynamicData={list.length ? list[index] : {}}
                          // dynamicData={undefined}
                          loading={loading}
                          ChangeAddRow={v => setAddrow(v)}
                          sign={deleteSign}
                          detailParams={reportSearch}
                          uploadStatus={olduploadstatus || olduploadstatus}
                        />
                      </Col>

                      {
                        !reportSearch && (
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
                disabled={olduploadstatus || reportSearch}
              >
                ??????????????????
              </Button>
            </Form>
          </Row>
        )}
      </Card>
    </PageHeaderWrapper>

  )
}


export default Form.create({})(
  connect(({ softreport, viewcache, loading }) => ({
    openReportlist: softreport.openReportlist,
    loading: loading.models.softreport,
    olduploadstatus: viewcache.olduploadstatus,
  }))(SoftReportdetail),
);
