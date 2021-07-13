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
function LastweekHomework(props) {
  const {
    operationList,
    operationArr,
    mainId,
    detailParams,
    loading
  } = props;
  const [data, setData] = useState([]);

  // 初始化把软件运维服务指标完成情况数据传过去
  useEffect(() => {
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
        operationList(result)
      }
    }
  }, [data]);

  const handleSave = () => {
    const result = JSON.parse(JSON.stringify(data)
    .replace(/index/g, 'field1')
      .replace(/updateTime/g, 'field2')
      .replace(/nature/g, 'field3')
      .replace(/object/g, 'field4')
      .replace(/content/g, 'field5')
      .replace(/plannedEndTime/g, 'field6')
      .replace(/status/g, 'field7')
      .replace(/operationUser/g, 'field8')
      .replace(/operationUnit/g, 'field9')
      .replace(/remark/g, 'field10')
    )
    operationList(result)
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
    setData(target)
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      if (fieldName === 'field1' || fieldName === 'updateTime' || fieldName === 'plannedEndTime' || fieldName === 'field5') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (operationArr) {
      const newarr = (operationArr).map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index,index: index + 1})
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'index', record.key)}
          />
        )
      }
    },
    {
      title: '作业日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
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
      dataIndex: 'nature',
      key: 'nature',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
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
            disabled={detailParams}
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
          <TextArea
            disabled={detailParams}
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
          <DatePicker
            disabled={detailParams}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'plannedEndTime', record.key)}
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
            disabled={detailParams}
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
            disabled={detailParams}
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
            disabled={detailParams}
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
          <TextArea
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
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const copyColumns = [
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
          <TextArea
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
          <DatePicker
            disabled={detailParams}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
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
          <TextArea
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
  }, [operationArr])

  let setColumns = column;

  if(mainId) {
    setColumns = copyColumns
  }

  return (
    <>
      {/* <Row gutter={16}> */}

      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button
          disabled={detailParams}
          type='primary'
          onClick={handleSave}>保存</Button>
      </div>

      <Table
        loading={loading}
        columns={setColumns}
        dataSource={data}
        pagination={false}
      />
    </>
  )
}

export default Form.create({})(LastweekHomework)
