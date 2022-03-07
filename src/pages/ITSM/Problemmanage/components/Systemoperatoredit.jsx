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

const Systemoperatoredit = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    files, ChangeFiles,
    flowNodeName,
    allInfo,
  } = props;
  let secondFiles = [];
  if (flowNodeName === '自动化科审核') {
    if (allInfo.editState !== undefined && (allInfo.editState === 'add')) {
      secondFiles = [];
    } else {
      secondFiles = files;
    }
  }
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
    check,
    useInfo,
    defaultRadio
  } = props;

  useEffect(() => {
    if (check) {
      setFlowtype(check.checkResult);
    }
  }, [check]);

  const onChange = e => {
    setFlowtype(e.target.value);
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form  {...formItemLayout}>
        <Col span={23}>
          <Form.Item label='审核结果' {...forminladeLayout}>
            {getFieldDecorator('checkResult', {
              rules: [
                {
                  required,
                  message: '请输入审核结果'
                }
              ],
              initialValue: check.checkResult
            })(
              <Radio.Group onChange={onChange}>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </Radio.Group>
            )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('checkTime', {
              rules: [
                {
                  required,
                  message: '请输入审核时间'
                }
              ],
              initialValue: check.checkTime ? moment(check.checkTime) : moment(Date.now()),
            })(<DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />)}
          </Form.Item>
        </Col>


        <Col span={23}>
          {
            flowtype === '1' && (
              <Col span={23}>
                <Form.Item label='审核意见' {...forminladeLayout}>
                  {
                    getFieldDecorator('checkOpinion1', {
                      initialValue: check.checkOpinion
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
              <Form.Item label='审核意见' {...forminladeLayout}>
                {
                  getFieldDecorator('checkOpinion2', {
                    rules: [
                      {
                        required,
                        message: '请输入审核意见'
                      }
                    ],
                    initialValue: check.checkOpinion
                  })(
                    <TextArea />
                  )
                }
              </Form.Item>
            )
          }
        </Col>



        {
          flowNodeName === '系统运维商审核' && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                {
                  getFieldDecorator('checkAttachments', {
                    rules: [
                      {
                        required,
                        message: '请上传附件'
                      }
                    ],
                    initialValue: (check && check.checkAttachments !== '[]') ? check.checkAttachments : ''
                  })(<div>
                    <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                  </div>)
                }

              </Form.Item>
            </Col>
          )
        }

        {
          flowNodeName === '自动化科审核' && (allInfo.editState === 'edit') && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
                  <SysUpload fileslist={secondFiles} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        {
          allInfo.editState !== undefined && (allInfo.editState === 'add') && flowNodeName === '自动化科审核' && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
                  <SysUpload fileslist={[]} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }


        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('checkUser', {
              initialValue: useInfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核单位">
            {getFieldDecorator('checkUnit', {
              initialValue: useInfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核部门">
            {getFieldDecorator('checkDept', {
              initialValue: useInfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  )
})

Systemoperatoredit.defaultProps = {
  check: {
    checkOpinion: '',
    // checkTime: moment().format(),
    checkResult: '1',
    checkAttachments: ''
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  }
}

export default Form.create({})(Systemoperatoredit);
