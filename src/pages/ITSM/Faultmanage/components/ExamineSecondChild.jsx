import React, { useRef, useImperativeHandle, useEffect } from 'react';
import moment from 'moment';
import {
    Form,
    // Button,
    Row,
    Col,
    Input,
    DatePicker,
    // Upload,
    // Icon,
    Radio
} from 'antd';

const { TextArea } = Input;
// const RadioGroup = Radio.Group;

const ExamineSecondChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, check, curruserinfo } = props;
    const { getFieldDecorator } = props.form;
    const attRef = useRef();
    useImperativeHandle(
        ref,
        () => ({
            attRef,
        }),
        [],
    );
    const required = true;
    useEffect(() => {
        sessionStorage.setItem('Nextflowmane', '自动化科专责确认');
    });

    return (
        <Row gutter={24}>
            <Form {...formItemLayout}>
                <Col span={24}>
                    <Form.Item label="审核结果" {...forminladeLayout}>
                        {getFieldDecorator('checkResult', {
                            rules: [{ required: true, message: '请选择审核结果' }],
                            initialValue: check ? check.checkResult : '0',
                        })(
                            <Radio.Group>
                                <Radio value='0'>通过</Radio>
                                <Radio value='1'>不通过</Radio>
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
                                    message: '请选择时间',
                                },
                            ],
                            initialValue: check ? moment(check.checkTime) : moment(Date.now())
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="审核意见" {...forminladeLayout}>
                        {getFieldDecorator('checkOpinion', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: check ? check.checkOpinion : ''
                        })(<TextArea rows={5} placeholder="请输入" />)}
                    </Form.Item>
                </Col>

                {/* <Col span={24}>
                    <Form.Item label="上传附件" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} {...forminladeLayout}>
                        {getFieldDecorator('checkAttachIds', {
                            valuePropName: 'fileList',
                        })(
                            <Upload name="logo" action="" listType="picture">
                                <Button type="primary">
                                    <Icon type="upload" style={{ fontSize: 18 }} /> 添加附件
                          </Button>
                            </Upload>,
                        )}
                    </Form.Item>
                </Col> */}

                <Col span={8}>
                    <Form.Item label="审核人">
                        {getFieldDecorator('checkUser', {
                            initialValue: check ? check.checkUser : curruserinfo.loginCode
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核单位">
                        {getFieldDecorator('checkUnit', {
                            initialValue: check ? check.checkUnit : '广西电网有限责任公司'
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核部门">
                        {getFieldDecorator('checkDept', {
                            initialValue: check ? check.checkDept : curruserinfo.deptNameExt
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>
            </Form>
        </Row>
    );
});

export default Form.create({})(ExamineSecondChild);
