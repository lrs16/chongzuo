import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import moment from 'moment';
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Alert,
    Radio
} from 'antd';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

const ExamineChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, check, curruserinfo, ChangeFiles } = props;
    const { getFieldDecorator } = props.form;
    const message = '若需要上传故障报告请于故障处理完成五个工作日内进行上传。'
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
        sessionStorage.setItem('Nextflowmane','系统运维商处理');
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

                <Col span={24}>
                    <Alert message={message} type="warning" showIcon/>
                    <Form.Item label="上传故障报告" {...forminladeLayout}>
                        {getFieldDecorator('checkReportSign', {
                            initialValue: check ? Number(check.checkReportSign) : 0
                        })(
                            <RadioGroup>
                                <Radio value={0}>是</Radio>
                                <Radio value={1}>否</Radio>
                            </RadioGroup>,
                        )}
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        label="上传附件"
                        {...forminladeLayout}
                        extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
                    >
                        <div style={{ width: 400 }}>
                            <SysUpload  fileslist={check ? JSON.parse(check.checkAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                        </div>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核人">
                        {getFieldDecorator('checkUser', {
                            initialValue: check ? check.checkUser : curruserinfo.loginCode
                        })(<Input allowClear disabled/>)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核单位">
                        {getFieldDecorator('checkUnit', {
                            initialValue: check ? check.checkUnit : '广西电网有限责任公司'
                        })(<Input allowClear disabled/>)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核部门">
                        {getFieldDecorator('checkDept', {
                            initialValue: check ? check.checkDept : curruserinfo.deptNameExt
                        })(<Input allowClear disabled/>)}
                    </Form.Item>
                </Col>
            </Form>
        </Row>
    );
});

export default Form.create({})(ExamineChild);
