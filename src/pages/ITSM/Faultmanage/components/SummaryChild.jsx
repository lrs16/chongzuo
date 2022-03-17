import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker, Alert, Button, Icon, Select, Radio } from 'antd';
import router from 'umi/router';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用
import SysDict from '@/components/SysDict';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

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

const ItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const forminladeLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const SummaryChild = React.forwardRef((props, ref) => {
  const {
    form: { getFieldsValue },
    finish,
    curruserinfo,
    ChangeFiles,
    tododetailslist,
    ChangeFileskey,
    id,
    mainId,
    orderNo,
    editState,
    finishId,
    uploadStatus,
  } = props;
  const message = '上传故障分析报告已超时， 实际上传时间已超过要求上传时间。';
  const { getFieldDecorator, setFieldsValue } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState([]);
  const [show, setShow] = useState('0');

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  useEffect(() => {
    if (
      finish &&
      finish.finishAnalysisAttachments !== '[]' &&
      finish.finishAnalysisAttachments !== undefined &&
      finish.finishAnalysisAttachments !== null
    ) {
      setFieldsValue({ finishAnalysisAttachments: finish.finishAnalysisAttachments }, () => {});
    }
    if (finish && finish.finishReportSign) {
      setShow(finish.finishReportSign);
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const required = true;

  useEffect(() => {
    sessionStorage.setItem('Nextflowmane', '自动化科业务负责人审核');
  });

  const showReport = e => {
    setShow(e.target.value);
  };

  const handleAnalysisReport = sign => {
    const values = getFieldsValue();
    router.push({
      pathname: '/ITSM/faultmanage/analysisreport',
      query: {
        tobeForm: values,
        id,
        mainId,
        orderNo,
        tobeeditState: editState,
        finishId,
        sign,
      },
    });
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const responsible = getTypebyTitle('故障责任方');

  return (
    <>
      <Row gutter={24}>
        {finish &&
          finish.finishRequiredTime !== undefined &&
          finish.finishPracticeTime !== undefined &&
          new Date(Date.parse(finish.finishRequiredTime)) <
            new Date(Date.parse(finish.finishPracticeTime)) ===
            true && (
            <Alert
              message={message}
              type="error"
              showIcon
              style={{ width: '94%', marginLeft: '3%', marginBottom: 15 }}
            />
          )}
        <SysDict
          typeid="333"
          commonid="335"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="故障责任方">
              {getFieldDecorator('finishBlame', {
                rules: [
                  {
                    required,
                    message: '请选择故障责任方',
                  },
                ],
                initialValue: finish.finishBlame,
              })(
                <Select placeholder="请选择" allowClear>
                  {responsible.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否需要提供故障报告" {...forminladeLayout1}>
              {getFieldDecorator('finishReportSign', {
                rules: [
                  {
                    required,
                    message: '请选择是否需要提供故障报告',
                  },
                ],
                initialValue: finish && finish.finishReportSign ? finish.finishReportSign : '0',
              })(
                <RadioGroup onChange={showReport}>
                  <Radio value="0">是</Radio>
                  <Radio value="1">否</Radio>
                </RadioGroup>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="总结时间">
              {getFieldDecorator('finishTime', {
                rules: [
                  {
                    required,
                    message: '请选择总结时间',
                  },
                ],
                initialValue: finish.finishTime ? moment(finish.finishTime) : moment(Date.now()),
              })(
                <>
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    defaultValue={moment(
                      finish && finish.finishTime ? finish.finishTime : Date.now(),
                    )}
                    onChange={v => {
                      setFieldsValue({ finishTime: moment(v) });
                    }}
                  />
                </>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="总结说明" {...forminladeLayout}>
              {getFieldDecorator('finishContent', {
                initialValue: finish.finishContent,
              })(<TextArea rows={5} placeholder="请输入" />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="上传故障分析报告" {...ItemLayout}>
              {getFieldDecorator(
                `${show === '0' ? 'finishAnalysisAttachments' : 'finishAnalysisAttachments2'}`,
                {
                  rules:
                    show === '0'
                      ? [
                          {
                            required,
                            message: '请生成故障分析报告',
                          },
                        ]
                      : [],
                  initialValue: finish.finishAnalysisAttachments,
                },
              )(
                <>
                  {finish.finishAnalysisAttachments && (
                    <Downloadfile files={finish.finishAnalysisAttachments} />
                  )}
                  {finish.finishAnalysisAttachments && (
                    <Icon
                      className="dynamic-delete-button"
                      type="edit"
                      onClick={() => handleAnalysisReport('noedit')}
                    />
                  )}

                  {finish && !finish.finishAnalysisAttachments && (
                    <Button type="primary" onClick={() => handleAnalysisReport('')}>
                      自动生成报告
                    </Button>
                  )}
                </>,
              )}
            </Form.Item>
          </Col>

          <Col
            span={8}
            style={{ display: show === '0' || finish.finishAnalysisAttachments ? 'block' : 'none' }}
          >
            <Form.Item label="要求上传时间">
              {getFieldDecorator('finishRequiredTime', {
                initialValue:
                  tododetailslist && tododetailslist.requiredUploadTime
                    ? moment(tododetailslist.requiredUploadTime)
                    : finish.finishRequiredTime
                    ? moment(finish.finishRequiredTime)
                    : '',
              })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>

          {finish && finish.finishAnalysisAttachments && (
            <>
              <Col span={8}>
                <Form.Item label="实际上传时间">
                  {getFieldDecorator('finishPracticeTime', {
                    initialValue:
                      tododetailslist && tododetailslist.finishPracticeTime
                        ? moment(tododetailslist.finishPracticeTime)
                        : finish.finishPracticeTime
                        ? moment(finish.finishPracticeTime)
                        : '',
                  })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
                </Form.Item>
              </Col>
            </>
          )}

          <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
              // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb" // 位置已调
            >
              {getFieldDecorator(
                'finishAttachments',
                {},
              )(
                <div
                  onMouseOver={() => {
                    ChangeFileskey('2');
                  }}
                  onFocus={() => 0}
                >
                  <SysUpload
                    fileslist={
                      finish && finish.finishAttachments ? JSON.parse(finish.finishAttachments) : []
                    }
                    ChangeFileslist={newvalue => {
                      setFilesList(newvalue);
                      setFieldsValue({ finishAttachments: JSON.stringify(newvalue.arr) });
                    }}
                    banOpenFileDialog={uploadStatus}
                  />
                </div>,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="总结人">
              {getFieldDecorator('finishUser', {
                initialValue: finish.finishUser || curruserinfo.userName,
              })(<Input allowClear disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="总结人单位">
              {getFieldDecorator('finishUnit', {
                initialValue: finish.finishUnit || curruserinfo.unitName,
              })(<Input allowClear disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="总结人部门">
              {getFieldDecorator('finishDept', {
                initialValue: finish.finishDept || curruserinfo.deptName,
              })(<Input allowClear disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
});

SummaryChild.defaultProps = {
  finish: {
    finishContent: '',
  },
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: '',
  },
};

export default Form.create({})(SummaryChild);
