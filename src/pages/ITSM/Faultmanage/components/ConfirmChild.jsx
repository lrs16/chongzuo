import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Radio
} from 'antd';
import SysUpload from '@/components/SysUpload'; // 附件下载组件

const { TextArea } = Input;

const ConfirmChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, confirm, curruserinfo, ChangeFiles, ChangeResult } = props;
    const { getFieldDecorator } = props.form;
    const attRef = useRef();
    const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
    const [adopt, setAdopt] = useState('1');

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
        if (confirm !== undefined) {
            setAdopt(confirm.confirmResult);
            ChangeResult(confirm.confirmResult);
        }
    }, []);

    const onChange = (e) => {
        setAdopt(e.target.value);
        ChangeResult(e.target.value);
    }
    return (
        <Row gutter={24} style={{ paddingTop: 24 }}>
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
                                initialValue: confirm ? confirm.confirmResult : '1'
                            })(
                                <Radio.Group onChange={onChange}>
                                    <Radio value='1'>通过</Radio>
                                    <Radio value='0'>不通过</Radio>
                                </Radio.Group>,
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
                        {adopt === '1' && (
                            <Form.Item label="确认说明" {...forminladeLayout}>
                                {getFieldDecorator('confirmContent', {
                                    rules: [{ required: false, message: '请输入', }],
                                    initialValue: confirm ? confirm.confirmContent : ''
                                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
                            </Form.Item>
                        )}
                        {adopt === '0' && (
                            <Form.Item label="确认说明" {...forminladeLayout}>
                                {getFieldDecorator('confirmContent', {
                                    rules: [{ required: true, message: '请输入', }],
                                    initialValue: confirm ? confirm.confirmContent : ''
                                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
                            </Form.Item>
                        )}
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="上传附件"
                            {...forminladeLayout}
                            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
                        >
                            <div style={{ width: 400 }}>
                                <SysUpload fileslist={(confirm && confirm.confirmAttachments) ? JSON.parse(confirm.confirmAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                            </div>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="确认人">
                            {getFieldDecorator('confirmUser', {
                                initialValue: confirm.confirmUser || curruserinfo.userName,
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="确认人单位">
                            {getFieldDecorator('confirmUnit', {
                                initialValue: confirm.confirmUnit || curruserinfo.unitName
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="确认人部门">
                            {getFieldDecorator('confirmDept', {
                                initialValue: confirm.confirmDept || curruserinfo.deptName,
                            })(<Input allowClear disabled />)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Row>
    );
});

ConfirmChild.defaultProps = {
    confirm: {
        confirmDept: '',
        confirmUnit: '',
        confirmUser: '',
        confirmAttachments: '',
        confirmContent: '',
        confirmResult: '1',
        confirmTime: moment().format()
    },
    curruserinfo: {
        deptName: '',
        unitName: '',
        userName: ''
    }
}

export default Form.create({})(ConfirmChild);
