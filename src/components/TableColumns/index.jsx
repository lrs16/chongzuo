import React, { useEffect, useState } from 'react';
import { Checkbox, Row, Col, Input, Button } from 'antd';

const InputGroup = Input.Group;

function TableColumns(props) {
  const { defaultVal, records, ChangeSelectVal } = props;
  const [searchkey, setSearchKey] = useState('');
  const [searchrow, setSearchRow] = useState(undefined);

  const defaultValue = defaultVal.map((item) => {
    return item.key
  });

  const onChange = (val) => {
    const newArr = records.filter((x) => val.some((item) => x.key === item));
    ChangeSelectVal(newArr)
  }

  const handleSearch = () => {
    const newArr = records.filter(item => {
      return item.val.includes(searchkey);
    });
    if (newArr.length > 0) {
      setSearchRow(newArr);
    } else {
      setSearchRow([]);
    }
  }

  return (
    <>
      <InputGroup compact>
        <Input onChange={e => setSearchKey(e.target.value)} placeholder="请输入" allowClear style={{ width: 300 }} />
        <Button type="primary" onClick={() => handleSearch()} >查询</Button>
        <Button onClick={() => setSearchRow(undefined)} >重 置</Button>
      </InputGroup>
      <Checkbox.Group onChange={onChange} defaultValue={defaultValue}>
        {searchrow ? (<Row style={{ marginTop: 24 }}>
          {searchrow && searchrow.length > 0 && searchrow.map((obj) => (
            <Col span={8} >
              <Checkbox key={obj.val} value={obj.key}>{obj.val}</Checkbox>
            </Col>
          ))}
        </Row>) : (
          <Row style={{ marginTop: 24 }}>
            {records && records.length > 0 && records.map((obj) => (
              <Col span={8} >
                <Checkbox key={obj.val} value={obj.key}>{obj.val}</Checkbox>
              </Col>
            ))}
          </Row>)}
      </Checkbox.Group>
    </>
  );
}

export default TableColumns;