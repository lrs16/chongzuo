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
  DatePicker,
  message
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const QuestionsComments = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    form: { getFieldDecorator },
    defectArr,
    defectList,
    reportSearch
  } = props;
  const [data, setData] = useState([]);

  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      defectList(data)
    }
  }, [data]);

  const handleSave = () => {
    defectList(data);
    message.info('暂存保存数据成功')
  }

  // 新增一条记录
  const newMember = (params) => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      field1: '',
      field2: '',
      field3: '',
    });
    setData(newData);
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
      if (fieldName === 'field1') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    const newarr = defectArr.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const column = [
    {
      title: '发现日期',
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
      title: '缺陷说明',
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
      title: '修复计划',
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
  }, [defectArr])


  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>三、发现问题及修改建议</p>
        </Col>

        <Col>
          <Button
            disabled={reportSearch}
            type='primary'
            onClick={handleSave}>保存</Button>
        </Col>

        <Table
          columns={column}
          dataSource={data}
        />

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="primary"
          ghost
          onClick={() => newMember()}
          icon="plus"
          disabled={reportSearch}
        >
          新增
        </Button>

      </Row>
    </>
  )
})

export default Form.create({})(QuestionsComments)
