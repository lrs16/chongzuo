import React, { useEffect, useRef, useImperativeHandle, useContext, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  AutoComplete
} from 'antd';
import moment from 'moment';
import { FatherContext } from '../Workorder';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import styles from '../index.less';


const { TextArea } = Input;

const Operatorconfirmaedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles, flowNodeName } = props;
  const { flowtype, setFlowtype } = useContext(FatherContext);
  const [desautodata, setDestoData] = useState([]);
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
    confirm,
    useInfo,
  } = props;

  const onChange = (e) => {
    setFlowtype(e.target.value);
    setShowinput(true);
    setShowinput2(true);
  }


  const handleDoubleClick = (e, type) => {
    if (e.target) {
      switch (type) {
        case 'yes':
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
        case 'no':
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
  // ???????????????
  useEffect(() => {
    handledesSearch({ module: '?????????', field: '??????', key: '' });
  }, []);

  const required = true;

  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={24}>
          <Form.Item label='????????????' {...forminladeLayout}>
            {getFieldDecorator('confirmResult', {
              rules: [
                {
                  required,
                  message: '?????????????????????'
                }
              ],
              initialValue: confirm.confirmResult
            })(
              <Radio.Group onChange={onChange}>
                <Radio value='1'>??????</Radio>
                <Radio value='0'>?????????</Radio>
              </Radio.Group>
            )
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='????????????'>
            {
              getFieldDecorator('confirmTime', {
                rules: [
                  {
                    required,
                    message: '?????????????????????'
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

        <div className={styles.autoCompleteallowclear}>
          {
            flowtype === '1' && (
              <Col span={24}>
                <Form.Item label='????????????' {...forminladeLayout}>
                  {
                    getFieldDecorator('confirmContent1', {
                      initialValue: confirm.confirmContent,
                    })(
                      <AutoComplete
                        allowClear
                        getPopupContainer={e => e.parentNode}
                        dataSource={desautodata}
                      // filterOption={(inputValue, option) =>
                      //   option.props.children.includes(inputValue)
                      // }
                      // onSearch={value => handledesSearch(value)}
                      >
                        <TextArea
                          auto
                          style={{ height: 31 }}
                          placeholder="?????????"
                          onDoubleClick={(e) => handleDoubleClick(e, 'yes')}
                        />
                      </AutoComplete>,
                    )
                  }

                </Form.Item>
              </Col>
            )
          }

          {
            flowtype === '0' && (
              <Col span={24}>
                <Form.Item label='????????????' {...forminladeLayout}>
                  {
                    getFieldDecorator('confirmContent2', {
                      rules: [
                        {
                          required,
                          message: '?????????????????????'
                        }
                      ],
                      initialValue: confirm.confirmContent,
                    })(
                      <AutoComplete
                        allowClear
                        getPopupContainer={e => e.parentNode}
                        dataSource={desautodata}
                      // filterOption={(inputValue, option) =>
                      //   option.props.children.includes(inputValue)
                      // }
                      // onSearch={value => handledesSearch(value)}
                      >
                        <TextArea
                          auto
                          style={{ height: 31 }}
                          placeholder="?????????"
                          onDoubleClick={(e) => handleDoubleClick(e, 'no')}
                        />
                      </AutoComplete>,
                    )
                  }

                </Form.Item>
              </Col>
            )
          }
        </div>


        {
          flowNodeName === '?????????????????????' && (
            <Col span={24}>
              <Form.Item
                label="????????????"
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
          flowNodeName === '??????????????????????????????' && (
            <Col span={24}>
              <Form.Item
                label="????????????"
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
          flowNodeName === '????????????????????????' && (
            <Col span={24}>
              <Form.Item
                label="????????????"
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
          <Form.Item label='?????????'>
            {
              getFieldDecorator('confirmUser', {
                initialValue: useInfo.userName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='???????????????'>
            {
              getFieldDecorator('confirmUnit', {
                initialValue: useInfo.unitName,
              })(<Input disabled />)
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label='???????????????'>
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
