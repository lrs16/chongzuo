import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Alert,
} from 'antd';
import SysUpload from '@/components/SysUpload'; // 附件下载组件

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const ItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

const SummaryChild = React.forwardRef((props, ref) => {
  const { finish, curruserinfo, ChangeFiles, tododetailslist, ChangeFileskey } = props;
  const message = '上传故障分析报告已超时， 实际上传时间已超过要求上传时间。'
  const { getFieldDecorator, setFieldsValue } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  useEffect(() => {
    if (finish && finish.finishAnalysisAttachments !== '[]' && finish.finishAnalysisAttachments !== undefined && finish.finishAnalysisAttachments !== null) {
      setFieldsValue({ finishAnalysisAttachments: finish.finishAnalysisAttachments }, () => { });
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

  return (
    <Row gutter={24} style={{ paddingTop: 15 }}>
      {
        (finish && finish.finishRequiredTime !== undefined && finish.finishPracticeTime !== undefined) && (new Date(Date.parse(finish.finishRequiredTime)) < new Date(Date.parse(finish.finishPracticeTime))) === true &&
        <Alert message={message} type="error" showIcon style={{ width: '94%', marginLeft: '3%', marginBottom: 15 }} />
      }
      <Form {...formItemLayout}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="总结时间" {...forminladeLayout}>
              {getFieldDecorator('finishTime', {
                rules: [
                  {
                    required,
                    message: '请选择时间',
                  },
                ],
                initialValue: moment(finish.finishTime)
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="总结说明" {...forminladeLayout}>
              {getFieldDecorator('finishContent', {
                initialValue: finish.finishContent
              })(<TextArea rows={5} placeholder="请输入" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <>
              <Form.Item label="上传故障分析报告">
                {getFieldDecorator('finishAnalysisAttachments', {
                  rules: [
                    {
                      required,
                      message: '请上传故障分析报告！'
                    },
                  ],
                })(
                  <div
                    onMouseOver={() => {
                      ChangeFileskey('1');
                    }}
                    onFocus={() => 0}
                  >
                    <SysUpload
                      fileslist={(finish && finish.finishAnalysisAttachments) ? JSON.parse(finish.finishAnalysisAttachments) : []}
                      ChangeFileslist={
                        newvalue => {
                          setFieldsValue({ finishAnalysisAttachments: JSON.stringify(newvalue.arr) });
                          setFilesList(newvalue)
                        }
                      }
                    />
                  </div>
                )}
              </Form.Item>
            </>
          </Col>
          <Col span={8}>
            <Form.Item label="要求上传时间" {...ItemLayout}>
              {getFieldDecorator('finishRequiredTime', {
                initialValue: (tododetailslist && tododetailslist.requiredUploadTime) ? moment(tododetailslist.requiredUploadTime) : moment(finish.finishRequiredTime)
              })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="实际上传时间"{...ItemLayout}>
              {getFieldDecorator('finishPracticeTime', {
                initialValue: (finish.finishAnalysisAttachments !== undefined && finish.finishAnalysisAttachments !== null && finish.finishAnalysisAttachments !== '[]') ? (moment((JSON.parse(finish.finishAnalysisAttachments))[0].nowtime) || '[]') : ''
              })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
            >
              {
                getFieldDecorator('finishAttachments', {})(
                  <div
                    style={{ width: 400 }}
                    onMouseOver={() => {
                      ChangeFileskey('2');
                    }}
                    onFocus={() => 0}
                  >
                    <SysUpload
                      fileslist={(finish && finish.finishAttachments) ? JSON.parse(finish.finishAttachments) : []}
                      ChangeFileslist={newvalue => {
                        setFilesList(newvalue);
                        setFieldsValue({ finishAttachments: JSON.stringify(newvalue.arr) });
                      }
                      }
                    />
                  </div>
                )
              }
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
        </Row>
      </Form>
    </Row>
  );
});

SummaryChild.defaultProps = {
  finish: {
    finishContent: '',
    finishTime: moment().format()
  },
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: ''
  }
}

export default Form.create({})(SummaryChild);
