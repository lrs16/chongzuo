import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Form, Input, Radio, Row, Col, Tag, DatePicker, message } from 'antd';
import moment from 'moment';
import FormTextArea from '../../../OperationPlan/components/FormTextArea';
import styles from '../index.less'

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
    search,
    type
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
    selectPersonstate(businessAudit.verifyValue || '1');
    setShowContent(businessAudit.verifyValue || '1')
  }, []);

  const handleChange = e => {
    setShowContent(e.target.value);
    selectPersonstate(e.target.value);
    if(!type && e.target.value === '0') {
      message.info('审核结果不通过，该工单下一步状态为结束')
    }
  };

  const onChange = (date, dateString) => {
    setFieldsValue({ verifyTime: moment(dateString) })
  }


  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label={type ? '复核结果':'审核结果'}>
            {getFieldDecorator('verifyValue', {
              rules: [
                {
                  required,
                  message: `${type ? '请输入复核结果':'请输入审核结果'}`,
                },
              ],
              initialValue: businessAudit.verifyValue || '',
            })(
              <Radio.Group disabled={search || noEdit} onChange={handleChange}>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>

        <div className={styles.allowClearicon}>
          {showContent === '1' && (
            <Col span={24}>
              <Form.Item label={type ? '复核内容':'审核内容'} {...forminladeLayout}>
                {getFieldDecorator('verifyContent', {
                  initialValue: businessAudit.verifyContent || businessAudit.reviewContent,
                })(
                  <FormTextArea
                    autoSize={1}
                    indexText={businessAudit.verifyContent || businessAudit.reviewContent}
                    isEdit={!search}
                    getVal={v => setFieldsValue({ verifyContent: v })}
                  />
                )
                }
              </Form.Item>
            </Col>
          )}


          {showContent === '0' && (
            <Col span={24}>
              <Form.Item label={type ? '复核内容':'审核内容'} {...forminladeLayout}>
                {getFieldDecorator('verifyContent2', {
                  rules: [
                    {
                      required,
                      message: `${type ? '请输入复核说明':'请输入审核说明'}`,
                    },
                  ],
                  initialValue: businessAudit.verifyContent || businessAudit.reviewContent,
                })(
                  <FormTextArea
                    autoSize={1}
                    indexText={businessAudit.verifyContent || businessAudit.reviewContent}
                    isEdit={!search}
                    getVal={v => setFieldsValue({ verifyContent2: v })}
                  />
                )}
              </Form.Item>
            </Col>
          )}
        </div>


        {!repeatAudit && (
          <Col span={24}>
            <Form.Item label="考核状态" {...forminladeLayout}>
              {getFieldDecorator('verifyStatus', {
                initialValue: businessAudit.verifyStatus,
              })(
                <Tag color="blue">{businessAudit.verifyStatus || businessAudit.reviewStatus || '待审核'}</Tag>,
              )}
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item label={type ? '复核人':'审核人'}>
            {getFieldDecorator('verifier', {
              initialValue:
                businessAudit.verifierName ||
                businessAudit.verifierName ||
                businessAudit.reviewerName ||
                userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label={type ? '复核时间':'审核时间'}>
            {getFieldDecorator('verifyTime', {
              rules: [
                {
                  required,
                  message: `${type ? '请选择复核时间' :'请选择审核时间'}`,
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
                disabled
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
