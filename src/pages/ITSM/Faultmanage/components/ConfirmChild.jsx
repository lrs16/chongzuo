import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker, Radio, Select } from 'antd';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import SysDict from '@/components/SysDict';

const { TextArea } = Input;
const { Option } = Select;

const ConfirmChild = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    confirm,
    main,
    curruserinfo,
    ChangeFiles,
    ChangeResult,
    location,
  } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [adopt, setAdopt] = useState('1');
  const [selectdata, setSelectData] = useState([]);

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const required = true;

  useEffect(() => {
    if (confirm !== undefined) {
      setAdopt(confirm.confirmResult);
      ChangeResult(confirm.confirmResult);
    }
  }, []);

  const onChange = e => {
    setAdopt(e.target.value);
    ChangeResult(e.target.value);
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const responsible = getTypebyTitle('故障责任方');

  return (
    <Row gutter={24}>
      <SysDict
        typeid="333"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="确认结果">
            {getFieldDecorator('confirmResult', {
              rules: [
                {
                  required,
                  message: '请选择确认结果',
                },
              ],
              initialValue: confirm ? confirm.confirmResult : '1',
            })(
              <Radio.Group onChange={onChange}>
                <Radio value="1">通过</Radio>
                <Radio value="0">不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="故障责任方">
            {getFieldDecorator('confirmBlame', {
              rules: [
                {
                  required,
                  message: '请输入故障责任方',
                },
              ],
              initialValue: main ? main.blame : '',
            })(
              <Select placeholder="请选择" allowClear>
                {responsible.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="确认时间">
            {getFieldDecorator('confirmTime', {
              rules: [
                {
                  required,
                  message: '请选择确认时间',
                },
              ],
              initialValue: confirm.confirmTime ? moment(confirm.confirmTime) : moment(new Date()),
            })(
              <>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  defaultValue={moment(
                    confirm && confirm.confirmTime ? confirm.confirmTime : new Date(),
                  )}
                  onChange={v => {
                    setFieldsValue({ confirmTime: moment(v) });
                  }}
                  style={{ width: '100%' }}
                />
              </>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          {adopt === '1' && (
            <Form.Item label="确认说明" {...forminladeLayout}>
              {getFieldDecorator('confirmContent1', {
                rules: [{ required: false, message: '请输入确认说明' }],
                initialValue: confirm ? confirm.confirmContent : '',
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === '0' && (
            <Form.Item label="确认说明" {...forminladeLayout}>
              {getFieldDecorator('confirmContent2', {
                rules: [{ required: true, message: '请输入确认说明' }],
                initialValue: confirm ? confirm.confirmContent : '',
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
        </Col>

        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            {location &&
            (!location.state || (location.state && !location.state.cache)) && ( // 位置已调
                <div>
                  <SysUpload
                    fileslist={
                      confirm && confirm.confirmAttachments
                        ? JSON.parse(confirm.confirmAttachments)
                        : []
                    }
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                  />
                </div>
              )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="确认人">
            {getFieldDecorator('confirmUser', {
              initialValue: confirm.confirmUser || curruserinfo.userName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="确认人单位">
            {getFieldDecorator('confirmUnit', {
              initialValue: confirm.confirmUnit || curruserinfo.unitName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="确认人部门">
            {getFieldDecorator('confirmDept', {
              initialValue: confirm.confirmDept || curruserinfo.deptName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

ConfirmChild.defaultProps = {
  confirm: {
    confirmDept: '',
    confirmUnit: '',
    confirmUser: '',
    confirmAttachments: '',
    confirmContent: '',
    confirmResult: '1',
    confirmTime: '',
    // blame:''
  },
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: '',
  },
};

export default Form.create({})(ConfirmChild);
