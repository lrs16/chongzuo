import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    // Alert,
} from 'antd';
import SysUpload from '@/components/SysUpload'; // 附件下载组件

const { TextArea } = Input;

const SummaryChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, finish, curruserinfo, ChangeFiles, tododetailslist, ChangeFileskey } = props;
    console.log(finish, tododetailslist, '寻找时间');
    // const message = '上传故障分析报告已超时， 实际上传时间已超过要求上传时间。'
    const { getFieldDecorator } = props.form;
    const attRef = useRef();

    const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
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
        sessionStorage.setItem('Nextflowmane', '自动化科业务负责人审核');
    });

    return (
        <Row gutter={24}>
            {/* <Alert message={message} type="error" showIcon /> */}
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
                            {getFieldDecorator('finishContent', {
                                initialValue: finish ? finish.finishContent : ''
                            })(<TextArea rows={5} placeholder="请输入" />)}
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item label="上传故障分析报告" extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb">
                            {getFieldDecorator('finishAnalysisAttachments', {
                                // rules: [
                                //     {
                                //         required,
                                //         message: '请上传故障分析报告',
                                //     },
                                // ],
                            })(
                                <div
                                    style={{ width: 400 }}
                                    onMouseOver={() => {
                                        ChangeFileskey('1');
                                    }}
                                    onFocus={() => 0}
                                >
                                    <SysUpload fileslist={(finish && finish.finishAnalysisAttachments) ? JSON.parse(finish.finishAnalysisAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                                </div>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <Form.Item label="要求上传时间">
                            {getFieldDecorator('finishRequiredTime', {
                                initialValue: (tododetailslist && tododetailslist.requiredUploadTime) ? moment(tododetailslist.requiredUploadTime) : moment(finish.finishRequiredTime)
                            })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <Form.Item label="实际上传时间">
                            {getFieldDecorator('finishPracticeTime', {
                                // initialValue: finish.finishAnalysisAttachments === '[]' || finish.finishAnalysisAttachments === undefined || (!finish && !finish.finishAnalysisAttachments)? '' : moment((JSON.parse(finish.finishAnalysisAttachments))[0].nowtime)
                                initialValue: (finish && finish.finishAnalysisAttachments) ? moment((JSON.parse(finish.finishAnalysisAttachments))[0].nowtime) : ''
                            })(<DatePicker showTime disabled format="YYYY-MM-DD HH:mm:ss" />)}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="上传附件"
                            {...forminladeLayout}
                            extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
                        >
                            <div
                                style={{ width: 400 }}
                                onMouseOver={() => {
                                    ChangeFileskey('2');
                                }}
                                onFocus={() => 0}
                            >
                                <SysUpload fileslist={(finish && finish.finishAttachments) ? JSON.parse(finish.finishAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                            </div>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="总结人">
                            {getFieldDecorator('finishUser', {
                                initialValue: finish ? finish.finishUser : curruserinfo.userName,
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
