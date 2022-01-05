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
import { getAndField } from '@/pages/SysManage/services/api';


const { TextArea } = Input;

const Operatorconfirmaedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles, flowNodeName } = props;
  const { flowtype, setFlowtype } = useContext(FatherContext);
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);
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
    confirm,
    useInfo,
  } = props;

  const onChange = (e) => {
    setFlowtype(e.target.value);
  }


  const handletitleSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setTitleAutoData(newdata);
      }
    });
  };

  const handledesSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setDestoData(newdata);
      }
    });
  };
  // 常用语调用
  useEffect(() => {
    handledesSearch({ module: '问题单', field: '回访', key: '' });
  }, []);

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={23}>
          <Form.Item label='确认结果' {...forminladeLayout}>
            {getFieldDecorator('confirmResult', {
              rules: [
                {
                  required,
                  message: '请输入确认结果'
                }
              ],
              initialValue: confirm.confirmResult
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
              getFieldDecorator('confirmTime', {
                rules: [
                  {
                    required,
                    message: '请输入审核时间'
                  }
                ],
                initialValue: confirm.confirmTime ? moment(confirm.confirmTime) : moment(new Date())
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
                  getFieldDecorator('confirmContent1', {
                    initialValue: confirm.confirmContent,
                  })(
                    <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />
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
                  getFieldDecorator('confirmContent2', {
                    rules: [
                      {
                        required,
                        message: '请输入审核意见'
                      }
                    ],
                    initialValue: confirm.confirmContent,
                  })(
                      <TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />
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
              >
                <div>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        {
          flowNodeName === '自动化科业务人员确认' && (
            <Col span={24}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
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
              >
                <div>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        <Col span={8}>
          <Form.Item label='确认人'>
            {
              getFieldDecorator('confirmUser', {
                initialValue: useInfo.userName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='确认人单位'>
            {
              getFieldDecorator('confirmUnit', {
                initialValue: useInfo.unitName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='确认人部门'>
            {
              getFieldDecorator('confirmDept', {
                initialValue: useInfo.deptName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

      </Form>
    </Row>
  )
})

Operatorconfirmaedit.defaultProps = {
  confirm: {
    confirmResult: '1',
    confirmTime: '',
    confirmContent: '',
  },

  useInfo: {
    userName: '',
    deptNameExt: ''
  }
}


export default Form.create({})(Operatorconfirmaedit);
