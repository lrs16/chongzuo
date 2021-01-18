import React, { useRef, useImperativeHandle, useEffect } from 'react';
import moment from 'moment';
import {
    Form,
    // Button,
    Row,
    Col,
    Input,
    DatePicker,
    Select
    // Upload,
    // Icon,
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const confirmResult = [ // 确认结果
    { key: 0, value: '通过' },
    { key: 1, value: '不通过' },
];

const ConfirmChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, confirm, curruserinfo } = props;
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
    // useEffect(() => {
    //     sessionStorage.setItem('Nextflowmane', '关闭');
    // });
    return (
        <Row gutter={24}>
            <Form {...formItemLayout}>
                <Row gutter={24}>

                    <Col span={8}>
                        <Form.Item label="确认结果">
                            {getFieldDecorator('confirmResult', {
                                rules: [
                                    {
                                        required,
                                        message: '请选择',
                                    },
                                ],
                                initialValue: confirm ? confirm.confirmResult : ''
                            })(
                                <Select placeholder="请选择">
                                    {confirmResult.map(({ value }) => [<Option key={value}>{value}</Option>])}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="确认时间">
                            {getFieldDecorator('confirmTime', {
                                rules: [
                                    {
                                        required,
                                        message: '请选择时间',
                                    },
                                ],
                                initialValue: confirm ? moment(confirm.confirmTime) : moment(Date.now())
                            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="确认说明" {...forminladeLayout}>
                            {getFieldDecorator('confirmContent', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: confirm ? confirm.confirmContent : ''
                            })(<TextArea rows={5} placeholder="请输入" />)}
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
                        <Form.Item label="确认人">
                            {getFieldDecorator('confirmUser', {
                                initialValue: confirm ? confirm.confirmUser : curruserinfo.loginCode,
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="确认单位">
                            {getFieldDecorator('confirmUnit', {
                                initialValue: confirm ? confirm.confirmUnit : '广西电网有限责任公司'
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="确认部门">
                            {getFieldDecorator('confirmDept', {
                                initialValue: confirm ? confirm.confirmDept : curruserinfo.deptNameExt,
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Row>
    );
});

export default Form.create({})(ConfirmChild);
