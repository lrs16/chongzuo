import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Row,
  Col,
  Select,
} from 'antd';
import moment from 'moment';
import SysDict from '@/components/SysDict';

const { TextArea } = Input;
const { Option } = Select;



const Register = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    userinfo,
    register
  } = props;

  const [selectdata, setSelectData] = useState('');

  const required = true;


  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  )

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
  }

  const primaryIndex = getTypebyTitle('一级指标');
  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid='1410413049587699713'
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {
        primaryIndex && (
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='服务绩效编号'>
                {
                  getFieldDecorator('no', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='发生时间'>
                {
                  getFieldDecorator('params1', {
                    rules: [
                      {
                        required,
                        message: '请选择发生时间'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='服务商'>
                {
                  getFieldDecorator('params2', {
                    rules: [
                      {
                        required,
                        message: '请输入服务商'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='关联合同名称'>
                {
                  getFieldDecorator('params3', {
                    rules: [
                      {
                        required,
                        message: '请输入关联合同名称'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='责任人'>
                {
                  getFieldDecorator('params4', {
                    rules: [
                      {
                        required,
                        message: '请输入责任人'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='评分细则名称'>
                {
                  getFieldDecorator('params5', {
                    rules: [
                      {
                        required,
                        message: '请输入评分细则名称'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核类型'>
                {
                  getFieldDecorator('params6', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='考核内容说明' {...forminladeLayout}>
                {
                  getFieldDecorator('params7', {
                    rules: [
                      {
                        required,
                        message: '请输入考核内容说明'
                      }
                    ]
                  })
                    (<TextArea
                      autoSize={{ minRows: 3 }}
                      placeholder='请控制字数在500字以内'
                      maxLength='500'
                    />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='一级指标'>
                {
                  getFieldDecorator('params8', {
                    rules: [
                      {
                        required,
                        message: '请输入一级指标'
                      }
                    ]
                  })
                    (
                      <Select placeholder='请选择' allowClear>
                        {primaryIndex.map(obj => [
                          <Option key={obj.key} value={obj.dict_code}>
                            {obj.title}
                          </Option>
                        ])}
                      </Select>
                    )
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label=' 二级指标'>
                {
                  getFieldDecorator('params9', {
                    rules: [
                      {
                        required,
                        message: '请输入二级指标'
                      }
                    ]

                  })
                    (
                      <Select placeholder='请选择' allowClear>
                        {primaryIndex.map(obj => [
                          <Option key={obj.key} value={obj.dict_code}>
                            {obj.title}
                          </Option>
                        ])}
                      </Select>
                    )
                }
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='详细条款' {...forminladeLayout}>
                {
                  getFieldDecorator('params11', {
                    rules: [
                      {
                        required,
                        message: '请输入详细条款'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核得分'>
                {
                  getFieldDecorator('params22', {
                    rules: [
                      {
                        required,
                        message: '请输入考核得分'
                      }
                    ]
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='考核状态'>
                {
                  getFieldDecorator('params33', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='备注' {...forminladeLayout}>
                {
                  getFieldDecorator('params44', {})
                    (<TextArea autoSize={{ minRows: 3 }} placeholder='请输入' />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='上传附件'>
                {
                  getFieldDecorator('params55', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='登记人'>
                {
                  getFieldDecorator('params66', {
                    initialValue: userinfo.userName
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label='登记时间'>
                {
                  getFieldDecorator('params77', {
                    initialValue:register.registerTime
                  })
                    (<DatePicker />)
                }
              </Form.Item>
            </Col>

          </Form>

        )
      }

    </Row>
  )
})

Register.defaultProps = {
  register: {
    registerTime:moment(new Date())
  }
}

export default Form.create({})(Register)
