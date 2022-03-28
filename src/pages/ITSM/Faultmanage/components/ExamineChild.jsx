import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import FormTextArea from '@/components/FormTextArea'; // 文本域收缩: 默认展示一行
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker, Radio } from 'antd';

const RadioGroup = Radio.Group;

const ExamineChild = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    check,
    curruserinfo,
    ChangeFiles,
    ChangeResult,
    location,
  } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [adopt, setAdopt] = useState('1');
  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const required = true;
  useEffect(() => {
    sessionStorage.setItem('Nextflowmane', '系统运维商处理');
  });

  useEffect(() => {
    if (check !== undefined) {
      setAdopt(check.checkResult);
      ChangeResult(check.checkResult);
    }
  }, []);

  const onChange = e => {
    setAdopt(e.target.value);
    ChangeResult(e.target.value);
  };

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={24}>
          <Form.Item label="审核结果" {...forminladeLayout}>
            {getFieldDecorator('checkResult', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: check.checkResult,
            })(
              <Radio.Group onChange={onChange}>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="审核时间" {...forminladeLayout}>
            {getFieldDecorator('checkTime', {
              rules: [
                {
                  required,
                  message: '请选择审核时间',
                },
              ],
              initialValue: check.checkTime ? moment(check.checkTime) : moment(Date.now()),
            })(
              <>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  defaultValue={moment(check && check.checkTime ? check.checkTime : Date.now())}
                  onChange={v => {
                    setFieldsValue({ checkTime: moment(v) });
                  }}
                />
              </>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          {adopt === '1' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('checkOpinion1', {
                rules: [{ required: false, message: '请输入审核意见' }],
                initialValue: check.checkOpinion,
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={check.checkOpinion}
                  isEdit
                  getVal={v => setFieldsValue({ checkOpinion1: v })}
                />,
              )}
            </Form.Item>
          )}
          {adopt === '0' && (
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('checkOpinion2', {
                rules: [{ required: true, message: '请输入审核意见' }],
                initialValue: check.checkOpinion,
              })(
                <FormTextArea
                  autoSize={1}
                  indexText={check.checkOpinion}
                  isEdit
                  getVal={v => setFieldsValue({ checkOpinion2: v })}
                />,
              )}
            </Form.Item>
          )}
        </Col>

        <Col span={24}>
          <Form.Item label="是否需要提供故障报告" {...forminladeLayout}>
            {getFieldDecorator('checkReportSign', {
              initialValue: check ? Number(check.checkReportSign) : 0,
            })(
              <RadioGroup>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            {location &&
            (!location.state || (location.state && !location.state.cache)) && ( // 位置已调
                <div>
                  <SysUpload
                    fileslist={
                      check && check.checkAttachments ? JSON.parse(check.checkAttachments) : []
                    }
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                  />
                </div>
              )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('checkUser', {
              initialValue: check.checkUser || curruserinfo.userName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核人单位">
            {getFieldDecorator('checkUnit', {
              initialValue: check.checkUnit || curruserinfo.unitName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核人部门">
            {getFieldDecorator('checkDept', {
              initialValue: check.checkDept || curruserinfo.deptName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

ExamineChild.defaultProps = {
  check: {
    checkAttachments: '',
    checkReportSign: 0,
    checkOpinion: '',
    checkResult: '1',
  },
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: '',
  },
};

export default Form.create({})(ExamineChild);
