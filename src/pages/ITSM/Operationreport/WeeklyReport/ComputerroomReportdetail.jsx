import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Descriptions,
  Icon,
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';
import InspectionSummary from './components/ComputerroomComponent/InspectionSummary';
import NewTroublelist from './components/ComputerroomComponent/NewTroublelist';
import UnCloseTroublelist from './components/ComputerroomComponent/UnCloseTroublelist';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import LastweekHomework from './components/LastweekHomework';
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

const {  MonthPicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let endTime;
function ComputerroomReportdetail(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    location: { query: {
      type,
      reporttype,
      status,
      mainId,
      reportSearch
    } },
    dispatch,
    openReportlist,
    loading,
  } = props;
  const tabActiveKey = 'week';

  const required = true;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [addTitle, setAddTitle] = useState([]);
  const [fileslist, setFilesList] = useState([]);

  const [materialsList, setMaterialsList] = useState([]) // 材料列表
  const [meetingSummaryList, setMeetingSummaryList] = useState([]) // 周例会会议纪要完成情况列表
  const [newTroubleList, setNewTroubleList] = useState([]) // 新故障列表
  const [nextOperationList, setNextOperationList] = useState([]) // 下周作业列表
  const [operationList, setOperationList] = useState([]) // 更新列表
  const [unCloseTroubleList, setUnCloseTroubleList] = useState([]) // 运维分类统计
  const [list, setList] = useState([]);
  const { main } = openReportlist;

  const getopenFlow = () => {
    dispatch({
      type: 'softreport/openReport',
      payload: {
        editStatus: 'edit',
        id: mainId
      }
    })
  }

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
    setAddTitle(addData);
    setList(addData)
  }, [loading])

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
      console.log(1)
      if (!reportSearch) {
        console.log(2)
        router.push({
          pathname: '/ITSM/operationreport/monthlyreport/mymonthlyreport',
          query: { pathpush: true },
          state: { cache: false }
        })
      }
      if (reportSearch) {
        console.log(3)
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
    for (let i = 0; i < addTitle.length; i += 1) {
      resultArr.push(addTitle[i])
    }
    for (let i = 0; i < list.length; i += 1) {
      listArr.push(list[i])
    }
    setAddTitle(resultArr)
    setList(listArr)
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

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          {loading === false && (
            <Button type='primary' onClick={exportWord}>导出</Button>
          )}

          {!reportSearch && (
            <Button type='primary' onClick={softReportform}>保存</Button>
          )}

          <Button onClick={handleBack}>
            返回
          </Button>
        </>
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
                    initialValue: main ? main.name : ''
                  })
                    (
                      <Input disabled={reportSearch} style={{ width: 700 }} />
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
                                message: '请输入填报时间'
                              }
                            ],
                          initialValue: main?moment(main.time1):''
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

              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>{reporttype === 'week' ? '一、本周运维总结' : '一、本月运维总结'}</p></Col>
              {/* 本周运维总结 */}
              <Col span={24}>
                <Form.Item label=''>
                  {
                    getFieldDecorator('content', {
                      initialValue: main ? main.content : ''
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
              {
                !reportSearch && (
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
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


              <Col span={24}><p style={{ fontWeight: '900', fontSize: '16px' }}>二、巡检汇总</p></Col>

              <Col span={24}>
                <Form.Item label=''>
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

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
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

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }

              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.troubleFiles === '' ? '[]' : openReportlist.troubleFiles} />}
                        </span>
                      </Descriptions.Item>

                    </Descriptions>
                  </div>

                )
              }


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
                  operationArr={openReportlist.operationList ? openReportlist.operationList : []}
                  mainId={mainId}
                  detailParams={reportSearch}
                />
              </Col>


              <Col span={24}><p style={{ marginTop: 20 }}>{reporttype === 'week' ? '4.2本周工作票开具情况及服务器查询操作票情况统计' : '4.2本月工作票开具情况及服务器查询操作票情况统计'}</p></Col>

              <Col span={24}>
                <Form.Item label=''>
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
                <LastweekHomework
                  forminladeLayout={forminladeLayout}
                  type={reporttype}
                  operationList={contentrowdata => {
                    setNextOperationList(contentrowdata)
                  }}
                  operationArr={openReportlist.nextOperationList ? openReportlist.nextOperationList : []}
                  mainId={mainId}
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
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
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

              {
                !reportSearch && (
                  <Col span={24} style={{ marginTop: 20 }}>
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
                )
              }


              {
                reportSearch && (
                  <div style={{ marginLeft: 30, marginRight: 10, marginTop: 20 }}>
                    <Descriptions size="middle">
                      <Descriptions.Item label='上传附件'>
                        <span style={{ color: 'blue', textDecoration: 'underline' }} >
                          {openReportlist && <Downloadfile files={openReportlist.meetingSummaryFiles === '' ? '[]' : openReportlist.meetingSummaryFiles} />}
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
  }))(ComputerroomReportdetail),
);
