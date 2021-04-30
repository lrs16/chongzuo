import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Tag,
  Radio,
  Row,
  Col,
  message
} from 'antd';
import { ConsoleSqlOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let showAlarmDialog = false;
let showTerminalDialog = false;
let title = '';
let sign = false;
// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};
const formItemdeLayout = {
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

function CheckModel(props) {
  const {
    form: { getFieldDecorator,validateFields },
    dispatch,
    children,
    selectedRows
  } = props;
  const required = true;
  const [state, setState] = useState(false);
  const [checktype,setChecktype] = useState('1')
  const [data, setData] = useState([]);



  const handleopenClick = () => {
    console.log(2)
    if (selectedRows.length === 0) {
      message.info('请至少选择一条数据')
      return false;
    }

    const res = selectedRows.every(item => {
      if (item.checkStatus === '待审核') {
        return item.id;
      }
      
      message.info('请选择执行状态:待审核');
      return false
    })

    if (res === false) {
      return false;
    }

    setState(true);
  };

  const handleSubmit = () => {
    validateFields((err,values) => {
      if(!err) {
        setState(false);
      }
    })
  }

  const onChange = (e) => {
    setChecktype(e.target.value)
  }



  const hanldleCancel = () => {
    setState(false);
  };


  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        title={title}
        visible={state}
        width={720}
        centered='true'
        maskClosable='true'
        onCancel={hanldleCancel}
        onOk={handleSubmit}
      >
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={12}>
              <Form.Item label='审核结果'>
                {
                  getFieldDecorator('id', {
                    rules: [
                      {
                        required,
                        message: '请输入审核结果'
                      }
                    ],
                  })(
                    <Radio.Group
                    onChange={onChange}
                    >
                      <Radio value='1'>通过</Radio>
                      <Radio value='0'>不通过</Radio>
                    </Radio.Group>
                  )
                }
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label='审核时间'>
                {
                  getFieldDecorator('commandType', {
                    rules: [
                      {
                        required,
                        message: '请输入审核时间'
                      }
                    ],
                  })(
                    <DatePicker />
                  )
                }
              </Form.Item>

            </Col>

            <Col span={24}>
              <Form.Item label='审核状态' {...formItemdeLayout}>
                {
                  getFieldDecorator('commandClass', {
                    rules: [
                      {
                        required,
                        message: '请输入审核状态'
                      }
                    ],
                  })(
                    // <Select
                    //   getPopupContainer={triggerNode => triggerNode.parentNode}
                    //   // defaultValue='1'
                    // >
                    //     {classData}
                    // </Select>
                    <Tag color='blue' >待审核</Tag>
                  )
                }
              </Form.Item>
            </Col>

            {
              checktype === '1' && (
                <Col span={24}>
                <Form.Item label='审核说明' {...formItemdeLayout}>
                  {
                    getFieldDecorator('commandName', {
                    })(<Input />)
                  }
                </Form.Item>
                </Col>
              )
            }
            {
              checktype === '0' && (
                <Col span={24}>
                <Form.Item label='审核说明' {...formItemdeLayout}>
                  {
                    getFieldDecorator('commandName', {
                      rules: [
                        {
                          required,
                          message: '请输入审核说明'
                        }
                      ],
                    })(<Input />)
                  }
                </Form.Item>
                </Col>
              )
            }
    

            <Col span={12}>
            <Form.Item label='审核人'>
              {
                getFieldDecorator('commandSrc', {
                })(<Input />)
              }
            </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item label='审核单位'>
              {
                getFieldDecorator('commandSrc', {
                })(<Input />)
              }
            </Form.Item>
            </Col>

          </Form>

        </Row>
      </Modal>

    </>

  );
}

export default Form.create({})(
  connect(({ problemstatistics, loading }) => ({
    statusdetailList: problemstatistics.statusdetailList,
    loading: loading.models.problemstatistics,
  }))(CheckModel),
);
