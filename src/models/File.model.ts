export class MFile {
  file_key: string;
  file_name: string;
  content_type: string;
  size: number;
  version: number;
  attributes: {
    height: number;
    width: number;
    size: number;
    version: number;
  };
  download_url: string;

  constructor(data?: Partial<MFile>) {
    this.file_key = data?.file_key || "";
    this.file_name = data?.file_name || "";
    this.content_type = data?.content_type || "";
    this.size = data?.size || 0;
    this.version = data?.version || 1;
    this.attributes = {
      height: data?.attributes?.height || 0,
      width: data?.attributes?.width || 0,
      size: data?.attributes?.size || 0,
      version: data?.attributes?.version || 1,
    };
    this.download_url = data?.download_url || "";
  }

  getExtension(): string {
    return this.file_name.split(".").pop() || "";
  }

  isImage(): boolean {
    return this.content_type.startsWith("image/");
  }
}
