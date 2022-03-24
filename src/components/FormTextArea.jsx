import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

function FormTextArea(props) {
  const { indexText, isEdit, autoSize, getVal } = props;
  const [disabled, setDisabled] = useState(false);
  const [indexHight, setIndexHight] = useState(true);

  const handleChange = (e) => {
    if (getVal) {
      getVal(e?.target?.value || undefined)
    }
  }

  useEffect(() => {
    setIndexHight(true)
  }, [indexText]);

  // const inputElement = useRef(null)

  return (
    <span
      className='collapseArea'
      onDoubleClick={(e) => {
        if (isEdit) {
          setDisabled(false);
        };
        setTimeout(() => {
          if (e.target) {
            if (indexHight) {
              const textheight = e.target.scrollHeight + 2;
              e.target.style.maxHeight = '9.0072e+15px';
              e.target.style.height = `${textheight}px`;
            } else {
              e.target.style.maxHeight = '73px';
              e.target.style.height = '73px';
            }
            setIndexHight(!indexHight)
          }
        }, 50)
      }}>
      {indexHight ? (
        <TextArea
          autoSize={{ minRows: autoSize, maxRows: autoSize }}
          defaultValue={indexText}
          disabled={!isEdit || disabled}
          allowClear
          placeholder="请输入"
          onChange={handleChange}
          key={sessionStorage.getItem('tabid')}
        // ref={inputElement}
        />) : (
        <TextArea
          autoSize={{ minRows: autoSize }}
          defaultValue={indexText}
          disabled={!isEdit || disabled}
          allowClear
          placeholder="请输入"
          onChange={handleChange}
          key={sessionStorage.getItem('tabid')}
        // ref={inputElement}
        />
      )}
    </span>

  );
}

export default FormTextArea;