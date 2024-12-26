export class MUser {
  id: string;
  sub: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  token: string;
  refresh_token: string;

  constructor(data?: Partial<IUser>) {
    this.id = data?.id || data?.["custom:db_user_id"] || "";
    this.sub = data?.sub || "";
    this.email = data?.email || "";
    this.email_verified = data?.email_verified || false;
    this.first_name = data?.first_name || data?.given_name || "";
    this.last_name = data?.last_name || data?.family_name || "";
    this.token = data?.token || "";
    this.refresh_token = data?.refresh_token || "";
  }
}

interface IUser extends MUser {
  "custom:db_user_id": string;
  family_name: string;
  given_name: string;
}
