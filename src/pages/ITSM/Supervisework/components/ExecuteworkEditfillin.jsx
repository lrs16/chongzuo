import React, { useRef, useImperativeHandle } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select
} from 'antd';
import moment from 'moment';

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
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    executeResult,
    userinfo
  } = props;

  // const onChange = (date, dateString) => {
  //   setFieldsValue({ plannedStarTtime: moment(dateString) })
  //   startTime = dateString;
  // }

  // const endtimeonChange = (date, dateString) => {
  //   setFieldsValue({ plannedEndTime: moment(dateString) })
  //   endTime = dateString;
  // }

  //   const startdisabledDate = (current) => {
  //     if (startTime || endTime) {
  //       return current > moment(endTime)
  //     }
  //   }

  //   const enddisabledDate = (current) => {
  //     if (startTime || endTime) {
  //       return current < moment(startTime)
  //     }
  //     return null;
  //   }

  const required = true;

  return (
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
              //   initialValue: execute.result
              initialValue: ''
            })(
              <Select
                placeholder="请选择"
                allowClear
              //   disabled={type === 'list'}
              >
                {executeResult.map(obj => [
                  <Option key={obj.key} value={obj.dict_code}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
              <Input />
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
              //   initialValue: execute.startTime === null ? moment(new Date()) : moment(execute.startTime),
              initialValue: moment(new Date())
            })(
              <DatePicker
                // onChange={onChange}
                // disabledDate={startdisabledDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              // disabled={type === 'list'}
              />)}
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
              //   initialValue: execute.endTime === null ? moment(new Date()) : moment(execute.endTime),
              initialValue: moment(new Date())
            })(<DatePicker
              // onChange={endtimeonChange}
              //   disabledDate={enddisabledDate}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />)}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="工作执行情况说明" {...forminladeLayout}>
            {getFieldDecorator('execute_content', {
              rules: [{ required, message: '请输入工作内容' }, {
                // validator: handleFormValidator
              }],
              initialValue: ''
            })(
              <TextArea
                // disabled={type}
                rows={4} />
              // <RichTextEditor cachevalue='' ChangeValue={v => setFieldsValue({ content: v })} />
            )}
          </Form.Item>
        </Col>

        {/* <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('execute_fileIds', {
                 initialValue: execute && execute.fileIds ? execute.fileIds: '',
              })
                (
                  <div style={{ width: 400 }}>
                    <SysUpload
                      fileslist={files}
                      ChangeFileslist={newvalue => setFilesList(newvalue)}
                    />
                  </div>
                )}
            </Form.Item>
          </Col> */}

        <Col span={24}>
          <Form.Item label="执行操作时间" {...forminladeLayout}>
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

        <Col span={8}>
          <Form.Item label="执行单位">
            {getFieldDecorator('execute_oexecuteUnit', {
              initialValue: userinfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

ExecuteworkEditfillin.defaultProps = {
  // execute: {
  //   startTime: new Date(),
  //   endTime: new Date(),
  //   result:'',
  // }
  startTime: new Date(),
  endTime: new Date(),
  result: '',
}

export default Form.create({})(ExecuteworkEditfillin);
