import { useEffect } from 'react';
import { queryCurrent } from '@/services/user';

function AdminAuth(props) {
  const { getAuth } = props;
  useEffect(() => {
    queryCurrent().then(res => {
      if (res.code === 200) {
        getAuth(res.data.loginCode)
      }
    })
  }, [])
  return null;
}

export default AdminAuth;