import { BaseController } from "@/controllers/index";
import { MUser } from "@/models/index";
import Stores from "@/stores/Stores";
import { USER_TOKEN_KEY } from "@/utils/Contants";
import * as auth from "aws-amplify/auth";
import { jwtDecode } from "jwt-decode";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  async signIn({ username, password }: { username: string; password: string }) {
    try {
      await auth.signIn({ username, password });
      await this.getToken({ forceRefresh: true });
    } catch (error) {
      console.log("🚀vo-portal: ~ UserController ~ signIn ~ error:", error);
      return "";
    }
  }

  async signOut() {
    try {
      await auth.signOut();
      await this.clearToken();
      Stores.userStore.clearUser();
      // Stores.organizationStore.setCurrentOrganization({} as any);
    } catch (error) {
      console.log("🚀vo-portal: ~ UserController ~ signOut ~ error:", error);
      return "";
    }
  }

  async getToken({
    forceRefresh = false,
  }: { forceRefresh?: boolean } = {}): Promise<string | undefined> {
    try {
      const session = await auth.fetchAuthSession({
        forceRefresh,
      });
      const jwtToken = session.tokens?.accessToken?.toString();
      console.log(
        "🚀vo-portal: ~ UserController ~ getToken ~ jwtToken:",
        jwtToken
      );
      if (jwtToken) {
        this.setToken(jwtToken);

        return jwtToken;
      }
      return "";
    } catch (error) {
      console.log("🚀vo-portal: ~ UserController ~ getToken ~ error:", error);
      return "";
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      Stores.userStore.setToken(token);
      localStorage.setItem(USER_TOKEN_KEY, token);
      this.api.setHeaders({ Authorization: `Bearer ${token}` });
      console.log("🚀vo-portal: ~ UserController ~ setToken ~ token:", token);
    } catch (error) {
      console.log("🚀vo-portal: ~ UserController ~ setToken ~ error:", error);
    }
  }

  async clearToken(): Promise<void> {
    try {
      Stores.userStore.setToken("");
      localStorage.removeItem(USER_TOKEN_KEY);
      this.api.setHeaders({ Authorization: "" });
    } catch (error) {
      console.log("🚀vo-portal: ~ UserController ~ clearToken ~ error:", error);
    }
  }

  async getUser(): Promise<MUser | undefined> {
    try {
      // const user = await this.api.get('employer/workspaces');
      const user = await auth.fetchUserAttributes();
      console.log("🚀 ~ UserController ~ getUser ~ user:", user);
      const _user = new MUser(user as any);
      Stores.userStore.setUser(_user);
      console.log("🚀vo-portal: ~ UserController ~ getUser ~ _user:", _user);
      return _user;
    } catch (error) {
      console.log("🚀vo-portal: ~ UserController ~ getUser ~ error:", error);
      return;
    }
  }

  async isTokenExpired(token?: string): Promise<boolean> {
    const _token = token || Stores.userStore.token;
    if (!_token) return true;

    try {
      const decoded = jwtDecode(_token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Invalid token:", error);
      return true;
    }
  }
}
