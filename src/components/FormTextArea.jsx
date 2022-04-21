import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

function FormTextArea(props) {
  const { indexText, isEdit, autoSize, getVal } = props;
  const [disabled, setDisabled] = useState(false);
  const [indexHight, setIndexHight] = useState(true);
  const [showEllipsis, setShowEllipsis] = useState(false);

  const handleChange = (e) => {
    console.log('textArea:', e);
    if (getVal) {
      getVal(e?.target?.value || undefined)
    }
  }

  useEffect(() => {
    setIndexHight(true)
  }, [indexText]);

  // const inputElement = useRef(null)

  return (
    <div
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
              const h = autoSize * 21 + 11;
              e.target.style.maxHeight = `${h}px`;
              e.target.style.height = `${h}px`;
            }
            setIndexHight(!indexHight)
          }
        }, 50)
      }}>
      {indexHight ? (
        <>
          {/* <div id='ellipsis' style={{ position: 'absolute', right: 11, bottom: 3, zIndex: 9999 }}>...</div> */}
          <TextArea
            autoSize={{ minRows: autoSize, maxRows: autoSize }}
            defaultValue={indexText}
            disabled={!isEdit || disabled}
            allowClear
            placeholder="请输入"
            onChange={handleChange}
          // ref={inputElement}
          />
        </>) : (
        <TextArea
          autoSize={{ minRows: autoSize }}
          defaultValue={indexText}
          disabled={!isEdit || disabled}
          allowClear
          placeholder="请输入"
          onChange={handleChange}
        // ref={inputElement}
        />
      )}
    </div>

  );
}

export default FormTextArea;