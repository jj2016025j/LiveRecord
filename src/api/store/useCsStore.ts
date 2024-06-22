import type { RoleTypes } from '@/api';
import { MessageTypeNum, VerifyStatusNum } from '@/utils/enums';
import { memberListInit } from '@/utils/initData';
import dayjs from 'dayjs';
import { create } from 'zustand';

type MemberOptions = {
  userId: string;
  userName: string;
  roles: Array<RoleTypes>;
  kycVerifyStatus: VerifyStatusNum;
};

type ChatOptions = {
  memberId: string;
  message: string;
  type: MessageTypeNum;
  isRead: boolean;
  date: string;
  role: RoleTypes;
  id: string;
};

type CsStoreInit = {
  visible: boolean;
  members: Array<MemberOptions>;
  chats: Array<ChatOptions>;
};

interface ICsOptions extends CsStoreInit {
  setVisible: (visible?: boolean) => void;
  setMembers: (members: Array<MemberOptions>) => void;
  setChats: (chats: Array<ChatOptions>) => void;
  updateChats: (chats: Array<ChatOptions>) => void;
  addChats: (chats: Array<ChatOptions>) => void;
}

const init: CsStoreInit = {
  visible: false,
  members: memberListInit({ isTest: true }),
  chats: [],
};
const useCsStore = create<ICsOptions>((set) => ({
  ...init,
  setVisible: (visible) => {
    if (visible === undefined) {
      set((state) => ({
        visible: !state.visible,
      }));
    } else {
      set({ visible });
    }
  },
  setMembers: (members) => set({ members }),
  setChats: (newChats) =>
    set(() => {
      const chats = newChats.slice();
      chats.sort((a, b) => {
        if (dayjs(a.date).isAfter(b.date)) return 1;
        if (dayjs(a.date).isBefore(b.date)) return -1;
        return 0;
      });
      return { chats };
    }),
  updateChats: (newChats) =>
    set((state) => {
      const chats = state.chats.slice();
      newChats.forEach((newChat) => {
        const originIndex = chats.findIndex((originC) => originC.id === newChat.id);
        if (originIndex !== -1) chats.splice(originIndex, 1, newChat);
      });
      return { ...state, chats };
    }),
  addChats: (newChats: Array<ChatOptions>) =>
    set((state) => {
      const chats = state.chats.concat(newChats);
      chats.sort((a, b) => {
        if (dayjs(a.date).isAfter(b.date)) return 1;
        if (dayjs(a.date).isBefore(b.date)) return -1;
        return 0;
      });
      return { ...state, chats };
    }),
}));

export { useCsStore };
export type { ICsOptions, CsStoreInit, MemberOptions, ChatOptions };
