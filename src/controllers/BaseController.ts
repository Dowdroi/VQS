import { generateClient } from "aws-amplify/data";
import Api from "@/api/API";
import { MResponse } from "@/models/Response.model";

export class BaseController {
  client: any;
  api: typeof Api;

  constructor() {
    this.client = generateClient({ authMode: "userPool" });
    this.api = Api;
  }

  throwError(error: any) {
    return new MResponse({ error });
  }
}
