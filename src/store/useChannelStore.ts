import { create } from "zustand";
import { ChannelOptions } from "../api";

interface IChannelStore {
  reservations: Array<ChannelOptions>;
  setChannels: (reservations: Array<ChannelOptions>) => void;
  addChannels: (reservations: Array<ChannelOptions>) => void;
  removeChannels: (IDs: Array<string>) => void;
  updateTransaction: (reservation: ChannelOptions | undefined) => void;
}

const useChannelStore = create<IChannelStore>((set) => ({
  reservations: [],
  setChannels: (reservations) => set({ reservations }),
  addChannels: (newDatas) => {
    set((states) => {
      const reservations = states.reservations.concat(newDatas);
      return { ...states, reservations };
    });
  },
  removeChannels: (IDs) => {
    set((states) => {
      const reservations = states.reservations.filter((screenData) => {
        return !IDs.includes(screenData.id);
      });
      return { ...states, reservations };
    });
  },
  updateTransaction: (data) => {
    if (!data) return;
    set((states) => {
      const originIndex = states.reservations.findIndex(
        (screenData) => screenData.id === data.id
      );
      states.reservations.splice(originIndex, 1, data);
      return states;
    });
  },
}));

export { useChannelStore };
