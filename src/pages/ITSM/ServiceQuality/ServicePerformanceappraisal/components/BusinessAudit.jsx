import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Form, Input, Radio, Row, Col, Tag, DatePicker } from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const BusinessAudit = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    formItemLayout,
    forminladeLayout,
    repeatAudit,
    businessAudit,
    selectPersonstate,
    userinfo,
    noEdit,
  } = props;

  const [showContent, setShowContent] = useState('1');

  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  useEffect(() => {
    selectPersonstate(businessAudit.verifyValue === null ? '1' : businessAudit.verifyValue);
  }, []);

  const handleChange = e => {
    setShowContent(e.target.value);
    selectPersonstate(e.target.value);
  };

  const onChange = (date, dateString) => {
    setFieldsValue({ verifyTime: moment(dateString) })
  }


  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="审核结果">
            {getFieldDecorator('verifyValue', {
              rules: [
                {
                  required,
                  message: '请输入审核结果',
                },
              ],
              initialValue: businessAudit.verifyValue || '1',
            })(
              <Radio.Group disabled={noEdit} onChange={handleChange}>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>

        {showContent === '1' && (
          <Col span={24}>
            <Form.Item label="审核说明" {...forminladeLayout}>
              {getFieldDecorator('verifyContent', {
                initialValue: businessAudit.verifyContent || businessAudit.reviewContent,
              })(<TextArea disabled={noEdit} autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
        )}

        {showContent === '0' && (
          <Col span={24}>
            <Form.Item label="审核说明" {...forminladeLayout}>
              {getFieldDecorator('verifyContent2', {
                rules: [
                  {
                    required,
                    message: '请输入审核说明',
                  },
                ],
                initialValue: businessAudit.verifyContent || businessAudit.reviewContent,
              })(
                <TextArea
                  disabled={noEdit}
                  autoSize={{ minRows: 3 }}
                  placeholder="请输入"
                />,
              )}
            </Form.Item>
          </Col>
        )}

        {!repeatAudit && (
          <Col span={24}>
            <Form.Item label="考核状态" {...forminladeLayout}>
              {getFieldDecorator('verifyStatus', {
                initialValue: businessAudit.verifyStatus,
              })(
                <Tag color="blue">{businessAudit.verifyStatus || businessAudit.reviewStatus}</Tag>,
              )}
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('verifier', {
              initialValue:
                businessAudit.verifierName ||
                businessAudit.verifierName ||
                businessAudit.reviewerName ||
                userinfo.userName,
            })(<Input disabled={noEdit} />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('verifyTime', {
              rules: [
                {
                  required,
                  message: '请选择审核时间',
                },
              ],
              initialValue:
                businessAudit.checktime || businessAudit.reviewTime || businessAudit.verifyTime
                  ? moment(
                    businessAudit.checktime ||
                    businessAudit.reviewTime ||
                    businessAudit.verifyTime,
                  )
                  : moment(new Date()),
            })(
              // <div>
              //   <DatePicker
              //     disabled={true}
              //     defaultValue={moment(businessAudit.checktime || businessAudit.reviewTime || businessAudit.verifyTime || new Date())}
              //     showTime
              //     format="YYYY-MM-DD HH:mm"
              //     onChange={onChange}
              //   />
              // </div>
              <DatePicker
                disabled={true}
                // defaultValue={moment(businessAudit.checktime || businessAudit.reviewTime || businessAudit.verifyTime || new Date())}
                showTime
                format="YYYY-MM-DD HH:mm"
                onChange={onChange}
              />
            )}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

BusinessAudit.defaultProps = {
  businessAudit: {
    verifyValue: '1',
    verifyContent: '',
    verifyStatus: '',
    verifier: '',
    verifyTime: '',
    reviewContent: '',
    checktime: '',
  },
};

export default Form.create({})(BusinessAudit);
