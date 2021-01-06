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

const { TextArea } = Input;
const { Option } = Select;
// 故障处理开始时间 handleStartTime
// 故障恢复时间 handleEndTime
const handleStartTime = new Date();
const handleEndTime = new Date();

const handleResult = [ // 处理结果
    { key: 0, value: '根本解决' },
    { key: 1, value: '无法解决' },
    { key: 2, value: '代替方法' },
    { key: 3, value: '误报' },
    { key: 4, value: '自动消失' },
];

const HandleChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, handle, curruserinfo } = props;
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
                <Col span={24}>
                    <Form.Item label="故障详细描述" {...forminladeLayout}>
                        {getFieldDecorator('handleContent', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: handle ? handle.handleContent : ''
                        })(<TextArea rows={5} placeholder="请输入" />)}
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="故障分析及原因" {...forminladeLayout}>
                        {getFieldDecorator('handleReason', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: handle ? handle.handleReason : ''
                        })(<Input allowClear />)}
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="解决措施或建议" {...forminladeLayout}>
                        {getFieldDecorator('handleAdvise', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: handle ? handle.handleAdvise : ''
                        })(<Input allowClear />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理开始时间">
                        {getFieldDecorator('handleStartTime', {
                            rules: [
                                {
                                    required,
                                    message: '请选择时间',
                                },
                            ],
                            initialValue: handle ? moment(handle.handleStartTime) : moment(handleStartTime)
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}/>)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理完成时间">
                        {getFieldDecorator('handleEndTime', {
                            rules: [
                                {
                                    required,
                                    message: '请选择时间',
                                },
                            ],
                            initialValue: handle ? moment(handle.handleEndTime) : moment(handleEndTime)
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}/>)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理结果">
                        {getFieldDecorator('handleResult', {
                            rules: [
                                {
                                    required,
                                    message: '请选择',
                                },
                            ],
                            initialValue: handle ? handle.handleResult : ''
                        })(
                            <Select placeholder="请选择">
                                {handleResult.map(({ value }) => [<Option key={value}>{value}</Option>])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理人">
                        {getFieldDecorator('handleUser', {
                            initialValue: curruserinfo.loginCode || '',
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理人部门">
                        {getFieldDecorator('handleDept', {
                            initialValue: curruserinfo.deptNameExt || '',
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理人单位">
                        {getFieldDecorator('handleUnit', {
                            initialValue: '广西电网有限责任公司',
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>

                {/* <Col span={24}>
                    <Form.Item label="上传故障处理记录附件" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} labelCol={{
                        xs: { span: 24 },
                        sm: { span: 3 },
                    }}>
                        {getFieldDecorator('upload2', {
                            rules: [
                                {
                                    required,
                                },
                            ],
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

                {/* <Col span={24}>
                    <Form.Item label="上传附件" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb" style={{ display: "flex" }} labelCol={{
                        xs: { span: 24 },
                        sm: { span: 3 },
                    }}>
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
            </Form>
        </Row>
    );
});

export default Form.create({})(HandleChild);
