import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Tabs, Alert, Tooltip } from 'antd';
import { querkeyVal } from '@/services/api';
import styles from '../index.less';

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TabPane } = Tabs;

function TempEditeTable(props) {
  return (
    <div />
  );
}

export default TempEditeTable;