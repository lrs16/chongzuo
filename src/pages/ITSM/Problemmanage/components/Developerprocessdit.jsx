import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';

const { Option } = Select;
const { TextArea } = Input;
let handleTime;
let planTime;
const Developerprocessdit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles } = props;
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
    showEdit,
    useInfo,
    handle,
    handleresult
  } = props;
  if (handle.handleTime !== null) {
    handleTime = moment(handle.handleTime)
  } else {
    handleTime = moment(new Date());
  }

  if (handle.planEndTime !== null) {
    planTime = moment(handle.planEndTime)
  } else {
    planTime = moment(new Date());
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='接单时间'>
            {getFieldDecorator('orderReceivingtime', {
              initialValue: moment(handle.addTime)
            })(<DatePicker
              showTime
              disabled='true'
            />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="计划完成时间">
            {getFieldDecorator('planEndTime', {
              rules: [
                {
                  required,
                  message: '请输入计划完成时间',
                },
              ],
              initialValue: planTime,
            })((<DatePicker
              showTime
              disabled={showEdit}
            />))}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理完成时间">
            {getFieldDecorator('handleTime', {
              rules: [
                {
                  required,
                  message: '请输入处理完成时间',
                },
              ],
              initialValue: handleTime,
            })((<DatePicker
              showTime
              disabled={showEdit}
            />))}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理结果">
            {getFieldDecorator('handleResult', {
              rules: [
                {
                  required,
                  message: '请选择处理结果'
                }
              ],
              initialValue: handle.handleResult,
            })(
              <Select placeholder="请选择" disabled={showEdit}>
                {
                  handleresult && handleresult.length && (
                    handleresult.map(({ key, val }) => (
                      <Option key={key} value={val}>
                        {val}
                      </Option>
                    ))
                  )
                }
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={22}>
          <Form.Item label="解决方案" {...forminladeLayout}>
            {getFieldDecorator('handleContent', {
              rules: [
                {
                  required,
                  message: '请输入解决方案'
                }
              ],
              initialValue: handle.handleContent,
            })(<TextArea disabled={showEdit} />)}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
          >
            <div style={{ width: 400 }}>
              <SysUpload
                fileslist={files}
                ChangeFileslist={newvalue => setFilesList(newvalue)}
              />
            </div>

          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item label="处理人">
            {getFieldDecorator('handler', {
              initialValue: useInfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理单位">
            {getFieldDecorator('handleUnit', {
              initialValue: useInfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理部门">
            {getFieldDecorator('handleDept', {
              initialValue: useInfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

      </Form>
    </Row>
  );
});

Developerprocessdit.defaultProps = {
  handle: {
    addtime: moment().format(),
    handleTime: moment().format(),
    handleResult: '',
    handleContent: '',
    planEndTime:moment().format()
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  }
}

export default Form.create({})(Developerprocessdit);
