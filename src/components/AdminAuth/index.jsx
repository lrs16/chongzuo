import { useEffect } from 'react';
import { queryCurrent } from '@/services/user';

function AdminAuth(props) {
  const { getAuth } = props;
  const getroleCode = (data) => {
    return data.filter(item => item.roleCode === 'admin')[0];
  };
  useEffect(() => {
    queryCurrent().then(res => {
      if (res.code === 200) {
        const role = getroleCode(res.data.upmsRolesSetExt);
        const auth = role === undefined ? '' : role.roleCode;
        getAuth(auth);
      }
    })
  }, [])
  return null;
}

export default AdminAuth;