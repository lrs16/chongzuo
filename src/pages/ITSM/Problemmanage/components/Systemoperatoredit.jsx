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
import styles from '../index.less';

const { TextArea } = Input;

const Systemoperatoredit = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    files, ChangeFiles,
    flowNodeName,
    allInfo,
    form: { setFieldsValue }
  } = props;
  let secondFiles = [];
  if (flowNodeName === '自动化科审核') {
    if (allInfo.editState !== undefined && (allInfo.editState === 'add')) {
      secondFiles = [];
    } else {
      secondFiles = files;
    }
  }
  const { flowtype, setFlowtype } = useContext(FatherContext);
  const { getFieldDecorator } = props.form;

  const [fileslist, setFilesList] = useState([]);
  const [showinput, setShowinput] = useState(true);
  const [showinput2, setShowinput2] = useState(true);
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
    useInfo,
  } = props;

  useEffect(() => {
    if (check) {
      setFlowtype(check.checkResult);
    }
  }, [check]);

  const onChange = e => {
    setFlowtype(e.target.value);
    setShowinput(true);
    setShowinput2(true);
  }

  const handleDoubleClick = (e, type) => {
    if (e.target) {
      switch (type) {
        case 'checkOpinion1':
          if (showinput) {
            const textheight = e.target.scrollHeight + 2;
            e.target.style.maxHeight = '9.0072e+15px';
            e.target.style.height = `${textheight}px`;
          } else {
            const h = 1 * 21 + 10;
            e.target.style.maxHeight = `${h}px`;
            e.target.style.height = `${h}px`;
          };
          setShowinput(!showinput)
          break;
        case 'checkOpinion2':
          if (showinput2) {
            const textheight = e.target.scrollHeight + 2;
            e.target.style.maxHeight = '9.0072e+15px';
            e.target.style.height = `${textheight}px`;
          } else {
            const h = 1 * 21
            e.target.style.maxHeight = `${h}px`;
            e.target.style.height = `${h}px`;
          };
          setShowinput2(!showinput2)
          break;
        default:
          break;
      }
    }
  }

  const required = true;

  return (
    <Row gutter={24}>
      <Form  {...formItemLayout}>
        <Col span={24}>
          <Form.Item label='审核结果' {...forminladeLayout}>
            {getFieldDecorator('checkResult', {
              rules: [
                {
                  required,
                  message: '请输入审核结果'
                }
              ],
              initialValue: check.checkResult
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
              rules: [
                {
                  required,
                  message: '请输入审核时间'
                }
              ],
              initialValue: check.checkTime ? moment(check.checkTime) : moment(Date.now()),
            })(<DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />)}
          </Form.Item>
        </Col>

        <div className={styles.allowClearicon}>
          {
            flowtype === '1' && (
              <Col span={24} style={{ marginTop: 4 }}>
                <Form.Item label='审核意见' {...forminladeLayout}>
                  {
                    getFieldDecorator('checkOpinion1', {
                      initialValue: check.checkOpinion
                    })(
                      <TextArea
                        allowClear
                        autoSize={{ maxRows: 1 }}
                        style={{ height: 31 }}
                        placeholder="请输入"
                        onDoubleClick={(e) => handleDoubleClick(e, 'checkOpinion1')}
                      />
                    )
                  }
                </Form.Item>
              </Col>
            )
          }

          {
            flowtype === '0' && (
              <Col span={24} style={{ marginTop: 4 }}>
                <Form.Item label='审核意见' {...forminladeLayout}>
                  {
                    getFieldDecorator('checkOpinion2', {
                      rules: [
                        {
                          required,
                          message: '请输入审核意见'
                        }
                      ],
                      initialValue: check.checkOpinion
                    })(
                      <TextArea
                        autoSize={{ maxRows: 1 }}
                        allowClear
                        style={{ height: 31 }}
                        placeholder="请输入"
                        onDoubleClick={(e) => handleDoubleClick(e, 'checkOpinion2')}
                      />
                    )
                  }
                </Form.Item>
              </Col>
            )
          }
        </div>

        {
          flowNodeName === '系统运维商审核' && (
            <Col span={24} style={{ marginTop: '-12px' }}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                {
                  getFieldDecorator('checkAttachments', {
                    rules: [
                      {
                        required,
                        message: '请上传附件'
                      }
                    ],
                    initialValue: (check && check.checkAttachments !== '[]') ? check.checkAttachments : ''
                  })(<div>
                    <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                  </div>)
                }

              </Form.Item>
            </Col>
          )
        }

        {
          flowNodeName === '自动化科审核' && (allInfo.editState === 'edit') && (
            <Col span={24} style={{ marginTop: '-12px' }}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
                  <SysUpload fileslist={secondFiles} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        {
          allInfo.editState !== undefined && (allInfo.editState === 'add') && flowNodeName === '自动化科审核' && (
            <Col span={24} style={{ marginTop: '-12px' }}>
              <Form.Item
                label="上传附件"
                {...forminladeLayout}
              >
                <div>
                  <SysUpload fileslist={[]} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              </Form.Item>
            </Col>
          )
        }

        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('checkUser', {
              initialValue: useInfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核单位">
            {getFieldDecorator('checkUnit', {
              initialValue: useInfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核部门">
            {getFieldDecorator('checkDept', {
              initialValue: useInfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  )
})

Systemoperatoredit.defaultProps = {
  check: {
    checkOpinion: '',
    // checkTime: moment().format(),
    checkResult: '1',
    checkAttachments: ''
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  }
}

export default Form.create({})(Systemoperatoredit);
