import { makeAutoObservable } from 'mobx';

type ToastFunction = (props: {
  title: string;
  description: string;
  variant?: 'default' | 'danger' | 'info' | 'destructive' | 'success';
}) => void;

class SettingStore {
  isLoading = false;
  globalLoading = false;
  private toastFunction: ToastFunction | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  setGlobalLoading(value: boolean) {
    this.globalLoading = value;
  }

  setToastFunction(toast: ToastFunction) {
    this.toastFunction = toast;
  }

  showToast(props: Parameters<ToastFunction>[0]) {
    if (this.toastFunction) {
      this.toastFunction(props);
    } else {
      console.warn('Toast function is not set');
    }
  }
}

export default SettingStore;
