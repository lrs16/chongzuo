import React, { useImperativeHandle, useRef, useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  DatePicker
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { TextArea } = Input;


const ProviderConfirmation = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator },
    formItemLayout,
    forminladeLayout,
    userinfo,
    providerConfirmation,
    noEdit,
    selectPersonstate,
    files,
    ChangeFiles,
  } = props;

  console.log(providerConfirmation,'providerConfirmation')

  const [showContent, setShowContent] = useState('1');
  const [fileslist, setFilesList] = useState([]);
  const [selectdata, setSelectData] = useState('');

  const required = true;
  const attRef = useRef();
  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);
  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    []
  )

  useEffect(() => {
    selectPersonstate(providerConfirmation.isAppeal === null ? '1' : providerConfirmation.isAppeal)
  }, [])


  const handleChange = (e) => {
    setShowContent(e.target.value);
    selectPersonstate(e.target.value)
  }

  console.log(providerConfirmation.confirmerName,'providerConfirmation')

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='是否申诉'>
            {
              getFieldDecorator('isAppeal', {
                rules: [
                  {
                    required,
                    message: '请选择是否申诉'
                  }
                ],
                initialValue: providerConfirmation.isAppeal || '1'
              })
                (
                  <Radio.Group disabled={noEdit} onChange={handleChange}>
                    <Radio value='1'>
                      是
                    </Radio>

                    <Radio value='0'>
                      否
                    </Radio>
                  </Radio.Group>
                )
            }

          </Form.Item>
        </Col>

        {
          showContent === '1' && (
            <Col span={24}>
              <Form.Item label='申诉内容' {...forminladeLayout}>
                {
                  getFieldDecorator('appealContent', {
                    rules: [
                      {
                        required,
                        message: '请选择是否申诉'
                      }
                    ],
                    initialValue: providerConfirmation.appealContent
                  })
                    (<TextArea
                      disabled={noEdit}
                      autoSize={{ minRows: 3 }}
                      placeholder='请输入申诉内容'
                    />)
                }

              </Form.Item>
            </Col>
          )
        }

        {
          showContent === '0' && (
            <Col span={24}>
              <Form.Item label='申诉内容' {...forminladeLayout}>
                {
                  getFieldDecorator('appealContent', {
                    initialValue: providerConfirmation.appealContent
                  })
                    (<TextArea
                      disabled={noEdit}
                      autoSize={{ minRows: 3 }}
                      placeholder='请输入申诉内容'
                    />)
                }

              </Form.Item>
            </Col>
          )
        }

        {
          !noEdit && (
            <Col span={24}>
              <Form.Item label='上传附件'  {...forminladeLayout}>
                {
                  getFieldDecorator('annex', {
                    initialValue: providerConfirmation.annex
                  })
                    (
                      <div>
                        <SysUpload
                          fileslist={files}
                          ChangeFileslist={newvalue => setFilesList(newvalue)}
                        />
                      </div>
                    )
                }

              </Form.Item>
            </Col>
          )
        }

        {noEdit && (
          <Col span={24}>
            <Form.Item label="附件" {...forminladeLayout}>
              {providerConfirmation.annex && <Downloadfile files={providerConfirmation.annex} />}
            </Form.Item>
          </Col>
        )}

        <Col span={8}>
          <Form.Item label='确认人'>
            {
              getFieldDecorator('confirmer', {
                rules: [
                  {
                    required,
                    message: '请输入确认人'
                  }
                ],
                initialValue: providerConfirmation.confirmerName || userinfo.userName
              })
                (<Input disabled='true' />)
            }

          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='确认时间'>
            {
              getFieldDecorator('confirmTime', {
                rules: [
                  {
                    required,
                    message: '请选择确认时间'
                  }
                ],
                initialValue: providerConfirmation.confirmTime ? moment(providerConfirmation.confirmTime) : moment(new Date())
              })
                (<DatePicker
                  showTime
                  format='YYYY-MM-DD HH:mm:ss'
                  disabled='true' />)
            }

          </Form.Item>
        </Col>
      </Form>
    </Row>
  )
})

ProviderConfirmation.defaultProps = {
  providerConfirmation: {
    isAppeal: '0',
    appealContent: '',
    annex: [],
    confirmer: '',
    confirmTime: '',
    confirmerName:''
  }
}

export default Form.create({})(ProviderConfirmation)