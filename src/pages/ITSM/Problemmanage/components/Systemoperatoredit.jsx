import React, { useContext,useRef, useImperativeHandle,useEffect,useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Alert,
  Upload,
  Button
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import {FatherContext} from '../Workorder';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;


const Systemoperatoredit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout,files,ChangeFiles } = props;
  console.log('files: ', files);
  const { getFieldDecorator } = props.form;
  const {flowtype,setFlowtype } = useContext(FatherContext);
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
    useInfo
  } = props;
  let checkTime;
  let checkResult;
  if(check) {
    if(check.checkTime) {
      checkTime = moment(check.checkTime);
    }else {
      checkTime = moment(new Date())
    }
  } else {
    checkTime = moment(new Date())
  }

  if(check) {
    if(check.checkResult) {
      checkResult = check.checkResult;
    }else {
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
        <Col span={23}>
            <Form.Item label='审核结果' {...forminladeLayout}>
            { getFieldDecorator('checkResult',{
              rules:[
                {
                  required,
                  message:'请输入审核结果'
                }
              ],
              initialValue:checkResult
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
              rules:[
                {
                  required,
                  message:'请输入审核时间'
                }
              ],
              initialValue: checkTime,
            })(<DatePicker 
                 showTime 
                 format="YYYY-MM-DD HH:mm:ss" 
            />)}
          </Form.Item>
        </Col>

          {
            flowtype === '1' && (
              <Col span={23}>
              <Form.Item label='审核意见' {...forminladeLayout}>
                {
                  getFieldDecorator('checkOpinion',{
                    initialValue: check ? check.checkOpinion:''
                  })(
                    <TextArea/>
                  )
                }
              </Form.Item>
            </Col>
            )
          }

          {
            flowtype === '0' && (
              <Col span={23}>
              <Form.Item label='审核意见' {...forminladeLayout}>
                {
                  getFieldDecorator('checkOpinion',{
                    rules:[
                      {
                        required,
                        message:'请输入审核意见'
                      }
                    ],
                    initialValue: check ? check.checkOpinion:''
                  })(
                    <TextArea/>
                  )
                }
              </Form.Item>
            </Col>
            )
          }
  
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
          <Form.Item label="审核人">
            {getFieldDecorator('checkUser', {
              // rules: [
              //   {
              //     required,
              //     message: '请输入审核人',
              //   },
              // ],
              initialValue: useInfo?useInfo.loginCode:'',
            })(<Input disabled/>)}
          </Form.Item>
        </Col>
  
        <Col span={8}>
          <Form.Item label="审核单位">
            {getFieldDecorator('checkUnit', {
              initialValue: '单位',
            })(<Input disabled/>)}
          </Form.Item>
        </Col>
  
        <Col span={8}>
          <Form.Item label="审核部门">
            {getFieldDecorator('checkDept', {
             initialValue: useInfo?useInfo.deptNameExt:'',
            })(<Input disabled/>)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

export default Form.create({})(Systemoperatoredit);
