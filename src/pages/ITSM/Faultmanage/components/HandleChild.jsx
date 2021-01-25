import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Select
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const handleResult = [ // 处理结果
    { key: 0, value: '根本解决' },
    { key: 1, value: '无法解决' },
    { key: 2, value: '代替方法' },
    { key: 3, value: '误报' },
    { key: 4, value: '自动消失' },
];

const HandleChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, handle, curruserinfo, ChangeFiles, ChangeFileskey } = props;
    const { getFieldDecorator } = props.form;
    const attRef = useRef();
    const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
    useEffect(() => {
        ChangeFiles(fileslist);
    }, [fileslist]);
    // useEffect(() => {
    //     setFilesList({ ...fileslist, arr: handle.handleAttachments });
    // }, [handle]);
    useImperativeHandle(
        ref,
        () => ({
            attRef,
        }),
        [],
    );
    const required = true;
    useEffect(() => {
        sessionStorage.setItem('Nextflowmane', '系统运维商确认总结');
    });
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
                            initialValue: (handle && handle.handleStartTime) ? moment(handle.handleStartTime) : moment(Date.now())
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
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
                            initialValue: (handle && handle.handleStartTime) ? moment(handle.handleEndTime) : moment(Date.now())
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
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

                <Col span={24}>
                    <Form.Item
                        label="上传故障处理记录表"
                        {...forminladeLayout}
                        extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
                    >
                        <div
                            style={{ width: 400 }}
                            onMouseOver={() => {
                                ChangeFileskey('1');
                            }}
                            onFocus={() => 0}
                        >
                            <SysUpload fileslist={(handle && handle.handleRecordAttachments) ? JSON.parse(handle.handleRecordAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                        </div>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        label="故障系统截图"
                        {...forminladeLayout}
                        extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
                    >
                        <div
                            style={{ width: 400 }}
                            onMouseOver={() => {
                                ChangeFileskey('2');
                            }}
                            onFocus={() => 0}
                        >
                            <SysUpload fileslist={(handle && handle.handlePictureAttachments) ? JSON.parse(handle.handlePictureAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                        </div>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        label="上传附件"
                        {...forminladeLayout}
                        extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
                    >
                        <div
                            style={{ width: 400 }}
                            onMouseOver={() => {
                                ChangeFileskey('3');
                            }}
                            onFocus={() => 0}
                        >
                            <SysUpload fileslist={(handle && handle.handleAttachments) ? JSON.parse(handle.handleAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                        </div>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理人">
                        {getFieldDecorator('handler', {
                            initialValue: curruserinfo.loginCode || '',
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理单位">
                        {getFieldDecorator('handleUnit', {
                            initialValue: '广西电网有限责任公司',
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="处理部门">
                        {getFieldDecorator('handleDept', {
                            initialValue: curruserinfo.deptNameExt || '',
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>
            </Form>
        </Row>
    );
});

export default Form.create({})(HandleChild);
