import { MUser } from "@/models/index";
import { makeAutoObservable } from "mobx";

class UserStore {
  user: Partial<MUser> = {};
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: MUser) {
    this.user = user;
  }

  clearUser() {
    this.user = {};
  }

  setToken(token: string) {
    this.token = token;
  }
}

export default UserStore;
