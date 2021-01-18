import React, {  useEffect,useState,useRef, useImperativeHandle } from 'react';
import { 
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Button
  } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import SysUpload from '@/components/SysUpload';

const { Option } = Select;
const { TextArea } = Input;


const Developerprocessdit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout,files,ChangeFiles } = props;
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
    handleTime,
    handle,
    receivingTime
  } = props;

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
      <Col span={8}>
        <Form.Item label='接单时间'>
          { getFieldDecorator('orderReceivingtime',{
             initialValue: receivingTime
          })(<DatePicker
                showTime
                disabled={showEdit}
            />)}
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
            required,
            initialValue: handle ? handle.handleResult : '',
          })(
            <Select disabled={showEdit}>
              <Option key={19} value="根本解决">根本解决</Option>
              <Option key={20} value="替代解决">替代解决</Option>
              <Option key={21} value="需要发布">需要发布</Option>
              <Option key={22} value="误报">误报</Option>
              <Option key={23} value="自动恢复">自动恢复</Option>
            </Select>,
          )}
        </Form.Item>
      </Col>
      <Col span={22}>
        <Form.Item label="解决方案" {...forminladeLayout}>
          {getFieldDecorator('handleContent', {
            rules:[
              {
                required,
                message:'请输入解决方案' 
              }
            ],
            initialValue: handle ? handle.handleContent : '',
          })(<TextArea disabled={showEdit} />)}
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          label="上传附件"
          {...forminladeLayout}
          extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
        >
          <div style={{ width: 400 }}>
            <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
          </div>
        </Form.Item>
      </Col>


      <Col span={8}>
        <Form.Item label="处理人">
          {getFieldDecorator('handler', {
            // rules: [
            //   {
            //     required,
            //     message: '请输入处理人',
            //   },
            // ],
            initialValue: useInfo?useInfo.loginCode:'',
          })(<Input disabled />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="处理单位">
          {getFieldDecorator('handleUnit', {
            initialValue: '单位',
          })(<Input disabled />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="处理部门">
          {getFieldDecorator('handleDept', {
            initialValue: useInfo?useInfo.deptNameExt:'',
          })(<Input disabled />)}
        </Form.Item>
      </Col>
    
    </Form>
  </Row>
  );
});

export default Form.create({})(Developerprocessdit);
