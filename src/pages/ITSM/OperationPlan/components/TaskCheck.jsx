import React, { useContext, useRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Tag
} from 'antd';
import moment from 'moment';
import { FatherContext } from '../Work';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const TaskCheck = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    check,
    formItemLayout,
    forminladeLayout,
    files,
    ChangeFiles,
    userinfo,
    checkStatus,
    checkoutstatus,
    type
  } = props;
  const { flowtype, setFlowtype } = useContext(FatherContext);
  const [fileslist, setFilesList] = useState([]);
 
  // useEffect(() => {
  //   ChangeFiles(fileslist);
  // }, [fileslist]);
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );


  const statusContent = ['待审核', '已审核',null]
  const color = ['blue', 'green','blue']
  let checkTime;
  if (check) {
    if (check.checkTime) {
      checkTime = moment(check.checkTime);
    } else {
      checkTime = moment(new Date())
    }
  } else {
    checkTime = moment(new Date())
  }

  // if (check) {
  //   if (check.result) {
  //     result = check.result;
  //   } else {
  //     result = '1'
  //   }
  // } else {
  //   result = '1'
  // }
  const onChange = (e) => {
    setFlowtype(e.target.value);
  }


  const required = true;

  return (
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
              initialValue: check.result === null ? '001' : check.result
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
              initialValue: checkTime,
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
                initialValue: check.status
              })(
                <Tag
                  color={color[statusContent.indexOf(checkStatus)]}>{checkStatus === null ? '待审核':checkStatus}</Tag>
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
                    initialValue: check.content
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
                    initialValue:check.content
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
  );
});

TaskCheck.defaultProps = {
  check: {
    content:'',
    checkTime:new Date(),
    result:'001',
  }
}

export default Form.create({})(TaskCheck);
