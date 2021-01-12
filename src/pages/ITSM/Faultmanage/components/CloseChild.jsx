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
} from 'antd';

const { TextArea } = Input;

const CloseChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, close, curruserinfo } = props;
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
        sessionStorage.setItem('Nextflowmane','关闭');
    });
    return (
        <Row gutter={24}>
            <Form {...formItemLayout}>
                <Row gutter={24}>

                    <Col span={24}>
                        <Form.Item label="故障回顾情况" {...forminladeLayout}>
                            {getFieldDecorator('closeContent', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: close ? close.closeContent : ''
                            })(<TextArea rows={5} placeholder="请输入" />)}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="关闭时间" {...forminladeLayout}>
                            {getFieldDecorator('closeTime', {
                                rules: [
                                    {
                                        required,
                                        message: '请选择时间',
                                    },
                                ],
                                initialValue: close ? moment(close.closeTime) : moment(Date.now())
                            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>

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
                        <Form.Item label="关闭人">
                            {getFieldDecorator('closeUser', {
                                initialValue: close ? close.closeUser : curruserinfo.loginCode,
                            })(<Input allowClear disabled/>)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="关闭人部门">
                            {getFieldDecorator('closeDept', {
                                initialValue: close ? close.closeDept : curruserinfo.deptNameExt,
                            })(<Input allowClear disabled/>)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="关闭人单位">
                            {getFieldDecorator('closeUnit', {
                                initialValue: close ? close.closeUnit : '广西电网有限责任公司'
                            })(<Input allowClear disabled/>)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Row>
    );
});

export default Form.create({})(CloseChild);
