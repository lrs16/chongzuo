import React, { useState } from 'react';
import {
  Drawer
} from 'antd';

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function AddHolidaySetting(props) {
  const [visible,setVisible] = useState(false);
  const {
    title,
  } = props;
}

