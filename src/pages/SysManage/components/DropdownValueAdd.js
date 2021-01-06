import React, { Component } from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';

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

class DropdownValueAdd extends Component {
    state = {
        visible: false,
        inputValue: ''
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

    handleInputValueFous = () => {
        this.props.form.setFieldsValue({ dictModule: '' });
    }

    handleInputValueBlur = e => {
        const { value } = e.target;
        this.setState({inputValue: value});
        this.props.form.validateFields((err, values) => {
          const { dictModule } = values;
          if (dictModule === this.state.inputValue || dictModule === '') {
            this.props.form.setFieldsValue({ dictModule:  this.state.inputValue});
          } else {
            this.props.form.setFieldsValue({ dictModule });
          }
        });
    }

    render() {
        const { visible } = this.state;
        const { children, title } = this.props;
        const { getFieldDecorator } = this.props.form;
        // const required = true;

        return (
            <>
                {withClick(children, this.handleopenClick)}
                <Modal
                    title={title}
                    visible={visible}
                    centered
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    width={650}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="字典模块">
                            {getFieldDecorator('dictModule', {
                                // rules: [
                                //     {
                                //         required,
                                //         message: '请输入',
                                //     },
                                // ],
                                initialValue: this.state.inputValue,
                            })(<Input placeholder="请输入..." onFocus={this.handleInputValueFous} onBlur={this.handleInputValueBlur} />)}
                            {/* <Input placeholder="请输入..." onFocus={() => this.handleInputValueFous()} onBlur={() => this.handleInputValueBlur()} /> */}
                        </Form.Item>

                        <Form.Item label="字典类型">
                            {getFieldDecorator('dictType', {
                            })(<Input placeholder="请输入..."/>)}
                        </Form.Item>

                        <Form.Item label="字典代码">
                            {getFieldDecorator('dictCode', {
                                // rules: [
                                //     {
                                //         required,
                                //         message: '请输入',
                                //     },
                                // ],
                            })(<Input placeholder="请输入..." />)}
                        </Form.Item>

                        <Form.Item label="字典名称">
                            {getFieldDecorator('dictName', {
                            })(<Input placeholder="请输入..."/>)}
                        </Form.Item>

                        <Form.Item label="字典排序">
                            {getFieldDecorator('dictSort', {
                            })(<InputNumber style={{width: '100%'}} placeholder="请输入数字..."/>)}
                        </Form.Item>

                        <Form.Item label="字典备注">
                            {getFieldDecorator('dictRemarks', {
                                // rules: [
                                //     {
                                //         required,
                                //         message: '请输入',
                                //     },
                                // ],
                            })(<Input placeholder="请输入..." />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}
DropdownValueAdd.defaultProps = {
    title: '添加下拉值',
    record: {
        dictModule: '',
        dictType: '',
        dictCode: '',
        dictName: '',
        dictSort: '',
        dictRemarks: '',
    },
};
export default Form.create()(DropdownValueAdd);
