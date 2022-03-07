import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;

const ExecuteworkEditfillin = React.forwardRef((props, ref) => {

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
    executeResult,
    userinfo,
    execute,
    showEdit,
    location,
  } = props;

  const [fileslist, setFilesList] = useState([]);

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  const required = true;

  const disabledDate = (current) => {
    return current && current < moment(execute.startTime);
  }

  return (
    <div style={{ paddingRight: 24, marginTop: 24 }}>
      <Row gutter={16}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label='工作执行结果'>
              {getFieldDecorator('execute_result', {
                rules: [
                  {
                    required,
                    message: '请输入工作执行结果'
                  }
                ],
                initialValue: execute && execute.result ? execute.result : ''
              })(
                <Select
                  placeholder="请选择"
                  allowClear
                  disabled={!showEdit}
                >
                  {executeResult.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
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
              {getFieldDecorator('execute_startTime', {
                rules: [
                  {
                    required,
                    message: '请输入实际开始时间'
                  }
                ],
                initialValue: execute.startTime === null ? moment(new Date()) : moment(execute.startTime)
              })(<>
                <DatePicker
                  disabled={!showEdit}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  defaultValue={moment(execute.startTime === null ? new Date() : execute.startTime)}
                  onChange={(v) => { setFieldsValue({ execute_startTime: moment(v) }) }}
                /></>)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="实际结束时间">
              {getFieldDecorator('execute_endTime', {
                rules: [
                  {
                    required,
                    message: '请输入实际结束时间'
                  }
                ],
                initialValue: execute.endTime === null ? moment(new Date()) : moment(execute.endTime),
              })(<><DatePicker
                showTime
                disabled={!showEdit}
                sabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={moment(execute.endTime === null ? new Date() : execute.endTime)}
                onChange={(v) => { setFieldsValue({ execute_endTime: moment(v) }) }}
              /></>)}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="工作执行情况说明" {...forminladeLayout}>
              {getFieldDecorator('execute_content', {
                rules: [{ required, message: '请输入工作执行情况说明' }],
                initialValue: execute && execute.content ? execute.content : ''
              })(
                <TextArea
                  disabled={!showEdit}
                  rows={4} />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('execute_fileIds', {
                initialValue: execute && execute.fileIds ? execute.fileIds : '',
              })
                ( // 位置已调
                  <div>
                    {
                      location && (!location.state || (location.state && !location.state.cache)) && (
                        <SysUpload
                          fileslist={files}
                          disabled={!showEdit}
                          ChangeFileslist={newvalue => setFilesList(newvalue)}
                        />
                      )
                    }
                  </div>
                )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="执行操作时间">
              {getFieldDecorator('execute_executeTime', {
                initialValue: moment(new Date()),
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
              {getFieldDecorator('execute_executeUser', {
                initialValue: userinfo.userName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

ExecuteworkEditfillin.defaultProps = {
  execute: {
    startTime: moment(new Date()),
    endTime: moment(new Date()),
    result: '',
  }
}

export default Form.create({})(ExecuteworkEditfillin);
