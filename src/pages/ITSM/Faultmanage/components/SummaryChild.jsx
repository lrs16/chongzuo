import React, { useRef, useImperativeHandle, useEffect } from 'react';
import moment from 'moment';
import {
    Form,
    Button,
    Row,
    Col,
    Input,
    DatePicker,
    Upload,
    Icon,
} from 'antd';

const { TextArea } = Input;

const SummaryChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, finish, curruserinfo } = props;
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
        sessionStorage.setItem('Nextflowmane', '关闭');
    });
    return (
        <Row gutter={24}>
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
                                initialValue: finish ? moment(finish.finishTime) : moment(Date.now())
                            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                    <Form.Item label="总结说明" {...forminladeLayout}>
                        {getFieldDecorator('zjsm', {
                            initialValue: ''
                        })(<TextArea rows={5} placeholder="请输入" />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="上传故障分析报告" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }}>
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
                </Col>

                    <Col span={8}>
                        <Form.Item label="要求上传时间">
                            {getFieldDecorator('finishTime1', {
                                initialValue: moment(Date.now())
                            })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>
                    

                    <Col span={8}>
                        <Form.Item label="实际上传时间">
                            {getFieldDecorator('finishTime2', {
                                initialValue: moment(Date.now())
                            })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
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
                    </Col>

                    <Col span={8}>
                        <Form.Item label="总结人">
                            {getFieldDecorator('finishUser', {
                                initialValue: finish ? finish.finishUser : curruserinfo.loginCode,
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="总结单位">
                            {getFieldDecorator('finishUnit', {
                                initialValue: finish ? finish.finishUnit : '广西电网有限责任公司',
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="总结部门">
                            {getFieldDecorator('finishDept', {
                                initialValue: finish ? finish.finishDept : curruserinfo.deptNameExt,
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Row>
    );
});

export default Form.create({})(SummaryChild);
