import React, { useEffect, useRef, useImperativeHandle, useContext, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
} from 'antd';
import moment from 'moment';
import { FatherContext } from '../Workorder';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const Operatorconfirmaedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles, flowNodeName } = props;
  const { flowtype, setFlowtype } = useContext(FatherContext);
  const { getFieldDecorator } = props.form;

  const [fileslist, setFilesList] = useState([]);
  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    confirm,
    useInfo,
  } = props;

  const onChange = (e) => {
    setFlowtype(e.target.value);
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={23}>
          <Form.Item label='确认结果' {...forminladeLayout}>
            {getFieldDecorator('confirmResult', {
              rules: [
                {
                  required,
                  message: '请输入确认结果'
                }
              ],
              initialValue: confirm.confirmResult
            })(
              <Radio.Group onChange={onChange}>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </Radio.Group>
            )
            }
          </Form.Item>
        </Col>
        <Col span={23}>
          <Form.Item label='确认时间' {...forminladeLayout}>
            {
              getFieldDecorator('confirmTime', {
                rules: [
                  {
                    required,
                    message: '请输入审核时间'
                  }
                ],
                initialValue: moment(confirm.confirmTime)
              })(
                <DatePicker
                  showTime
                  format='YYYY-MM-DD HH:mm:ss'
                />
              )
            }
          </Form.Item>
        </Col>
        {
          flowtype === '1' && (
            <Col span={23}>
              <Form.Item label='确认意见' {...forminladeLayout}>
                {
                  getFieldDecorator('confirmContent', {
                    initialValue: confirm.confirmContent,
                  })(
                    <TextArea />
                  )
                }

              </Form.Item>
            </Col>
          )
        }
        {
          flowtype === '0' && (
            <Col span={23}>
              <Form.Item label='确认意见' {...forminladeLayout}>
                {
                  getFieldDecorator('confirmContent', {
                    rules: [
                      {
                        required,
                        message: '请输入审核意见'
                      }
                    ],
                    initialValue: confirm.confirmContent,
                  })(
                    <TextArea />
                  )
                }

              </Form.Item>
            </Col>
          )
        }

        {
          flowNodeName === '系统运维商确认' && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        {
          flowNodeName === '自动化科业务人员确认' && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        {
          flowNodeName === '问题登记人员确认' && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div style={{ width: 400 }}>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        <Col span={8}>
          <Form.Item label='确认人'>
            {
              getFieldDecorator('confirmUser', {
                initialValue: useInfo.userName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='确认人单位'>
            {
              getFieldDecorator('confirmUnit', {
                initialValue: useInfo.unitName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='确认人部门'>
            {
              getFieldDecorator('confirmDept', {
                initialValue: useInfo.deptName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

      </Form>
    </Row>
  )
})

Operatorconfirmaedit.defaultProps = {
  confirm: {
    confirmResult: '1',
    confirmTime: moment().format(),
    confirmContent: '',
  },

  useInfo: {
    userName: '',
    deptNameExt: ''
  }
}


export default Form.create({})(Operatorconfirmaedit);
