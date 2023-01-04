import Item from "antd/lib/list/Item";

// 规则：[大小写字母数字_-.]@[大小写字母数字_-.].[2-8位的大小写字母]
export const email_reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

// 6-16位字母或数字或特殊字符_-.
export const pwd_reg = /^([A-Za-z0-9_\-\.]{6,16})$/;

// 校验IP地址
export const ip_reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;

// 校验手机号码
export const phone_reg = /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/;

// 数组去重
export const uniqueItem = (arr, fieldName) => {
  const res = new Map();
  if (arr && arr.length) {
    if (fieldName) {
      return arr.filter((item) => !res.has(item[fieldName]) && res.set(item[fieldName], 1))
    }
    return arr.filter((item) => !res.has(item) && res.set(Item, 1))
  }
  return null
}

// 取数组属性组成新的数组
export const ObjkeyToArr = (arr, fieldName) => {
  if (arr && arr.length && fieldName) {
    const newArr = arr.map((obj) => {
      return obj[fieldName]
    });
    return newArr;
  }
  return null;
};

// 获取数组某个对象
export const getRow = (key, data) => {
  return data.filter(item => item[key] === key)[0];
};