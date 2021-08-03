import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  Tag,
  DatePicker,
  Select
} from 'antd';
import moment from 'moment';
import SysDict from '@/components/SysDict';

const { TextArea } = Input;
const { Option } = Select;

const AssessmentConfirmation = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    userinfo,
    assessmentConfirmation
  } = props;
  const [selectdata, setSelectData] = useState('');

  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    []
  )

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  }


  const appraisalStatus = getTypebyTitle('考核状态');
  console.log('appraisalStatus: ', appraisalStatus);

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid='1410413049587699713'
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {
        appraisalStatus && (
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='是否申诉'>
                {
                  getFieldDecorator('aa', {})
                    (
                      <Radio.Group disabled='true'>
                        <Radio value='1'>是</Radio>
                        <Radio value='0'>否</Radio>
                      </Radio.Group>
                    )
                }
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='申诉内容' {...forminladeLayout}>
                {
                  getFieldDecorator('aa', {})
                    (
                      <TextArea
                        autosize={{ minRows: 3 }}
                        disabled='true'
                      // placeholder='请输入申诉内容'
                      />
                    )
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='确认结果'>
                {
                  getFieldDecorator('aa', {})
                    (
                      <Radio.Group>
                        <Radio value='1'>确认考核</Radio>
                        <Radio value='0'>取消考核</Radio>
                      </Radio.Group>
                    )
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='确认说明' {...forminladeLayout}>
                {
                  getFieldDecorator('aa', {})
                    (
                      <TextArea
                        autosize={{ minRows: 3 }}
                        placeholder='请输入确认说明'
                      />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='考核类型'>
                {
                  getFieldDecorator('aa', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='考核内容说明' {...forminladeLayout}>
                {
                  getFieldDecorator('aa', {})
                    (
                      <TextArea
                        autosize={{ minRows: 3 }}
                        placeholder='请输入考核内容说明'
                      />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='一级指标'>
                {
                  getFieldDecorator('aa', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='二级指标'>
                {
                  getFieldDecorator('aa', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='评价指标'>
                {
                  getFieldDecorator('aa', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='考核得分'>
                {
                  getFieldDecorator('aa', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='考核状态'>
                {
                  getFieldDecorator('aa', {})
                    (
                      <Select>
                        {appraisalStatus.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ]
                        )}
                      </Select>
                    )
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='详细条款' {...forminladeLayout}>
                {
                  getFieldDecorator('aa', {})
                    (
                      <Input
                      />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='考核得分'>
                {
                  getFieldDecorator('aa', {})
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='确认人'>
                {
                  getFieldDecorator('aa', {
                    initialValue: userinfo.userName
                  })
                    (<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='确认时间'>
                {
                  getFieldDecorator('confirmationtime', {
                    initialValue: assessmentConfirmation.confirmationtime
                  })
                    (
                      <DatePicker
                        format='YYYY-MM-DD HH-MM'
                      />)
                }
              </Form.Item>
            </Col>
          </Form>

        )
      }

    </Row>
  )
})

AssessmentConfirmation.defaultProps = {
  assessmentConfirmation: {
    confirmationtime: moment(new Date())
  }
}

export default Form.create({})(AssessmentConfirmation)

