import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Divider,
  Popconfirm,
  Select,
  AutoComplete,
  Spin,
  Button,
  message
} from 'antd';
import SysUpload from '@/components/SysUpload';
import { queryOrder, queryUnitList, queryDeptList } from '@/services/common';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { Search } = Input;
const { Option } = Select;

function ThisWeekitsm(props) {
  // const attRef = useRef();
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     attRef,
  //   }),
  //   [],
  // )

  const {
    form: { getFieldDecorator, setFieldsValue },
    forminladeLayout,
    formItemLayout,
    formincontentLayout,
    thisWeekitsmlist,
    reportType,
    eventList,
    eventArr,
    mainId,
    detailParams,
    searchNumber,
    loading
  } = props;

  const [data, setData] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [newbutton, setNewButton] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [disablelist, setDisabledList] = useState([]);
  const [spinloading, setSpinLoading] = useState(true);
  const [value, setValue] = useState('event');

  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      eventList(data)
    }
  }, [data]);

  const handleSave = () => {
    eventList(data);
    message.info('暂存保存数据成功')
  }
  // 自动完成报障用户
  const disableduser = disablelist.map(obj => (
    <Option key={obj.type} value={obj.content} disableuser={obj}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{obj.type}</span>
          <span>{obj.content}</span>
        </div>
      </Spin>
    </Option>

  ));

  // 请求报障用户
  const SearchDisableduser = searchvalues => {
    queryOrder({ key: searchvalues, type: value }).then(res => {
      if (res) {
        const arr = [...res.data];
        setSpinLoading(false);
        setDisabledList(arr);
      }
    });
  };

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt,) => {
    const newData = data.map(item => ({ ...item }));
    const { type, no, content, startTime, endTime, systemName } = opt.props.disableuser;
    const searchObj = {
      key: newData.length + 1,
      field1: type,
      field2: no,
      field3: systemName,
      field4: content,
      field5: no,
      field6: startTime,
      field7: endTime,
      isNew: true
    };
    newData.push(searchObj);
    setData(newData)
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    setData(target)
  };


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
    if (fieldName === 'num3') {
      searchNumber(e)
    }

  }

  // console.log(thisWeekitsmlist,'thisWeekitsmlist')
  const handleTabledata = () => {
    if (mainId) {
      const newarr = eventArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }


  useEffect(() => {
    handleTabledata();
  }, [eventArr])

  const column = [
    {
      title: '工单类型',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Select
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field1', record.key)}
          >
            <Option key='事件' value='事件'>事件</Option>
            <Option key='问题' value='问题'>问题</Option>
            <Option key='故障' value='故障'>故障</Option>
          </Select>
        )
      }
    },
    {
      title: '工单编号',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '应用系统名称',
      dataIndex: 'field3',
      key: 'field3',
    },
    {
      title: '具体内容',
      dataIndex: 'field4',
      key: 'field4',
    },
    {
      title: '处理情况',
      dataIndex: 'field5',
      key: 'field5',
    },
    {
      title: '开始发生时间',
      dataIndex: 'field6',
      key: 'field6',
    },
    {
      title: '处理完成时间',
      dataIndex: 'field7',
      key: 'field7',
    },
    {
      title: '故障报告是否提交负责人',
      dataIndex: 'field8',
      key: 'field8',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => remove(record.key)}
              disabled={detailParams}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];

  const selectOnchange = (selectvalue) => {
    setValue(selectvalue);
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>四、本周事件、问题及故障</p>
        </Col>

        <Form {...formItemLayout}>
          {true && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label='N' {...formincontentLayout}>
                  <Select
                    placeholder="请选择"
                    style={{ width: 150 }}
                    defaultValue='event'
                    onChange={selectOnchange}
                    disabled={detailParams}
                  >
                    <Option value="event">事件</Option>
                    <Option value="problem">问题</Option>
                    <Option value="trouble">故障</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='搜索内容'>
                  {getFieldDecorator('content', {})(
                    <>
                      <AutoComplete
                        disabled={detailParams}
                        dataSource={disableduser}
                        defaultValue='内容'
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 900 }}
                        optionLabelProp="value"
                        onSelect={(v, opt) => handleDisableduser(v, opt)}
                      >
                        <Search
                          placeholder="可输入姓名搜索"
                          onSearch={values => SearchDisableduser(values)}
                        // allowClear
                        />
                      </AutoComplete>,
                    </>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>

        <div style={{ textAlign: 'right', marginBottom: 10 }}>
          <Button
            type='primary'
            disabled={detailParams}
            onClick={handleSave}>保存</Button>
        </div>

        <Table
          columns={column}
          dataSource={data}
          pagination={false}
          loading={loading}
        />
      </Row>




    </>
  )
}

export default Form.create({})(ThisWeekitsm)