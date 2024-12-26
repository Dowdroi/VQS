import { BaseController } from "@/controllers/index";
import Stores from "@/stores/Stores";
import { MFile, MResponse } from "@/models/index";
import { isImage, validFileSize } from "@/utils/utils";

export class FileController extends BaseController {
  constructor() {
    super();
  }

  uploadImage = async ({
    file,
    organization_id,
  }: {
    file: File;
    organization_id?: string;
  }): Promise<MResponse> => {
    try {
      if (!isImage(file)) {
        return this.throwError(new Error("File is not an image"));
      }
      if (!validFileSize(file)) {
        return this.throwError(new Error("File size is too large"));
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "organization_id",
        organization_id ||
          Stores.organizationStore.currentOrganization?.id ||
          ""
      );
      const url = "/files/upload/image";
      const rs = await this.api.post(url, MFile, formData);
      return rs;
    } catch (error) {
      console.log(
        "🚀vo-portal: ~ FileController ~ uploadImage ~ error:",
        error
      );
      return this.throwError(error);
    }
  };
}
