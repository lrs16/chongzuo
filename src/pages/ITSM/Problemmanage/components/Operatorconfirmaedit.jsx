import React, { useEffect,useRef,useImperativeHandle,useContext,useState  } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Upload,
  Button
} from 'antd';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
import {FatherContext} from '../Workorder';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const Operatorconfirmaedit = React.forwardRef((props,ref) => {
  const { formItemLayout,forminladeLayout,files,ChangeFiles,flowNodeName } = props;
  const {flowtype,setFlowtype } = useContext(FatherContext);
  const { getFieldDecorator } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState([]);
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
  const {
    confirm,
    useInfo,
  } = props;
  console.log(confirm,'confirm');
  const onChange = (e) => {
    setFlowtype(e.target.value);
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form>
        <Col span={23}>
          <Form.Item label='确认结果' {...forminladeLayout}>
          { getFieldDecorator('confirmResult',{
            rules:[
              {
                required,
                message:'请输入确认结果'
              }
            ],
            initialValue:confirm?confirm.confirmResult:'1'
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
              getFieldDecorator('confirmTime',{
                rules:[
                  {
                    required,
                    message:'请输入审核时间'
                  }
                ],
                initialValue: confirm ? moment(confirm.confirmTime) : moment(Date.now())
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
                getFieldDecorator('confirmContent',{
                  initialValue: confirm?confirm.confirmContent:'',
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
            <Form.Item label='确认意见' {...forminladeLayout}>
              {
                getFieldDecorator('confirmContent',{
                  rules:[
                    {
                      required,
                      message:'请输入审核意见'
                    }
                  ],
                  initialValue: confirm?confirm.confirmContent:'',
                })(
                  <TextArea/>
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
              extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div style={{ width: 400 }}>
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              </div>
            </Form.Item>
          </Col>
          )
        }
    
        {
          flowNodeName === '自动化科业务负责人确认' && (
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
          )
        }
    
        {
          flowNodeName === '问题登记人员确认' && (
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
          )
        }
    
        
        <Col span={8}>
          <Form.Item label='确认人'>
            {
              getFieldDecorator('confirmUser',{
                initialValue: useInfo?useInfo.userName:'',
              })(<Input disabled/>)
            }

          </Form.Item>
          
        </Col>
  
        <Col span={8}>
          <Form.Item label='确认人单位'>
            {
              getFieldDecorator('confirmUnit',{
                initialValue: '单位',
              })(<Input disabled/>)
            }
          </Form.Item>

        </Col>
  
        <Col span={8}>
          <Form.Item label='确认人部门'>
            {
              getFieldDecorator('confirmDept',{
                initialValue: useInfo?useInfo.deptNameExt:'',
              })(<Input disabled/>)
            }
          </Form.Item>

        </Col>

      </Form>
    </Row>
  )
})

export default Form.create({})(Operatorconfirmaedit);