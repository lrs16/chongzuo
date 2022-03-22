import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

function FormTextArea(props) {
  const { indexText, isEdit, autoSize, Areakey } = props;
  const [disabled, setDisabled] = useState(false);
  const [indexHight, setIndexHight] = useState(true);

  useEffect(() => {
    if (Areakey) {
      setIndexHight(true)
    }
  }, [Areakey]);

  return (
    <span
      className={Areakey}
      onDoubleClick={(e) => {
        if (isEdit) {
          setDisabled(false);
        };
        setTimeout(() => {
          const textAreas = document.getElementsByClassName(Areakey);
          if (textAreas && textAreas.length > 1) {
            console.error('FormTextArea配置了相同Areakey');
          };
          if (textAreas && textAreas.length === 1) {
            const inputs = document.getElementsByClassName(Areakey)[0]?.getElementsByTagName('textarea');
            if (inputs) {
              if (indexHight) {
                const textheight = inputs[0]?.scrollHeight + 2;
                inputs[0].style.maxHeight = '9.0072e+15px';
                inputs[0].style.height = `${textheight}px`;
              } else {
                inputs[0].style.maxHeight = '73px';
                inputs[0].style.height = '73px';
              }
              setIndexHight(!indexHight)
            };
          }
        }, 50)
      }}>
      <TextArea
        autoSize={{ minRows: autoSize, maxRows: autoSize }}
        defaultValue={indexText}
        disabled={(!indexText && !isEdit) || disabled}
        allowClear
        placeholder="请输入"
      />
    </span>
  );
}

export default FormTextArea;