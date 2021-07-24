import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  DatePicker,
  Popconfirm,
  Select,
  AutoComplete,
  Spin,
  Button,
  message
} from 'antd';
import { queryOrder } from '@/services/common';
import styles from '../index.less';
import moment from 'moment';

const { Search, TextArea } = Input;
const { Option } = Select;

let deleteSign = false;
function ThisWeekitsm(props) {

  const {
    form: { getFieldDecorator, setFieldsValue },
    formItemLayout,
    formincontentLayout,
    eventList,
    eventArr,
    mainId,
    detailParams,
    reportType,
    loading
  } = props;

  const [data, setData] = useState([]);
  const [disablelist, setDisabledList] = useState([]);
  const [spinloading, setSpinLoading] = useState(true);
  const [newbutton, setNewButton] = useState(false);
  const [value, setValue] = useState('event');

  // 自动完成报障用户
  const disableduser = disablelist.map(obj => (
    <Option
      key={obj.no}
      value={obj.no}
      disableuser={obj}
      // getPopupContainer={triggerNode => triggerNode.parentNode}
      style={{ 'overflow-y': 'hidden' }}
    >
      <Spin spinning={spinloading}>
        <div
          className={styles.disableuser}
        >
          <span>{obj.no}</span>
          <span>{obj.content}</span>
          <span>{obj.handleContent}</span>
          <span>{obj.startTime}</span>
          <span>{obj.endTime}</span>
          <span>{obj.submit}</span>
          <span>{obj.systemName}</span>
        </div>
      </Spin>
    </Option>

  ));

  // 请求关键字
  const SearchDisableduser = searchvalues => {
    if (searchvalues) {
      queryOrder({ key: searchvalues }).then(res => {
        if (res) {
          const arr = [...res.data];
          setSpinLoading(false);
          setDisabledList(arr);
        }
      });
    } else {
      message.info('关键字不能为空')
    }
  };

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt,) => {
    const newData = data.map(item => ({ ...item }));
    const { type, no, content, startTime, endTime, systemName, submit, handleContent } = opt.props.disableuser;
    const searchObj = {
      key: newData.length + 1,
      field1: newData.length + 1,
      field2: no,
      field3: systemName,
      field4: content,
      field5: handleContent,
      field6: startTime,
      field7: endTime,
      field8: submit,
      isNew: true
    };
    newData.push(searchObj);
    setNewButton(true);
    setData(newData);
    eventList(newData)
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
    const newarr = target.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
    });

    deleteSign = true;
    setData(newarr);
    eventList(newarr)
  };



  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    eventList(newData)
    if (target) {
      if (fieldName === 'field6') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (newbutton === false) {
      const newarr = eventArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  useEffect(() => {
    handleTabledata();
  }, [eventArr])

  useEffect(() => {
    if (deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])

  const column = [
    {
      title: '序号',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
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
      title: '故障类型',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '故障概要',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <TextArea
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '处理情况',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <TextArea
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
          />
        )
      }
    },
    {
      title: '开始发生时间',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={detailParams}
            defaultValue={text ? moment(text) : moment(null)}
            onChange={e => handleFieldChange(e, 'field6', record.key)}
          />
        )
      }
    },
    {
      title: '处理完成时间',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={detailParams}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field7', record.key)}
          />
        )
      }
    },
    {
      title: '故障报告是否提交负责人',
      dataIndex: 'field8',
      key: 'field8',
      render: (text, record) => {
        return (
          <Select
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field8', record.key)}
          >
            <Option key='是' value='是'>是</Option>
            <Option key='否' value='否'>否</Option>
          </Select>
        )
      }
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
          <p style={{ fontWeight: '900', fontSize: '16px' }}>{reportType === 'week' ? '四、本周故障事件':'四、本月故障事件'}</p>
        </Col>

        <Form {...formItemLayout}>
          {true && (
            <Row gutter={16}>
              {/* <Col span={24}>
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
              </Col> */}
              <Col span={24}>
                <Form.Item label='搜索内容'>
                  {getFieldDecorator('content', {
                  })(
                    <>
                      <AutoComplete
                        disabled={detailParams}
                        defaultActiveFirstOption={false}
                        dataSource={disableduser}
                        // defaultValue='按姓名搜索'
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 700 }}
                        optionLabelProp="value"
                        onSelect={(v, opt) => handleDisableduser(v, opt)}
                      // getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        <Search
                          disabled='true'
                          placeholder="按编号和描述搜索"
                          onSearch={values => SearchDisableduser(values)}
                        />
                      </AutoComplete>,
                    </>
                  )}
                </Form.Item>
              </Col>

            </Row>
          )}
        </Form>

        {deleteSign === false && (
          <Table
            columns={column}
            dataSource={data}
            pagination={false}
            loading={loading}
            rowKey={record => record.key}
          />
        )}
      </Row>
    </>
  )
}

export default Form.create({})(ThisWeekitsm)