import React, { useImperativeHandle, useRef } from 'react';
import {
  Form,
  Input,
  Radio,
  Row,
  Col
} from 'antd';

const BusinessAudit = React.forwardRef((props,ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef
    }),
    []
  )
})

export default Form.create({})(BusinessAudit)