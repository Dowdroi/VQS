import { MOrganization } from "@/models/index";
import { CURRENT_ORGANIZATION } from "@/utils/Contants";
import { makeAutoObservable } from "mobx";

class OrganizationStore {
  organizations: MOrganization[] = [];
  currentOrganization: MOrganization = {} as any;

  constructor() {
    makeAutoObservable(this); // Automatically make the properties and methods observable
  }

  setOrganizations(orgs: MOrganization[]) {
    this.organizations = orgs;
  }

  setCurrentOrganization(org: MOrganization) {
    this.currentOrganization = org;
    localStorage.setItem(CURRENT_ORGANIZATION, JSON.stringify(org));
  }
}

export default OrganizationStore;
