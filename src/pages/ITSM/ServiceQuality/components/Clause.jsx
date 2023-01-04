import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  message
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;


const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function Clause(props) {
  const [visible, setVisible] = useState(false);
  const [scoreVisible, setScoreVisible] = useState(true);
  const {
    form: { getFieldDecorator},
    title,
    formItemLayout,
    clause,
    children,
    submitClause,
    id,
  } = props;
  const required = true;

  const handleopenClick = () => {
    if (id) {
      setVisible(true);
    } else {
      message.error('请先保存评分细则才能新增详细条款哦！')
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const selectChange = (value) => {
    if (value === '扣分项') {
      setScoreVisible(false);
    } else {
      setScoreVisible(true);
    }
  }

  const handleOk = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        if (values.score > 5) {
          message.info('分值不可超过二级指标满分分值')
        }

        const submitData = {
          ...values,
          id: clause.id,
          calc:values.calc === '加分项' ?'ADD':'SUB',
          title,
          score: scoreVisible ? values.score : `-${values.score}`
        }

        submitClause(submitData);
        setVisible(false)
      }
    })
  }

  // const negativeCheck = /[-]/;
  // const positivenumberCheck = /^\d*$/;
  // const validatorNegative = (rule, value, callback) => {
  //   if (value && rule.pattern && !value.match(rule.pattern)) {
  //     callback(rule.message);
  //   } else {
  //     callback()
  //   }
  // }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={720}
        centered='true'
        maskClosable='true'
        destroyOnClose='true'
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label='评价类型'>
            {getFieldDecorator('calc', {
              rules: [
                {
                  required,
                  message: '请选择评价类型'
                }
              ],
              initialValue: clause.calc
            })
              (
                <Select onChange={selectChange}>
                  <Option value='加分项'>加分项</Option>
                  <Option value='扣分项'>扣分项</Option>
                </Select>
              )
            }
          </Form.Item>

          <Form.Item label='详细条款'>
            {getFieldDecorator('detailed', {
              rules: [
                {
                  required,
                  message: '请输入详细条款'
                }
              ],
              initialValue: clause.detailed
            })
              (<TextArea rows={4} />)
            }
          </Form.Item>
          {/* 
          {
            scoreVisible === true && ( */}
          <Form.Item label='分值'>
            {getFieldDecorator('scoreValue', {
              rules: [
                {
                  required,
                  message: '请输入分值',
                },
              ],
              initialValue: clause.scoreValue
            })
              (<Input />)
            }
          </Form.Item>
          {/* //   )
          // } */}

          {/* {
            scoreVisible === false && (
              <Form.Item label='分值'>
              {getFieldDecorator('score', {
                rules: [
                  {
                    required,
                    message: '请输入分值',
                  },
                  
                  {
                    pattern: negativeCheck,
                    validator: validatorNegative,
                    message: '请输入负数'
                  }
                ],
                initialValue: clause.score
              })
                (<Input />)
              }
            </Form.Item>
            )
          }
          */}

          <Form.Item label='数据来源'>
            {getFieldDecorator('sources', {
              initialValue: clause.sources
            })
              (<TextArea rows={4} />)
            }
          </Form.Item>

          <Form.Item label='扣分说明'>
            {getFieldDecorator('remark', {
              initialValue: clause.remark
            })
              (<TextArea rows={4} />)
            }
          </Form.Item>
        </Form>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>取消</Button>
          <Button onClick={handleOk} type='primary'>确定</Button>
        </div>
      </Drawer>
    </>
  )

}

Clause.defaultProps = {
  clause: {
    calc: '',
    detailed: '',
    scoreValue: '',
    sources: '',
    remark: '',
  }
}

export default Form.create({})(Clause)