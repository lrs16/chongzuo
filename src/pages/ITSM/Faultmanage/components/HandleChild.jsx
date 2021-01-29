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
import SysDict from '@/components/SysDict';

const { TextArea } = Input;
const { Option } = Select;

const forminladeLayout1 = {
    wrapperCol: {
        xs: {
            span: 12,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 0,
        },
    },
};

const HandleChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, handle, curruserinfo, ChangeFiles, ChangeFileskey } = props;
    const { getFieldDecorator } = props.form;
    const attRef = useRef();
    const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
    const [selectdata, setSelectData] = useState([]);
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
        sessionStorage.setItem('Nextflowmane', '系统运维商确认总结');
    });

    const getTypebyTitle = (title) => {
        if (selectdata.length > 0) {
            return selectdata.filter(item => item.title === title)[0].children;
        }
        return [];
    };

    const handleResult = getTypebyTitle('故障处理结果');

    return (
        <Row gutter={24} style={{ paddingTop: 24 }}>
            <SysDict
                typeid="1354278126724583426"
                commonid="1354288354950123522"
                ChangeSelectdata={newvalue => setSelectData(newvalue)}
                style={{ display: 'non' }}
            />
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
                                {handleResult.map(obj => [
                                    <Option key={obj.key} value={obj.title}>
                                        {obj.title}
                                    </Option>,
                                ])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col span={20}>
                    <Col span={14}>
                        <Form.Item
                            label={<><span style={{ color: 'red' }}>*</span><span>上传故障处理记录表</span></>}
                            {...forminladeLayout1}
                            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
                        >
                            {/* {getFieldDecorator('handleRecordAttachments', 
                            {
                                // initialValue: (JSON.parse(handle.handleRecordAttachments) || []).map(f =>
                                //     JSON.stringify({
                                //         // 为了提供给上传组件回显
                                //         uid: f.uid,  // 这是上传组件规定的文件唯一标识，内部会提供给Form以便正常渲染回显列表
                                //         name: f.name,
                                //         status: 'done',
                                //         url: f.fileUrl,
                                //         // 为了迎合最终向后端提交附件时方便新老文件统一处理
                                //         saveParams: {
                                //             filename: f.name,
                                //             url: f.fileUrl,
                                //         }
                                //     })),
                                rules: [{
                                    required: true, message: '请上传故障处理记录表', 
                                }],
                                // valuePropName: 'fileList',
                                getValueFromEvent: (e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e && e.fileList;
                                }
                            })(
                               
                            )} */}
                            <div
                                style={{ width: 400 }}
                                onMouseOver={() => {
                                    ChangeFileskey('1');
                                }}
                                onFocus={() => 0}
                            >
                                <SysUpload fileslist={(handle && handle.handleRecordAttachments) ? JSON.parse(handle.handleRecordAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                            </div>

                        </Form.Item></Col>
                </Col>

                <Col span={20}>
                    <Col span={14}>
                        <Form.Item
                            label={<><span style={{ color: 'red' }}>*</span><span>故障系统截图</span></>}
                            {...forminladeLayout1}
                            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
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
                </Col>

                <Col span={20}>
                    <Col span={14}>
                        <Form.Item
                            label="上传附件"
                            {...forminladeLayout1}
                            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
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
                </Col>

                <Col span={24}>
                    <Col span={8}>
                        <Form.Item label="处理人">
                            {getFieldDecorator('handler', {
                                initialValue: handle.handler || curruserinfo.userName,
                            })(<Input disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="处理人单位">
                            {getFieldDecorator('handleUnit', {
                                initialValue: handle.handleUnit || curruserinfo.deptName,
                            })(<Input disabled />)}
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="处理人部门">
                            {getFieldDecorator('handleDept', {
                                initialValue: handle.handleDept || curruserinfo.deptName,
                            })(<Input disabled />)}
                        </Form.Item>
                    </Col>
                </Col>
            </Form>
        </Row>
    );
});

HandleChild.defaultProps = {
    handle: {
        handleContent: '',
        handleReason: '',
        handleAdvise: '',
        handleResult: ''
    },
    curruserinfo: {
        deptName: '',
        unitName: '',
        userName: ''
    }
}

export default Form.create({})(HandleChild);
