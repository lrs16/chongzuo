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

const ExamineSecondChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, check, curruserinfo, ChangeFiles, ChangeResult } = props;
    const { getFieldDecorator } = props.form;
    const attRef = useRef();
    const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
    const [adopt, setAdopt] = useState('1');

    useEffect(() => {
        ChangeFiles(fileslist);
    }, [fileslist]);

    useEffect(() => {
        if (check !== undefined) {
            setAdopt(check.checkResult);
            ChangeResult(check.checkResult);
        }
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            attRef,
        }),
        [],
    );
    const required = true;
    useEffect(() => {
        sessionStorage.setItem('Nextflowmane', '自动化科专责确认');
    });

    const onChange = (e) => {
        setAdopt(e.target.value);
        ChangeResult(e.target.value);
    }

    return (
        <Row gutter={24} style={{ paddingTop: 24 }}>
            <Form {...formItemLayout}>
                <Col span={24}>
                    <Form.Item label="审核结果" {...forminladeLayout}>
                        {getFieldDecorator('checkResult', {
                            rules: [{ required: true, message: '请选择审核结果' }],
                            initialValue: check.checkResult,
                        })(
                            <Radio.Group onChange={onChange}>
                                <Radio value='1'>通过</Radio>
                                <Radio value='0'>不通过</Radio>
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
                    {adopt === '1' && ( // 1 通过
                        <Form.Item label="审核意见" {...forminladeLayout}>
                            {getFieldDecorator('checkOpinion', {
                                rules: [{ required: false, message: '请输入', }],
                                initialValue: check ? check.checkOpinion : ''
                            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
                        </Form.Item>
                    )}
                    {adopt === '0' && ( // 0 不通过
                        <Form.Item label="审核意见" {...forminladeLayout}>
                            {getFieldDecorator('checkOpinion', {
                                rules: [{ required: true, message: '请输入', }],
                                initialValue: check ? check.checkOpinion : ''
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
                            <SysUpload fileslist={(check && check.checkAttachments) ? JSON.parse(check.checkAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                        </div>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核人">
                        {getFieldDecorator('checkUser', {
                            initialValue: check.checkUser || curruserinfo.userName
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核人单位">
                        {getFieldDecorator('checkUnit', {
                            initialValue: check.checkUnit || curruserinfo.unitName
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="审核人部门">
                        {getFieldDecorator('checkDept', {
                            initialValue: check.checkDept || curruserinfo.deptName
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>
            </Form>
        </Row>
    );
});

ExamineSecondChild.defaultProps = {
    check: {
        checkDept: '',
        checkUnit: '',
        checkUser: '',
        checkAttachments: '',
        checkReportSign: '',
        checkOpinion: '',
        checkResult: '1',
        checkTime: moment().format()
    },
    curruserinfo: {
        deptName: '',
        unitName: '',
        userName: ''
    }
}

export default Form.create({})(ExamineSecondChild);
