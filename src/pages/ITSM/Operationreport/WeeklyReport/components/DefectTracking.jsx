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
let deleteSign = false;
function DefectTracking(props) {

  const {
    legacyArr,
    legacyList,
    detailParams,
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
    });
    setData(newData);
    legacyList(newData);
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    legacyList(newData)
    if (target) {
      if (fieldName === 'field1' || fieldName === 'field1') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    const newarr = target.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index})
    });

    deleteSign = true;
    setData(newarr);
    legacyList(newarr)
  };

  const handleTabledata = () => {
    if (newbutton === false) {
      const newarr = legacyArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  useEffect(() => {
    handleTabledata()
  }, [legacyArr])

  useEffect(() => {
    if (deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])

  const column = [
    {
      title: '日期',
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
      title: '工作项',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <TextArea
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '工作内容',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <TextArea
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '计划完成时间',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={detailParams}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '备注',
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
      <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况</p>


      {deleteSign === false && (
        <Table
          columns={column}
          dataSource={data}
          pagination={false}
          rowKey={record => record.key}
        />
      )}

      <Button
        style={{ width: '100%', marginTop: 16}}
        type="primary"
        ghost
        onClick={() => newMember()}
        icon="plus"
        disabled={detailParams}
      >
        新增
      </Button>
    </>
  )
}

export default Form.create({})(DefectTracking)
  ;