import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Radio,
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const faultSource = [ // 故障来源
    { key: 0, value: '系统告警' },
    { key: 1, value: '巡检发现' }
];

const faultType = [ // 故障类型
    { key: 0, value: '系统应用' },
    { key: 1, value: '网络安全' },
    { key: 2, value: '数据库' },
    { key: 3, value: '中间件' },
    { key: 4, value: '环境/设备' },
    { key: 5, value: '软件' },
    { key: 6, value: '其他' },
];

const severity = [ // 严重程度
    { key: 0, value: '紧急' },
    { key: 1, value: '重大' },
    { key: 2, value: '一般' },
];

const sysmodular = [ // 系统模块
    { key: 0, value: '配网采集' },
    { key: 1, value: '主网采集' },
    { key: 2, value: '终端掉线' },
    { key: 3, value: '配网档案' },
    { key: 4, value: '实用化指标' },
    { key: 5, value: '账号缺陷' },
];

const registerScope = [ // 影响范围
    { key: 0, value: '自动抄表率' },
    { key: 1, value: '服务器' },
    { key: 2, value: '数据传输' },
    { key: 3, value: '网络\\通道' },
    { key: 4, value: 'VNC' },
    { key: 5, value: '专变自动抄表率' },
    { key: 6, value: '费控、召测' },
];

const RegisterChild = React.forwardRef((props, ref) => {
    const { formItemLayout, forminladeLayout, tododetailslist, ChangeFiles } = props;
    const { getFieldDecorator } = props.form;
    const attRef = useRef();
    useEffect(() => {
        sessionStorage.setItem('Nextflowmane', '系统运维商审核');
    });
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
    return (
        <Row gutter={24}>
            <Form {...formItemLayout}>
                <Col xl={8} xs={12}>
                    <Form.Item label="故障编号">
                        {getFieldDecorator('no', {
                            initialValue: (tododetailslist && tododetailslist.main.no) ? tododetailslist.main.no : ''
                        })(<Input disabled />)}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="登记时间">
                        {getFieldDecorator('registerTime', {
                            rules: [
                                {
                                    required,
                                    message: '请选择时间',
                                },
                            ],
                            initialValue: tododetailslist ? moment(tododetailslist.register.registerTime) : moment(Date.now())
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="发生时间">
                        {getFieldDecorator('registerOccurTime', {
                            rules: [
                                {
                                    required,
                                    message: '请选择时间',
                                },
                            ],
                            initialValue: tododetailslist ? moment(tododetailslist.register.registerOccurTime) : moment(Date.now())
                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="故障来源">
                        {getFieldDecorator('source', {
                            rules: [
                                {
                                    required,
                                    message: '请选择',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.main.source : ''
                        })(
                            <Select placeholder="请选择">
                                {faultSource.map(({ value }) => [<Option key={value}>{value}</Option>])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="系统模块">
                        {getFieldDecorator('registerModel', {
                            rules: [
                                {
                                    required,
                                    message: '请选择',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.register.registerModel : ''
                        })(
                            <Select placeholder="请选择">
                                {sysmodular.map(({ value }) => [
                                    <Option key={value}>
                                        {value}
                                    </Option>,
                                ])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="故障类型">
                        {getFieldDecorator('type', {
                            rules: [
                                {
                                    required,
                                    message: '请选择',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.main.type : ''
                        })(
                            <Select placeholder="请选择">
                                {faultType.map(({ value }) => [<Option key={value}>{value}</Option>])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="故障地点">
                        {getFieldDecorator('registerAddress', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.register.registerAddress : ''
                        })(<Input placeholder="请输入" allowClear />)}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="严重程度">
                        {getFieldDecorator('registerLevel', {
                            rules: [
                                {
                                    required,
                                    message: '请选择',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.register.registerLevel : ''
                        })(
                            <Select placeholder="请选择">
                                {severity.map(({ value }) => [<Option key={value}>{value}</Option>])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                    <Form.Item label="影响范围">
                        {getFieldDecorator('registerScope', {
                            rules: [
                                {
                                    required,
                                    message: '请选择',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.register.registerScope : ''
                        })(
                            <Select placeholder="请选择">
                                {registerScope.map(({ value }) => [<Option key={value}>{value}</Option>])}
                            </Select>,
                        )}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="故障名称">
                        {getFieldDecorator('title', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.main.title : ''
                        })(<Input placeholder="请输入" allowClear />)}
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="故障概要" {...forminladeLayout}>
                        {getFieldDecorator('content', {
                            rules: [
                                {
                                    required,
                                    message: '请输入',
                                },
                            ],
                            initialValue: tododetailslist ? tododetailslist.main.content : ''
                        })(<TextArea rows={5} placeholder="请输入" />)}
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="是否影响业务" {...forminladeLayout}>
                        {getFieldDecorator('registerEffect', {
                            initialValue: Number(tododetailslist.register.registerEffect)
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
                            <SysUpload  fileslist={tododetailslist ? JSON.parse(tododetailslist.register.registerAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                        </div>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="登记人">
                        {getFieldDecorator('registerUser', {
                            initialValue: tododetailslist ? tododetailslist.register.registerUser : ''
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="登记单位">
                        {getFieldDecorator('registerUnit', {
                            initialValue: tododetailslist ? tododetailslist.register.registerUnit : ''
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="登记部门">
                        {getFieldDecorator('registerDept', {
                            initialValue: tododetailslist ? tododetailslist.register.registerDept : ''
                        })(<Input allowClear disabled />)}
                    </Form.Item>
                </Col>
            </Form>
        </Row>
    );
});

export default Form.create({})(RegisterChild);
