import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm,
  Select,
  message,
  DatePicker
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
function NewTroublelist(props) {

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    faultlist,
    newTroubleList,
    reportSearch,
    mainId,
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);


  // 初始化把数据传过去
  useEffect(() => {
    // typeList(maintenanceArr)
    if (data && data.length) {
      const result = JSON.parse(JSON.stringify(data)
        .replace(/addTime/g, 'field1')
        .replace(/typecn/g, 'field2')
      )
      if (result) {
        newTroubleList(result)
      }
    }
  }, [data]);

  const handleSave = () => {
    newTroubleList(data);
    message.info('暂存保存数据成功')
  }

  // 新增一条记录
  const newMember = (params) => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
    });
    setData(newData);
    setNewButton(true);
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
    setData(target);
    message.info('删除成功')
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      if (fieldName === 'field1' || fieldName === 'addTime') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }

    }
  }

  const handleTabledata = () => {
    if (faultlist && faultlist.length && newbutton === false) {
      const newarr = faultlist.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }


  const column = [
    {
      title: '日期',
      dataIndex: 'addTime',
      key: 'addTime',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'addTime', record.key)}
          />
        )
      }
    },
    {
      title: '故障类型',
      dataIndex: 'typecn',
      key: 'typecn',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'typecn', record.key)}
          />
        )
      }
    },
    {
      title: '故障情况',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '是否已修复',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field4', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '是否需要报告',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '报告提供方',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
          />
        )
      }
    },
    {
      title: '是否已提供故障处理记录（报告）',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field7', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
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
              disabled={reportSearch}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const editColumn = [
    {
      title: '日期',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '故障类型',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '故障情况',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '是否已修复',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field4', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '是否需要报告',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '报告提供方',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
          />
        )
      }
    },
    {
      title: '是否已提供故障处理记录（报告）',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field7', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
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
              disabled={reportSearch}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];


  useEffect(() => {
    handleTabledata();
  }, [faultlist])

  let setColumns = column;

  if(mainId) {
    setColumns = editColumn
  }
  return (
    <>
      {/* <Row gutter={16}> */}
        {/* <Col span={20}> */}
          <p style={{ fontWeight: '900', fontSize: '16px' }}>三、本周新增故障及故障修复情况统计</p>
        {/* </Col> */}
        {/* <Col span={20}> */}
          <p>3.1新增及已修复故障</p>
        {/* </Col> */}

        <div style={{textAlign:'right',marginBottom:10}}>
          <Button
            disabled={reportSearch}
            type='primary'
            onClick={handleSave}>保存</Button>
        </div>

        <Table
          columns={setColumns}
          dataSource={data}
          pagination={false}
        />

        <Button
          style={{ width: '100%', marginTop: 16}}
          type="primary"
          ghost
          onClick={() => newMember()}
          icon="plus"
          disabled={reportSearch}
        >
          新增
        </Button>
      {/* </Row> */}
    </>
  )
}

export default Form.create({})(NewTroublelist)
