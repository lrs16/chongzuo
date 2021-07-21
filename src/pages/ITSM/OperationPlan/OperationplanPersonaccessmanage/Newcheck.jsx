import React, { useState } from 'react';
import { connect } from 'dva';
import { Select, Row, Col, Form, Input, Radio, Button, DatePicker, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '../index.less';
import Link from 'umi/link';

const { Panel } = Collapse;
const { Option } = Select;

const formallItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    labelAlign: 'left'
};

function Newcheck(props) {
    const pagetitle = props.route.name;
    const {
        form: { getFieldDecorator, resetFields, getFieldsValue },
        dispatch,
    } = props;

    const [adopt, setAdopt] = useState('0');
    const [activeKey, setActiveKey] = useState([]);

    const required = true;

    const operations = (
        <>
            <Button type="primary" style={{ marginRight: 8 }}>
                保存
            </Button>
            <Button type="primary" style={{ marginRight: 8 }}>
                {adopt === '0' ? '通过' : '不通过'}
            </Button>
            <Button type="default">
                <Link
                    to='/ITSM/operationplan/personaccessmanage/tocheck'>
                    返回
                </Link>
            </Button>
        </>
    );

    const onChange = (e) => { // 0通过 1不通过
        // console.log(e.target.value, '111通过不同')
        setAdopt(e.target.value);
    }

    const callback = key => {
        // 激活tab
        setActiveKey(key);
    };

    return (
        <PageHeaderWrapper title={pagetitle} extra={operations}>
            <div className={styles.collapse}>
                <Collapse
                    expandIconPosition="right"
                    // defaultActiveKey={['1']}
                    activeKey={activeKey}
                    bordered={false}
                    onChange={callback}
                >
                    <Panel header="人员进出审核" key="1">
                        <Row gutter={24} style={{ paddingTop: 24 }}>
                            <Form {...formallItemLayout} >
                                <Col span={8}>
                                    <Form.Item label="审核结果">
                                        {getFieldDecorator('checkResult', {
                                            rules: [{ required: true, message: '请选择审核结果' }],
                                            initialValue: '0',
                                        })(
                                            <Radio.Group onChange={onChange}>
                                                <Radio value='0'>通过</Radio>
                                                <Radio value='1'>不通过</Radio>
                                            </Radio.Group>,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="审核时间">
                                        {getFieldDecorator('checkTime', {
                                            rules: [
                                                {
                                                    required,
                                                    message: '请选择时间',
                                                },
                                            ],
                                            initialValue: ''
                                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="审核说明">
                                        {getFieldDecorator('checkContent', {
                                            initialValue: '',
                                        })
                                            (<Input allowClear />)
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="审核人">
                                        {getFieldDecorator('checkUser', {
                                            initialValue: ''
                                        })(<Input allowClear disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="审核人单位">
                                        {getFieldDecorator('checkUnit', {
                                            initialValue: ''
                                        })(<Input allowClear disabled />)}
                                    </Form.Item>
                                </Col>
                            </Form>
                        </Row>
                    </Panel>
                    <Panel header="人员进出申请" key="2">
                        <Row gutter={24} style={{ paddingTop: 24 }}>
                            <Form {...formallItemLayout} >
                                <Col span={8}>
                                    <Form.Item label="进出申请编号">
                                        {getFieldDecorator('registNo', {
                                            initialValue: '',
                                        })(<Input disabled disabled />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="姓名">
                                        {getFieldDecorator('name', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="性别">
                                        {getFieldDecorator('sex', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="联系电话">
                                        {getFieldDecorator('phone', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="进出事由">
                                        {getFieldDecorator('content', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="计划进入时间">
                                        {getFieldDecorator('planInTime', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="计划离开时间">
                                        {getFieldDecorator('planOutTime', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="携带工具">
                                        {getFieldDecorator('carryTool', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="申请人">
                                        {getFieldDecorator('applyUser', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="申请时间">
                                        {getFieldDecorator('applyTime', {
                                            initialValue: '',
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>
                            </Form>
                        </Row>
                    </Panel>
                </Collapse>
            </div>

            {/* <Card>
                <Row gutter={24} style={{ paddingTop: 24 }}>
                    <Form {...formallItemLayout} >
                        <Col span={8}>
                            <Form.Item label="审核结果">
                                {getFieldDecorator('checkResult', {
                                    rules: [{ required: true, message: '请选择审核结果' }],
                                    initialValue: '0',
                                })(
                                    <Radio.Group onChange={onChange}>
                                        <Radio value='0'>通过</Radio>
                                        <Radio value='1'>不通过</Radio>
                                    </Radio.Group>,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="审核时间">
                                {getFieldDecorator('checkTime', {
                                    rules: [
                                        {
                                            required,
                                            message: '请选择时间',
                                        },
                                    ],
                                    initialValue: ''
                                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="审核说明">
                                {getFieldDecorator('checkContent', {
                                    initialValue: '',
                                })
                                    (<Input allowClear />)
                                }
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="审核人">
                                {getFieldDecorator('checkUser', {
                                    initialValue: ''
                                })(<Input allowClear disabled />)}
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="审核人单位">
                                {getFieldDecorator('checkUnit', {
                                    initialValue: ''
                                })(<Input allowClear disabled />)}
                            </Form.Item>
                        </Col>
                    </Form>
                </Row>
            </Card>
         */}
        </PageHeaderWrapper>
    );
}

export default Form.create({})(Newcheck);