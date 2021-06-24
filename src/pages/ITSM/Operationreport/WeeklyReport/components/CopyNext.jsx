import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Divider,
  Popconfirm,
  message,
  Button,
  DatePicker
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { TextArea } = Input;

function CopyNext(props) {
  const {
    nextOperationList,
    nextOperationArr,
    mainId,
    detailParams,
    loading
  } = props;

  const [data, setData] = useState([]);

  // 初始化把数据传过去
  useEffect(() => {
    // typeList(maintenanceArr)
    if (data && data.length) {
      const result = JSON.parse(JSON.stringify(data)
        .replace(/updateTime/g, 'field1')
        .replace(/nature/g, 'field2')
        .replace(/object/g, 'field3')
        .replace(/content/g, 'field4')
        .replace(/plannedEndTime/g, 'field5')
        .replace(/status/g, 'field6')
        .replace(/operationUser/g, 'field7')
        .replace(/operationUnit/g, 'field8')
        .replace(/remark/g, 'field9')
      )
      if (result) {
        nextOperationList(result)
      }
    }
  }, [data]);

  const handleSave = () => {
    const result = JSON.parse(JSON.stringify(data)
      .replace(/updateTime/g, 'field1')
      .replace(/nature/g, 'field2')
      .replace(/object/g, 'field3')
      .replace(/content/g, 'field4')
      .replace(/plannedEndTime/g, 'field5')
      .replace(/status/g, 'field6')
      .replace(/operationUser/g, 'field7')
      .replace(/operationUnit/g, 'field8')
      .replace(/remark/g, 'field9')
    )
    if (result) {
      nextOperationList(result)
    }
    message.info('暂存保存数据成功')
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
    setData(target);
    message.info('删除成功')
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      if (fieldName === 'field1' || fieldName === 'updateTime') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (nextOperationArr) {
      const newarr = nextOperationArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '作业日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text, record) => {
        return (
          <DatePicker
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'updateTime', record.key)}
          />
        )
      }
    },
    {
      title: '作业性质',
      dataIndex: 'nature',
      key: 'nature',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'nature', record.key)}
          />
        )
      }
    },
    {
      title: '作业对象',
      dataIndex: 'object',
      key: 'object',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'object', record.key)}
          />
        )
      }
    },
    {
      title: '作业内容',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'content', record.key)}
          />
        )
      }
    },
    {
      title: '计划完成时间',
      dataIndex: 'plannedEndTime',
      key: 'plannedEndTime',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'plannedEndTime', record.key)}
          />
        )
      }
    },
    {
      title: '完成进度',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'status', record.key)}
          />
        )
      }
    },
    {
      title: '作业负责人',
      dataIndex: 'operationUser',
      key: 'operationUser',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'operationUser', record.key)}
          />
        )
      }
    },
    {
      title: '作业单位',
      dataIndex: 'operationUnit',
      key: 'operationUnit',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'operationUnit', record.key)}
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
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const editColumns = [
    {
      title: '作业日期',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={detailParams}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '作业性质',
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
      title: '作业对象',
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
      title: '作业内容',
      dataIndex: 'field4',
      key: 'field4',
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
      title: '计划完成时间',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
          />
        )
      }
    },
    {
      title: '完成进度',
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
      title: '作业负责人',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
          />
        )
      }
    },
    {
      title: '作业单位',
      dataIndex: 'field8',
      key: 'field8',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field8', record.key)}
          />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'field9',
      key: 'field9',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field9', record.key)}
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

  useEffect(() => {
    handleTabledata();
  }, [nextOperationArr])

  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button
          disabled={detailParams}
          type='primary'
          onClick={handleSave}>保存</Button>
      </div>

      <Table
        loading={loading}
        columns={editColumns}
        dataSource={data}
        pagination={false}
      />
    </>
  )
}

export default Form.create({})(CopyNext)
