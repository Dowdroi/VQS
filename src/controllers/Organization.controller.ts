import { BaseController } from "@/controllers/index";
import Stores from "@/stores/Stores";
import { MResponse, MOrganization as MOrganization } from "@/models/index";
import { CURRENT_ORGANIZATION } from "@/utils/Contants";
import { MFilterParams } from "@/models/Filter.model";
import { MAgent } from "@/models/Agent.model";

export class OrganizationController extends BaseController {
  constructor() {
    super();
  }

  private async saveOrgs(orgs: MOrganization[]) {
    if (orgs.length > 0) {
      Stores.organizationStore.setOrganizations(orgs);
      let localOrg: any = localStorage.getItem(CURRENT_ORGANIZATION);
      let org;
      try {
        localOrg = localOrg ? JSON.parse(localOrg) : "";
        if (localOrg) org = orgs.find((o) => o.id === localOrg?.id);
      } catch (error) {
        console.error(
          "Error parsing local organization from localStorage:",
          error
        );
      }
      const _org = org || orgs[0];
      console.log(
        "🚀vo-portal: ~ OrganizationController ~ saveOrgs ~ _org:",
        _org
      );
      Stores.organizationStore.setCurrentOrganization(_org);
    }
  }

  async getList({
    params,
  }: {
    params?: MFilterParams;
  } = {}): Promise<MResponse> {
    // let _id = Stores.userStore.user?.id;
    // if (!_id) {
    //   await new UserController().getUser();
    //   _id = Stores.userStore.user?.id;
    // }
    try {
      const rs: MResponse = await this.api.get(
        `/organizations`,
        MOrganization,
        {
          params,
        }
      );

      const organizations: MOrganization[] = rs?.data || [];
      console.log(
        "🚀vo-portal: ~ OrganizationController ~ getList ~ rs:",
        organizations
      );
      await this.saveOrgs(organizations);
      return rs;
    } catch (error) {
      console.log(
        "🚀vo-portal: ~ OrganizationController ~ getList ~ error:",
        error
      );
      return this.throwError(error);
    }
  }

  async add(data: Partial<MOrganization>): Promise<MResponse> {
    try {
      delete data?.id;
      const url = `/organizations`;
      const rs: MResponse = await this.api.post(url, MOrganization, data);

      const org = rs?.data;

      if (org) {
        Stores.organizationStore.setCurrentOrganization(org);
        const currentOrgs = Stores.organizationStore.organizations || [];
        Stores.organizationStore.setOrganizations([org, ...currentOrgs]);
      }
      return rs;
    } catch (error) {
      console.log(
        "🚀vo-portal: ~ OrganizationController ~ add ~ error:",
        error
      );
      return this.throwError(error);
    }
  }

  async getOrganizationById(id: string): Promise<MResponse> {
    try {
      const url = `/organizations/${id}`;
      const rs: MResponse = await this.api.get(url, MOrganization);

      console.log(
        "🚀vo-portal: ~ OrganizationController ~ getOrganizationById ~ org:",
        rs
      );
      return rs;
    } catch (error) {
      console.log(
        "🚀vo-portal: ~ OrganizationController ~ getOrganizationById ~ error:",
        error
      );
      return this.throwError(error);
    }
  }

  async getMembers({
    params,
  }: {
    params?: MFilterParams;
  } = {}): Promise<MResponse> {
    try {
      const url = `/organizations/${Stores.organizationStore.currentOrganization?.id}/members`;
      const rs: MResponse = await this.api.get(url, MAgent, params);
      return rs;
    } catch (error) {
      console.log(
        "🚀vo-portal: ~ OrganizationController ~ getMembers ~ error:",
        error
      );
      return this.throwError(error);
    }
  }
}
