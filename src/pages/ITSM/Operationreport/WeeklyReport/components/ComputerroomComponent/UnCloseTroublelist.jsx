import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;
function UnCloseTroublelist(props) {
  const {
    unCloseTroubleList,
    uncloseaultlist,
    mainId,
    reportSearch
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);


  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      const result = JSON.parse(JSON.stringify(data)
        .replace(/addTime/g, 'field1')
        .replace(/typecn/g, 'field2')
      )
      if (result) {
        unCloseTroubleList(result)
      }
    }
  }, [data]);

  const handleSave = () => {
    unCloseTroubleList(data);
    message.info('暂存保存数据成功')
  }

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
      field4: '',
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
      if (fieldName === 'field4') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (uncloseaultlist && uncloseaultlist.length && newbutton === false) {
      const newarr = uncloseaultlist.map((item, index) => {
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
      title: '计划修复时间',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field4', record.key)}
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

  const editClolumn = [
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
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '计划修复时间',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field4', record.key)}
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

  }, [uncloseaultlist])

  let setColumns = column;

  if (mainId) {
    setColumns = editClolumn
  }


  return (
    <>
      <p style={{ marginTop: 24 }}>3.2未修复故障清单</p>

      <div style={{ textAlign: 'right', marginBottom: 10 }}>
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
        style={{ width: '100%', marginTop: 16 }}
        type="primary"
        ghost
        onClick={() => newMember()}
        icon="plus"
        disabled={reportSearch}
      >
        新增
      </Button>
    </>
  )
}

export default Form.create({})(UnCloseTroublelist)
