import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    // Select
    Radio
} from 'antd';
import SysUpload from '@/components/SysUpload'; // 附件下载组件

const { TextArea } = Input;
// const { Option } = Select;

// const confirmResult = [ // 确认结果
//     { key: 0, value: '通过' },
//     { key: 1, value: '不通过' },
// ];

const ConfirmChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, confirm, curruserinfo, ChangeFiles, ChangeResult, resultconfirm } = props;
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

    const onChange = (e) => {
        ChangeResult(e.target.value);
    }
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
                                initialValue: confirm ? confirm.confirmResult : '1'
                            })(
                                <Radio.Group onChange={onChange}>
                                    <Radio value='1'>通过</Radio>
                                    <Radio value='0'>不通过</Radio>
                                </Radio.Group>,
                                // <Select placeholder="请选择">
                                //     {confirmResult.map(({ value }) => [<Option key={value}>{value}</Option>])}
                                // </Select>,
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
                        {resultconfirm === '1' && (
                            <Form.Item label="确认说明" {...forminladeLayout}>
                                {getFieldDecorator('confirmContent', {
                                    rules: [{ required: false, message: '请输入', }],
                                    initialValue: confirm ? confirm.confirmContent : ''
                                })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
                            </Form.Item>
                        )}
                        {resultconfirm === '0' && (
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
                            extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
                        >
                            <div style={{ width: 400 }}>
                                <SysUpload fileslist={(confirm && confirm.confirmAttachments) ? JSON.parse(confirm.confirmAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                            </div>
                        </Form.Item>
                    </Col>

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
