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
  Button
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';
import { queryDisableduserByUser, queryUnitList, queryDeptList } from '@/services/common';
import styles from '../index.less';


const { Search } = Input;
const { Option } = Select;

function EventTop(props) {
  const {
    form: { getFieldDecorator, setFieldsValue, validateFields },
    forminladeLayout,
    formItemLayout,
    startTime,
    endTime,
    topNList,
    ordertopnArr,
    defaultValue,
    topArr,
    mainId,
    value,
    loading,
    dispatch
  } = props;

  const [data, setData] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [newbutton, setNewButton] = useState(false);
  const [fileslist, setFilesList] = useState([]);
  const [disablelist, setDisabledList] = useState([]);
  const [spinloading, setSpinLoading] = useState(true);

  // 初始化把数据传过去
  useEffect(() => {
    // typeList(maintenanceArr)
    if (data && data.length) {
      const result = JSON.parse(JSON.stringify(data)
        .replace(/first_object/g, 'field1')
        .replace(/second_object/g, 'field2')
        .replace(/num/g, 'field3')
      )
      if (result) {
        topNList(result)
      }
    }
  }, [data]);
  // 自动完成报障用户
  const disableduser = disablelist.map(opt => (
    <Option key={opt.id} value={opt.user} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.user}</span>
          {/* <span>{opt.phone}</span>
            <span>{opt.unit}</span>
            <span>{opt.dept}</span> */}
        </div>
      </Spin>
    </Option>
  ));

  // 请求报障用户
  const SearchDisableduser = value => {
    queryDisableduserByUser({ user: value }).then(res => {
      if (res) {
        const arr = [...res];
        setSpinLoading(false);
        setDisabledList(arr);
      }
    });
  };

  // 选择报障用户，信息回填
  const handleDisableduser = (v, opt,) => {
    const newData = data.map(item => ({ ...item }));
    const { user } = opt.props.disableuser;
    const searchObj = {
      key: newData.length + 1,
      num1: user,
      isNew: true
    };
    newData.push(searchObj);
    setData(newData)
    // // setFieldsValue({
    // //   num5: 'user',         // 申报人
    // // });
    // const target = getRowByKey(key,newData);
    // console.log('target: ', target);
    // if(target) {
    //   target[fieldName] = user;
    //   setData(newData)
    // }
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


  const handleSave = (target, id) => {
    topNList(data)
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    // delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false
      // setNewButton(false)
    }
  }

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

  const handleTabledata = () => {
    const newarr = (topArr).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const selectOnchange = (selectvalue) => {
    // value(selectvalue)
    value(selectvalue)
  }


  const column = [
    {
      title: '事件对象一级',
      dataIndex: 'first_object',
      key: 'first_object',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'first_object', record.key)}
          />
        )
      }
    },
    {
      title: '事件对象二级',
      dataIndex: 'second_object',
      key: 'second_object',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'second_object', record.key)}
          />
        )
      }
    },
    {
      title: '事件单数',
      dataIndex: 'num',
      key: 'num',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'num', record.key)}
          />
        )
      }
    },
    {
      title: '措施',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        if (text !== '合计') {
          return (
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
      }

    }
  ];

  const editColumns = [
    {
      title: '事件对象一级',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '事件对象二级',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '事件单数',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '措施',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        if (text !== '合计') {
          return (
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
      }

    }
  ];

  const [newColumns,setNewColumns] = useState(column)

  useEffect(() => {
    handleTabledata();
    if(mainId) {
      setNewColumns(editColumns)
    }
  }, [topArr])



  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <p>（三）工单TopN 事件分析</p>
        </Col>

        <Form {...formItemLayout}>
          {!mainId && (
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label='N'>
                  <Select
                    placeholder="请选择"
                    style={{ width: 150 }}
                    defaultValue={defaultValue}
                    onChange={selectOnchange}
                  >
                    <Option value="5">5</Option>
                    <Option value="10">10</Option>
                    <Option value="15">15</Option>
                    <Option value="20">20</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

        </Form>

        <Col span={24}>
          <Button
            type='primary'
            onClick={handleSave}>保存</Button>
        </Col>
        
        <Table
          columns={newColumns}
          dataSource={data}
          pagination={false}
        />
      </Row>

    </>
  )
}


export default Form.create({})(EventTop)
