import { create } from 'zustand';

type StoreOption = {
  visible: boolean;
  setVisible: (visible?: boolean) => void;
  close: () => void;
};

const useCsStore = create<StoreOption>((set) => ({
  visible: false,
  setVisible: (visible) => {
    if (visible === undefined) {
      set((state) => ({
        visible: !state.visible,
      }));
    } else {
      set({ visible });
    }
  },
  close: () => set({ visible: false }),
}));

export { useCsStore };
