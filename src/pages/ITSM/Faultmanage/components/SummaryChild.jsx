import React, { useRef, useImperativeHandle } from 'react';
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
    Select
} from 'antd';
const { Option } = Select;
const finishTime = new Date();

const SummaryChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, finish } = props;
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
    return (
        <Row gutter={24}>
            <Form {...formItemLayout}>
                <Row gutter={24}>

                    <Col span={24}>
                        <Form.Item label="责任单位" {...forminladeLayout}>
                            {getFieldDecorator('finishDutyUnit', {
                                rules: [
                                    {
                                        required,
                                        message: '请选择',
                                    },
                                ],
                                initialValue: finish ? finish.finishDutyUnit : '',
                            })(<Select>
                                <Option value="单位一">单位一</Option>
                                <Option value="单位二">单位二</Option>
                                <Option value="单位三">单位三</Option>
                            </Select>)}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="总结时间" {...forminladeLayout}>
                            {getFieldDecorator('finishTime', {
                                rules: [
                                    {
                                        required,
                                        message: '请选择时间',
                                    },
                                ],
                                initialValue: finish ? moment(finish.finishTime) : moment(finishTime)
                            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>

                    {/* <Col span={24}>
                        <Form.Item label="上传故障分析报告" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} {...forminladeLayout}>
                            {getFieldDecorator('upload1', {
                                valuePropName: 'fileList',
                                rules: [
                                    {
                                        required,
                                    },
                                ],
                            })(
                                <Upload name="logo" action="" listType="picture">
                                    <Button type="primary">
                                        <Icon type="upload" style={{ fontSize: 18 }} /> 添加附件
                          </Button>
                                </Upload>,
                            )}
                        </Form.Item>
                    </Col> */}

                    {/* <Col span={24}>
                        <Form.Item label="上传附件" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} {...forminladeLayout}>
                            {getFieldDecorator('upload', {
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
                        <Form.Item label="总结人">
                            {getFieldDecorator('finishUser', {
                                initialValue: finish ? finish.finishUser : '',
                            })(<Input allowClear />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="总结人部门">
                            {getFieldDecorator('finishDept', {
                                initialValue: finish ? finish.finishDept : '',
                            })(<Input allowClear />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="总结人单位">
                            {getFieldDecorator('finishDutyUnit', {
                                initialValue: finish ? finish.finishDutyUnit : '',
                            })(<Input allowClear />)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Row>
    );
});

export default Form.create({})(SummaryChild);
