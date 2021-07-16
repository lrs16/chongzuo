import React, { useEffect, useState } from 'react';
import {
  Input,
  Table,
  Form,
  Button,
  message,
  Popconfirm
} from 'antd';

function ServiceCompletionone(props) {

  const {
    tabActiveKey,
    maintenanceService,
    statisList,
    mainId,
    detailParams
  } = props;

  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);


  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: data.length + 1,
      field2: '',
      field3: '',
      field4: '',
    });
    setData(newData);
    statisList(newData);
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
    statisList(target)
    setNewButton(true);
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const result = JSON.parse(JSON.stringify(maintenanceService)
      .replace(/index/g, 'field1')
      .replace(/name/g, 'field2')
      .replace(/last/g, 'field3')
      .replace(/now/g, 'field4')
      .replace(/points/g, 'field5')
      .replace(/remark/g, 'field6')
    )
    if (result) {
      statisList(result)
    }
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
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
      title: '服务指标',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'name', record.key)}
          />
        )
      }

    },
    {
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'last',
      key: 'last',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'last', record.key)}
          />
        )
      }
    },
    {
      title: tabActiveKey === 'week' ? '本周' : '下月',
      dataIndex: 'now',
      key: 'now',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'now', record.key)}
          />
        )
      }
    },
    {
      title: '环比',
      dataIndex: 'points',
      key: 'points',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'points', record.key)}
          />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'remark', record.key)}
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
              disabled={detailParams}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const editColumns = [
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
      title: '服务指标',
      dataIndex: 'field2',
      key: 'field2',
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
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'field3',
      key: 'field3',
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
      title: tabActiveKey === 'week' ? '下周' : '下月',
      dataIndex: 'field4',
      key: 'field4',
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
      title: '环比',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
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
              disabled={detailParams}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const handleTabledata = () => {
    const newarr = (maintenanceService).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, index: index + 1 })
    })
    setData(newarr)
  }

  useEffect(() => {
    handleTabledata();
  }, [maintenanceService])

  return (
    <>
      <p>(二)、软件运维服务指标完成情况</p>

      <Table
        columns={mainId ? editColumns : columns}
        dataSource={data}
        pagination={false}
      />

      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="primary"
        ghost
        onClick={newMember}
        icon="plus"
        disabled={detailParams}
      >
        新增
      </Button>
    </>
  )
}

export default Form.create({})(ServiceCompletionone)
