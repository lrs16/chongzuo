import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
const { TextArea } = Input;
const statusContent = ['待审核', '已审核',null]
const color = ['blue', 'green','blue']
// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function CheckModel(props) {
  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    children,
    selectedRows,
    userinfo,
    checkSubmit
  } = props;
  const required = true;
  const [state, setState] = useState(false);
  const [checktype, setChecktype] = useState('1')
  const [data, setData] = useState([]);
  const [flowtype, setFlowtype] = useState('001');

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
    console.log(1)
    validateFields((err, values) => {
      if (!err) {
        props.checkSubmit(values);
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
        width={1000}
        centered='true'
        maskClosable='true'
        onCancel={hanldleCancel}
        onOk={handleSubmit}
      >
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='审核结果'>
                {getFieldDecorator('check_result', {
                  rules: [
                    {
                      required,
                      message: '请输入审核结果'
                    }
                  ],
                })(
                  <Radio.Group
                    // disabled={type === 'list'}
                    onChange={onChange}
                  >
                    <Radio value='001'>通过</Radio>
                    <Radio value='002'>不通过</Radio>
                  </Radio.Group>
                )
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="审核时间">
                {getFieldDecorator('check_checkTime', {
                  rules: [
                    {
                      required,
                      message: '请输入审核时间'
                    }
                  ],
                  initialValue: moment(new Date()),
                })(
                  <DatePicker
                    // disabled={type === 'list'}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />)}
              </Form.Item>
            </Col>

            {/* {
          flowtype === '1' && ( */}
            <Col span={8}>
              <Form.Item label='审核状态'>
                {
                  getFieldDecorator('check_status', {
                  })(
                    <Tag
                      color={color[0]}>待审核</Tag>
                  )
                }
              </Form.Item>
            </Col>
            {/* )
         } */}

            {
              flowtype === '002' && (
                <Col span={23}>
                  <Form.Item label='审核说明' {...forminladeLayout}>
                    {
                      getFieldDecorator('check_content', {
                        rules: [
                          {
                            required,
                            message: '请输入审核说明'
                          }
                        ],
                      })(
                        <TextArea
                        // disabled={type === 'list'}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
              )
            }

            {
              flowtype === '001' && (
                <Col span={23}>
                  <Form.Item label='审核说明' {...forminladeLayout}>
                    {
                      getFieldDecorator('check_content', {
                      })(
                        <TextArea
                        // disabled={type === 'list'}
                        />
                      )
                    }
                  </Form.Item>
                </Col>
              )
            }


            <Col span={8}>
              <Form.Item label="审核人">
                {getFieldDecorator('check_checkUser', {
                  initialValue: userinfo.userName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="审核单位">
                {getFieldDecorator('check_checkUnit', {
                  initialValue: userinfo.unitName,
                })(<Input disabled />)}
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
