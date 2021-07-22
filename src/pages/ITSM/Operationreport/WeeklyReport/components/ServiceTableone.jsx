import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  message,
  Button,
  Popconfirm
} from 'antd';

let deleteSign = false;
function ServiceTableone(props) {
  const {
    maintenanceArr,
    typeList,
    tabActiveKey,
    mainId,
    detailParams
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length,
      field1: data.length + 1,
      field2: '',
      field3: '',
      field4: '',
    });
    setData(newData);
    typeList(newData);
    setNewButton(true);
  };

  const handleTabledata = () => {
    if (newbutton === false) {
      const newarr = (maintenanceArr).map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
      })
      setData(newarr)
    }
  }

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
      return Object.assign(item, { editable: true, isNew: false, key: index, field1:index +1 })
    });

    deleteSign = true;
    typeList(newarr)
    setData(newarr);
  };


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    typeList(newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  useEffect(() => {
    handleTabledata();
  }, [maintenanceArr])

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
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
            disabled={detailParams}
          />
        )
      }
    },
    {
      title: '一级对象',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
            disabled={detailParams}
          />
        )
      }
    },
    {
      title: '二级对象',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
            disabled={detailParams}
          />
        )
      }
    },
    {
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
            disabled={detailParams}
          />
        )
      }
    },
    {
      title: tabActiveKey === 'week' ? '本周' : '本月',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
            disabled={detailParams}
          />
        )
      }
    },
    {
      title: '环比',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
            disabled={detailParams}
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

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
        </Col>

        <Col span={24}>
          <p>（一）运维分类统计情况 </p>
        </Col>

        {deleteSign === false && (
        <Table
          columns={column}
          dataSource={data}
          pagination={false}
          rowKey={record => record.key}
        />
      )}



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
      </Row>
    </>
  )
}

export default Form.create({})(ServiceTableone)