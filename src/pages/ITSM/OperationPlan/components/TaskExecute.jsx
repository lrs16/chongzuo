import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import FormTextArea from './FormTextArea';
import SysUpload from '@/components/SysUpload';

import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;
let startTime;
let endTime;

const TaskExecute = React.forwardRef((props, ref) => {
  const [fileslist, setFilesList] = useState([]);

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
    taskResult,
  } = props;

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  const onChange = (date, dateString) => {
    setFieldsValue({ execute_startTime: moment(dateString) });
    startTime = dateString;
  };
  // 暂时保留

  const endtimeonChange = (date, dateString) => {
    setFieldsValue({ execute_endTime: moment(dateString) });
    endTime = dateString;
  };

  const startdisabledDate = current => {
    return current > moment(endTime || (execute && execute.endTime) || new Date());
  };

  const enddisabledDate = current => {
    return current < moment(startTime || (execute && execute.startTime) || new Date());
  };

  const required = true;

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="作业结果">
            {getFieldDecorator('execute_result', {
              rules: [
                {
                  required,
                  message: '请输入作业结果',
                },
              ],
              initialValue: execute.result,
            })(
              <Select
                placeholder="请选择"
                allowClear={false}
                disabled={type === 'list'}
              >
                {taskResult.map(obj => [
                  <Option key={obj.key} value={obj.dict_code}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="实际开始时间">
            {getFieldDecorator('execute_startTime', {
              rules: [
                {
                  required,
                  message: '请输入实际开始时间',
                },
              ],
              initialValue:
                execute.startTime === null ? moment(new Date()) : moment(execute.startTime),
            })(
              // <div>
              <DatePicker
                // defaultValue={moment(execute.startTime || new Date())}
                onChange={onChange}
                disabledDate={startdisabledDate}
                showTime
                allowClear={false}
                format="YYYY-MM-DD HH:mm:ss"
                disabled={type === 'list'}
              />,
              // </div>
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="实际结束时间">
            {getFieldDecorator('execute_endTime', {
              rules: [
                {
                  required,
                  message: '请输入实际结束时间',
                },
              ],
              initialValue: execute.endTime === null ? moment(new Date()) : moment(execute.endTime),
            })(
              // <div>
              <DatePicker
                onChange={endtimeonChange}
                disabledDate={enddisabledDate}
                showTime
                allowClear={false}
                format="YYYY-MM-DD HH:mm:ss"
                disabled={type === 'list'}
              />,
              // </div>
            )}
          </Form.Item>
        </Col>

        <div className={styles.autoCompleteallowclear}>
          <Col span={24} style={{ marginTop: 4 }}>
            <Form.Item label="作业执行情况说明" {...forminladeLayout}>
              {getFieldDecorator('execute_content', {
                rules: [
                  {
                    required,
                    message: '请输入作业执行情况说明',
                  },
                ],
                initialValue: execute.content,
              })(<FormTextArea
                autoSize={1}
                indexText={execute.content}
                isEdit
                getVal={v => setFieldsValue({ execute_content: v })}
              />)}
            </Form.Item>
          </Col>
        </div>

        <Col span={24} style={{ marginTop: '-6px' }}>
          <Form.Item label="上传附件" {...forminladeLayout}>
            {getFieldDecorator('execute_fileIds', {
              initialValue: execute && execute.fileIds ? execute.fileIds : '',
            })(
              <div>
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              </div>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="执行操作时间" {...forminladeLayout}>
            {getFieldDecorator('execute_operationTime', {
              initialValue: moment(new Date()),
            })(
              <DatePicker
                disabled
                showTime
                allowClear={false}
                format="YYYY-MM-DD HH:mm:ss"
              />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="执行人">
            {getFieldDecorator('execute_operationUser', {
              initialValue: userinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="执行单位">
            {getFieldDecorator('execute_operationUnit', {
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
    startTime: new Date(),
    endTime: new Date(),
    result: '',
    checkOpinion: '',
    // operationTime:new Date(),
  },
};

export default Form.create({})(TaskExecute);
