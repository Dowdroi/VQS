import React, { createContext, useContext, ReactNode } from 'react';
import { toJS } from 'mobx';
import SettingStore from './SettingStore';
import UserStore from './UserStore';
import OrganizationStore from './OrganizationStore';
import TaskStore from './TaskStore';
export interface IStores {
  userStore: UserStore;
  settingStore: SettingStore;
  organizationStore: OrganizationStore;
  taskStore: TaskStore;
}

const stores: IStores = {
  userStore: new UserStore(),
  settingStore: new SettingStore(),
  organizationStore: new OrganizationStore(),
  taskStore: new TaskStore(),
};

export const StoreContext: any = createContext<IStores>(stores);

interface StoreProviderProps {
  children: ReactNode;
}
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => (
  <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
);

export const useStore = (): IStores => useContext(StoreContext);
export default stores;
export const toJson = (data: any) => toJS(data);
