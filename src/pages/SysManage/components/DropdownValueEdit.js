import React, { Component } from 'react';
import { Form, Input, Modal, Radio, InputNumber } from 'antd';

const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
    colon: false,
};

const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};


class DropdownValueEdit extends Component {
    state = {
        visible: false,
    };


    handleopenClick = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleCancel();
                this.props.onSumit(values);
                this.props.form.resetFields();
            }
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    };

    render() {
        const { visible } = this.state;
        const { children, title } = this.props;
        const { getFieldDecorator } = this.props.form;
        const required = true;
        const {
            // id, 
            dictModule,
            dictType,
            dictCode,
            dictName,
            dictState,
            dictSort,
            dictRemarks
        } = this.props.record;
        return (
            <>
                {withClick(children, this.handleopenClick)}
                <Modal
                    title={title}
                    visible={visible}
                    centered
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    width={650}
                >
                    <Form {...formItemLayout}>
                        {/* <Form.Item label="id">
                            {getFieldDecorator('id', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: id || '',
                            })(<Input placeholder="请输入..." />)}
                        </Form.Item> */}

                        <Form.Item label="字典模块">
                            {getFieldDecorator('dictModule', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: dictModule || '',
                            })(<Input placeholder="请输入..." />)}
                        </Form.Item>

                        <Form.Item label="字典类型">
                            {getFieldDecorator('dictType', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: dictType || '',
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="字典代码">
                            {getFieldDecorator('dictCode', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: dictCode || '',
                            })(<Input placeholder="请输入..." />)}
                        </Form.Item>

                        <Form.Item label="字典名称">
                            {getFieldDecorator('dictName', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: dictName || '',
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="字典状态">
                            {getFieldDecorator('dictState', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: dictState || '',
                            })(
                                <RadioGroup>
                                    <Radio value="1">使用</Radio>
                                    <Radio value="0">停止</Radio>
                                </RadioGroup>,
                            )}
                        </Form.Item>

                        {/* <Form.Item label="是否能修改">
                            {getFieldDecorator('isModify', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: isModify,
                            })(
                                <Radio.Group>
                                    <Radio value="0">否</Radio>
                                    <Radio value="1">是</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item> */}

                        <Form.Item label="字典排序">
                            {getFieldDecorator('dictSort', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: dictSort || 0,
                            })(<InputNumber placeholder="请输入..." style={{ width: '100%' }} />)}
                        </Form.Item>

                        <Form.Item label="字典备注">
                            {getFieldDecorator('dictRemarks', {
                                // rules: [
                                //     {
                                //         required,
                                //         message: '请输入',
                                //     },
                                // ],
                                initialValue: dictRemarks || '',
                            })(<Input placeholder="请输入..." />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}
DropdownValueEdit.defaultProps = {
    title: '编辑字典',
    record: {
        id: '',
        dictModule: '',
        dictType: '',
        dictCode: '',
        dictName: '',
        dictState: '',
        isModify: '',
        dictSort: '',
        dictRemarks: '',
    },
};
export default Form.create()(DropdownValueEdit);

