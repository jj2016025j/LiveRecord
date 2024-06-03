import { useUserStore } from '@/store';
import { forage } from '../utils/foragePkg';
import { axiosRoot } from '../utils/axiosRoot';

const useLogout = () => {
  const { reset: resetStore } = useUserStore();
  const logout = () => {
    axiosRoot.post('/store/logout', {}).finally(() => {
      const cookies = document.cookie.split('; ');
      cookies.forEach((cookie) => {
        const [name] = cookie.split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });
      forage()
        .clear()
        .then(() => {
          //清除完畢zustand 的內容自動跳轉回首頁，在StaticLeader設定replace順便清除router紀錄
          resetStore();
        });
    }).catch((error) => {
      console.error('Logout failed:', error);
    })
  };
  return { logout };
};

export { useLogout };
