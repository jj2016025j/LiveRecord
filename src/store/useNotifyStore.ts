import { create } from 'zustand';

type NotifyOptions = {
  title: string;
  des: string | undefined;
  useT?: boolean;
};

type NotifyStoreOptions = {
  basicSuccessQue: Array<NotifyOptions>;
  setBSQ: (basicSuccessQue: Array<NotifyOptions>) => void;
  pushBSQ: (basicSuccessQue: Array<NotifyOptions>) => void;
  shiftBSQ: (count?: number) => void;
  basicErrorQue: Array<NotifyOptions>;
  setBEQ: (basicErrorQue: Array<NotifyOptions>) => void;
  pushBEQ: (basicSuccessQue: Array<NotifyOptions>) => void;
  shiftBEQ: (count?: number) => void;
};

const useNotifyStore = create<NotifyStoreOptions>((set) => ({
  basicSuccessQue: [],
  setBSQ: (basicSuccessQue) => {
    set({ basicSuccessQue });
  },
  pushBSQ: (newQue) => {
    set((states) => {
      const basicSuccessQue = states.basicSuccessQue.concat(newQue);
      return { ...states, basicSuccessQue };
    });
  },
  shiftBSQ: (count) => {
    const useCount = count ? count : 1;
    set((states) => {
      const JsonQue = states.basicSuccessQue.map((screenData) => JSON.stringify(screenData));
      const setQue = Array.from(new Set(JsonQue));
      const getBSQ = (): Array<NotifyOptions> => {
        try {
          const parseQue = setQue.map((screenData) => JSON.parse(screenData) as NotifyOptions);
          return parseQue;
        } catch (error) {
          console.warn('Parse shift BSQ error,', error);
          return [];
        }
      };
      const newBSQ = getBSQ();
      const basicSuccessQue = newBSQ.slice(useCount);
      return { ...states, basicSuccessQue };
    });
  },
  basicErrorQue: [],
  setBEQ: (basicErrorQue) => {
    set({ basicErrorQue });
  },
  pushBEQ: (newQue) => {
    set((states) => {
      const basicErrorQue = states.basicErrorQue.concat(newQue);
      return { ...states, basicErrorQue };
    });
  },
  shiftBEQ: (count) => {
    set((states) => {
      const useCount = count ? count : 1;
      // 使用JSON比對重複物件，刪除時移除
      const JsonQue = states.basicErrorQue.map((screenData) => JSON.stringify(screenData));
      const setQue = Array.from(new Set(JsonQue));
      const getBEC = (): Array<NotifyOptions> => {
        try {
          const parseQue = setQue.map((screenData) => JSON.parse(screenData) as NotifyOptions);
          return parseQue;
        } catch (error) {
          console.warn('Parse shift BEQ error,', error);
          return [];
        }
      };
      const newQue = getBEC();
      const basicErrorQue = newQue.slice(useCount);
      return { ...states, basicErrorQue };
    });
  },
}));

export { useNotifyStore };
export type { NotifyOptions };
