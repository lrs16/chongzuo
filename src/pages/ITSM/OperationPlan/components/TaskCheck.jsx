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
    executestatus,
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

  const statusContent = ['待审核', '已审核',]
  const color = ['blue', 'green']
  let checkTime;
  let checkResult;
  if (check) {
    if (check.checkTime) {
      checkTime = moment(check.checkTime);
    } else {
      checkTime = moment(new Date())
    }
  } else {
    checkTime = moment(new Date())
  }

  if (check) {
    if (check.checkResult) {
      checkResult = check.checkResult;
    } else {
      checkResult = '1'
    }
  } else {
    checkResult = '1'
  }

  const onChange = (e) => {
    setFlowtype(e.target.value);
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='审核结果'>
            {getFieldDecorator('check_Result', {
              rules: [
                {
                  required,
                  message: '请输入审核结果'
                }
              ],
              initialValue: check.checkResult
            })(
              <Radio.Group
                // disabled={type === 'list'}
                onChange={onChange}
              >
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </Radio.Group>
            )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('check_time', {
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
              getFieldDecorator('status', {
                initialValue: check.checkOpinion
              })(
                <Tag
                  color={color[statusContent.indexOf(checkoutstatus)]}>{checkoutstatus}</Tag>
              )
            }
          </Form.Item>
        </Col>
        {/* )
         } */}

        {
          flowtype === '0' && (
            <Col span={23}>
              <Form.Item label='审核说明' {...forminladeLayout}>
                {
                  getFieldDecorator('checkOpinion', {
                    rules: [
                      {
                        required,
                        message: '请输入审核说明'
                      }
                    ],
                    initialValue: check.checkOpinion
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
          flowtype === '1' && (
            <Col span={23}>
              <Form.Item label='审核说明' {...forminladeLayout}>
                {
                  getFieldDecorator('checkOpinion', {
                    initialValue:check.checkOpinion
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
            {getFieldDecorator('check_user', {
              initialValue: userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核单位">
            {getFieldDecorator('check_unit', {
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
    checkOpinion:'',
    checkTime:moment(new Date()),
    checkResult:'',
  }
}

export default Form.create({})(TaskCheck);
