import React, { useContext, useRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Tag,
  Select
} from 'antd';
import moment from 'moment';
import { FatherContext } from '../Work';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;
let startTime;
let endTime;

const TaskExecute = React.forwardRef((props, ref) => {
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
    form: { getFieldDecorator, setFieldsValue },
    formItemLayout,
    forminladeLayout,
    files,
    ChangeFiles,
    execute,
    type,
    userinfo,
    taskResult
  } = props;

  let checkTime;
  let checkResult;
  // if (check) {
  //   if (check.checkTime) {
  //     checkTime = moment(check.checkTime);
  //   } else {
  //     checkTime = moment(new Date())
  //   }
  // } else {
  //   checkTime = moment(new Date())
  // }

  const onChange = (date, dateString) => {
    setFieldsValue({ plannedStarTtime: moment(dateString) })
    startTime = dateString;
  }

  const endtimeonChange = (date, dateString) => {
    setFieldsValue({ plannedEndTime: moment(dateString) })
    endTime = dateString;
  }

  const startdisabledDate = (current) => {
    if (startTime || endTime) {
      return current > moment(endTime)
    }
  }

  const enddisabledDate = (current) => {
    if (startTime || endTime) {
      return current < moment(startTime)
    }
  }

  // useEffect(() => {
  //   startTime = check.startTime;
  //   endTime = check.endTime;
  // }, [])


  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='作业结果'>
            {getFieldDecorator('result', {
              rules: [
                {
                  required,
                  message: '请输入审核结果'
                }
              ],
              initialValue: execute.checkResult
            })(
              <Select
              placeholder="请选择"
              allowClear
              disabled={type === 'list'}
            >
              {taskResult.map(obj => [
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>,
              ])}
            </Select>,
            )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="实际开始时间">
            {getFieldDecorator('start_time', {
              rules: [
                {
                  required,
                  message: '请输入审核时间'
                }
              ],
              initialValue: execute.startTime,
            })(
              <DatePicker
                onChange={onChange}
                disabledDate={startdisabledDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                disabled={type === 'list'}
              />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="实际结束时间">
            {getFieldDecorator('end_time', {
              rules: [
                {
                  required,
                  message: '请输入审核时间'
                }
              ],
              initialValue: execute.endTime,
            })(<DatePicker
              onChange={endtimeonChange}
              disabledDate={enddisabledDate}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabled={type === 'list'}
            />)}
          </Form.Item>
        </Col>


        <Col span={23}>
          <Form.Item label='作业执行情况说明' {...forminladeLayout}>
            {
              getFieldDecorator('content', {
                rules: [
                  {
                    required,
                    message: '请输入作业执行情况说明'
                  }
                ],
                initialValue: execute.checkOpinion
              })(
                <TextArea disabled={type === 'list'}/>
              )
            }
          </Form.Item>
        </Col>

        
        <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('main_fileIds', {})
                (
                  <div style={{ width: 400 }}>
                    <SysUpload
                      fileslist={files}
                      ChangeFileslist={newvalue => setFilesList(newvalue)}
                    />
                  </div>
                )}
            </Form.Item>
          </Col>


        <Col span={24}>
          <Form.Item label="执行操作时间" {...forminladeLayout}>
            {getFieldDecorator('operation_time', {
              initialValue: execute.operationTime,
            })(
              <DatePicker
                disabled
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="执行人">
            {getFieldDecorator('check_user', {
              initialValue: userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="执行单位">
            {getFieldDecorator('check_unit', {
              initialValue: userinfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

TaskExecute.defaultProps = {
  execute: {
    startTime: moment(new Date()),
    endTime: moment(new Date()),
    reslut:'',
    checkOpinion:'',
    operationTime:moment(new Date()),
  }
}

export default Form.create({})(TaskExecute);
