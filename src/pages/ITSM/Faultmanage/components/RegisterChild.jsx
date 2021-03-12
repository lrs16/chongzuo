import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import { Form, Row, Col, Input, Select, DatePicker, Radio, Cascader, AutoComplete } from 'antd';
import SysDict from '@/components/SysDict';
import { getAndField } from '@/pages/SysManage/services/api';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const RegisterChild = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    tododetailslist,
    ChangeFiles,
    main,
    curruserinfo,
  } = props;
  const { getFieldDecorator } = props.form;
  const attRef = useRef();

  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState([]);
  const [titleautodata, setTitleAutoData] = useState([]);
  const [desautodata, setDestoData] = useState([]);
  const [titlerecords, setTitleRecords] = useState([]);
  const [desrecords, setDesRecords] = useState([]);

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

  const handletitleSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setTitleAutoData(newdata);
        setTitleRecords(newdata);
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
        setDesRecords(newdata);
      }
    });
  };

  const handleSearch = (value, type) => {
    switch (type) {
      case 'title': {
        const newArr = titlerecords.filter(item => {
          return item.includes(value);
        });
        if (newArr.length > 0) {
          setTitleAutoData(newArr);
        } else {
          setTitleAutoData(titlerecords);
        }
        break;
      }
      case 'des': {
        const newArr = desrecords.filter(item => {
          return item.includes(value);
        });
        if (newArr.length > 0) {
          setDestoData(newArr);
        } else {
          setDesRecords(desrecords);
        }
        break;
      }
      default:
        break;
    }
  };

  // 常用语调用
  useEffect(() => {
    handletitleSearch({ module: '故障单', field: '标题', key: '' });
    handledesSearch({ module: '故障单', field: '描述', key: '' });
  }, []);

  const getTypebyTitle = title => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const faultSource = getTypebyTitle('故障来源');
  const sysmodular = getTypebyTitle('故障系统模块');
  const priority = getTypebyTitle('严重程度');
  const effect = getTypebyTitle('影响范围');
  const faultType = getTypebyTitle('故障分类');

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid="1354278126724583426"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout}>
        <Col xl={8} xs={12}>
          <Form.Item label="故障编号">
            {getFieldDecorator('no', {
              initialValue: main.no || '',
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="登记时间">
            {getFieldDecorator('registerTime', {
              rules: [
                {
                  required,
                  message: '请选择时间',
                },
              ],
              initialValue: tododetailslist
                ? moment(tododetailslist.register.registerTime)
                : moment(Date.now()),
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="发生时间">
            {getFieldDecorator('registerOccurTime', {
              rules: [
                {
                  required,
                  message: '请选择时间',
                },
              ],
              initialValue: tododetailslist
                ? moment(tododetailslist.register.registerOccurTime)
                : moment(Date.now()),
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="故障来源">
            {getFieldDecorator('source', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: main.source || '',
            })(
              <Select placeholder="请选择">
                {faultSource.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="系统模块">
            {getFieldDecorator('registerModel', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: tododetailslist ? tododetailslist.register.registerModel : '',
            })(
              <Select placeholder="请选择">
                {sysmodular.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="故障类型">
            {getFieldDecorator('type', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: main ? main.typecn : '',
            })(
              <Cascader
                placeholder="请选择"
                options={faultType}
                fieldNames={{ label: 'title', value: 'title', children: 'children' }}
              />,
            )}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="故障地点">
            {getFieldDecorator('registerAddress', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: tododetailslist ? tododetailslist.register.registerAddress : '',
            })(<Input placeholder="请输入" allowClear />)}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="严重程度">
            {getFieldDecorator('registerLevel', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: tododetailslist ? tododetailslist.register.registerLevel : '',
            })(
              <Select placeholder="请选择">
                {priority.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col xl={8} xs={12}>
          <Form.Item label="影响范围">
            {getFieldDecorator('registerScope', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: tododetailslist ? tododetailslist.register.registerScope : '',
            })(
              <Select placeholder="请选择">
                {effect.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="故障名称">
            {getFieldDecorator('title', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: main.title || '',
            })(
              <AutoComplete
                dataSource={titleautodata}
                onSearch={value => handleSearch(value, 'title')}
              >
                <Input placeholder="请输入" />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="故障概要" {...forminladeLayout}>
            {getFieldDecorator('content', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: main.content || '',
            })(
              <AutoComplete dataSource={desautodata} onSearch={value => handleSearch(value, 'des')}>
                <TextArea autoSize={{ minRows: 5 }} placeholder="请输入" />
              </AutoComplete>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="是否影响业务" {...forminladeLayout}>
            {getFieldDecorator('registerEffect', {
              initialValue: Number(tododetailslist.register.registerEffect),
            })(
              <RadioGroup>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            <div style={{ width: 400 }}>
              <SysUpload
                fileslist={
                  tododetailslist ? JSON.parse(tododetailslist.register.registerAttachments) : []
                }
                ChangeFileslist={newvalue => setFilesList(newvalue)}
              />
            </div>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="登记人">
            {getFieldDecorator('registerUser', {
              initialValue: tododetailslist
                ? tododetailslist.register.registerUser
                : curruserinfo.userName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="登记人单位">
            {getFieldDecorator('registerUnit', {
              initialValue: tododetailslist
                ? tododetailslist.register.registerUnit
                : curruserinfo.unitName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="登记人部门">
            {getFieldDecorator('registerDept', {
              initialValue: tododetailslist
                ? tododetailslist.register.registerDept
                : curruserinfo.deptName,
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

RegisterChild.defaultProps = {
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: '',
  },
};

export default Form.create({})(RegisterChild);
