import React from 'react';
import { Checkbox, Row, Col } from 'antd';

function index(props) {
  const { defaultVal, records } = props;

  const onChange = (val) => {
    console.log(val)
  }
  return (
    <Checkbox.Group onChange={onChange}>
      <Row>
        {records && records.length > 0 && records.map((obj) => (
          <Col span={8} >
            <Checkbox key={obj.key} value={obj.val}>{obj.val}</Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
}

export default index;