import React,{ useEffect, useState } from 'react';

import {
  Popover,
  Checkbox,
  Icon,
  Button,
  Col
} from 'antd';

let formThead;

function CustomList(props) { 
  const {
    allColumns,
    creataColumns,
    controlColumns,
    tablecolumns
  } = props;
  
  const [customcolumns, setCustomcolumns] = useState([]);


  // 初始化展示列内容
  useEffect(() => {
    setCustomcolumns(controlColumns)
  },[])

  const onCheckAllChange = e => {
    setCustomcolumns(e.target.checked ? allColumns : []);
    tablecolumns(e.target.checked ? allColumns : []);

  };

  const onCheck = checkedValues => {
    formThead = allColumns.filter(i => checkedValues.indexOf(i.title) >= 0);

    if (formThead.length === 0) {
      setCustomcolumns([]);
    }
    creataColumns(formThead);
  };

  const defaultAllkey = customcolumns.map(item => {
    return item.title;
  });
  return (
    <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={(customcolumns.length === allColumns.length) === true}
                  >
                    列表展示
                  </Checkbox>
                  <br />
                </div>

                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  defaultValue={customcolumns}
                  style={{ overflowY: 'auto', height: 800 }}
                >
                  {allColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: '8px' }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={customcolumns}
                      >
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}
                </Checkbox.Group>
              </>
            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: '14px' }} />
            </Button>
          </Popover>
        </div>
  )
}

export default CustomList;

