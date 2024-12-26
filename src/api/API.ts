import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Stores from "@/stores/Stores";
import configs from "@/configs/config.json";
import * as auth from "aws-amplify/auth";
import { USER_TOKEN_KEY } from "@/utils/Contants";
import { MResponse } from "@/models/index";

interface ApiProps {
  apiEndpoint?: string;
  basicAuth?: { username?: string; password?: string };
  token?: string;
}

class Api {
  private axiosInstance!: AxiosInstance;
  private config: AxiosRequestConfig;

  constructor({ apiEndpoint, basicAuth, token }: ApiProps = {}) {
    this.config = {
      baseURL: apiEndpoint || configs.apiEndpoint,
      headers: {},
    };

    if (basicAuth) {
      const { username, password } = basicAuth;
      const _auth = "Basic " + btoa(`${username}:${password}`);
      if (this.config.headers) {
        this.config.headers["Authorization"] = _auth;
      }
    }

    const _token = Stores.userStore.token || token;
    if (_token) {
      if (this.config.headers) {
        this.config.headers["Authorization"] = `Bearer ${_token}`;
      }
    }

    this.setUp();
  }

  private setUp() {
    this.axiosInstance = axios.create(this.config);
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
  }

  public setHeaders(headers: Record<string, string>) {
    this.config.headers = { ...this.config.headers, ...headers };
    this.setUp();
  }

  public setBaseUrl(apiEndpoint: string) {
    this.config.baseURL = apiEndpoint;
    this.setUp();
  }

  // Generic request method with retry logic
  private async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    modelClass?: { new (data: any): T },
    dataOrParams?: any,
    retryCount: number = 1 // Retry count to control how many retries are allowed
  ): Promise<MResponse> {
    let fullUrl = url;
    let response: AxiosResponse<T>;

    try {
      // Handle URL parameters for GET and DELETE requests
      if (method === "get" || method === "delete") {
        const queryString = this.getUrlParams(dataOrParams || {});
        fullUrl = `${url}${queryString}`;
        response = await this.axiosInstance[method](fullUrl);
      } else {
        response = await this.axiosInstance[method](url, dataOrParams);
      }

      console.log("🚀vo-portal: ~ Api ~ request ~ response:", response);

      return this.convertData<T>(response, modelClass);
    } catch (error: any) {
      console.log("🚀vo-portal: ~ Api ~ request ~ error:", error);

      // Check if the error status is 401 (Unauthorized) and we should retry
      if (error.response && error.response.status === 401 && retryCount > 0) {
        try {
          console.log("🚀vo-portal: ~ Api ~ request ~ try to refresh token");
          // Attempt to refresh the token
          const session = await auth.fetchAuthSession({ forceRefresh: true });
          const jwtToken = session.tokens?.accessToken?.toString();
          console.log("🚀vo-portal: ~ Api ~ jwtToken:", jwtToken);

          if (jwtToken) {
            // Set the new token
            Stores.userStore.setToken(jwtToken);
            localStorage.setItem(USER_TOKEN_KEY, jwtToken);
            this.setHeaders({ Authorization: `Bearer ${jwtToken}` });

            // Retry the original request with the refreshed token and decrement the retry count
            return this.request(
              method,
              url,
              modelClass,
              dataOrParams,
              retryCount - 1
            );
          } else {
            throw new Error(
              "🚀vo-portal: ~ Api ~ request ~ Failed to refresh token"
            );
          }
        } catch (tokenError) {
          console.log("🚀vo-portal: ~ Api ~ request ~ tokenError:", tokenError);
          throw tokenError;
        }
      }

      // If it's not a 401 error or retry limit is exceeded, throw the error
      throw error;
    }
  }

  // Generic GET request method
  public async get<T>(
    url: string,
    modelClass?: { new (data: any): T },
    params: Record<string, any> = {}
  ): Promise<MResponse> {
    return this.request("get", url, modelClass, params);
  }

  // Generic POST request method
  public async post<T>(
    url: string,
    modelClass?: { new (data: any): T },
    data: any = {}
  ): Promise<MResponse> {
    return this.request("post", url, modelClass, data);
  }

  // Generic PUT request method
  public async put<T>(
    url: string,
    modelClass?: { new (data: any): T },
    data: any = {}
  ): Promise<MResponse> {
    return this.request("put", url, modelClass, data);
  }

  // Generic PATCH request method
  public async patch<T>(
    url: string,
    modelClass?: { new (data: any): T },
    data: any = {}
  ): Promise<MResponse> {
    return this.request("patch", url, modelClass, data);
  }

  // Generic DELETE request method
  public async delete<T>(
    url: string,
    modelClass?: { new (data: any): T },
    params: Record<string, any> = {}
  ): Promise<MResponse> {
    return this.request("delete", url, modelClass, params);
  }

  // Handle response globally
  private handleResponse(response: AxiosResponse) {
    return response;
  }

  // Handle errors globally
  private handleError(error: any) {
    console.error("API call failed:", error);
    return Promise.reject(error);
  }

  // Convert data
  private convertData<T>(
    response: AxiosResponse,
    modelClass?: { new (data: any): T }
  ): MResponse {
    // let { data } = response.data; // Assuming your response data structure is { data: actualData }
    // console.log('🚀vo-portal: ~ Api ~ convertData ~ response:', response);

    // // Determine if data is an array
    // if (Array.isArray(data) && data.length > 0) {
    //   // Map each item in the array to an instance of the modelClass
    //   data = data.map((item) => new modelClass(item)) as unknown as T;
    // } else if (data) {
    //   // Create a single instance of modelClass if data is an object
    //   data = new modelClass(data);
    // }
    // If modelClass is provided, convert the data
    let data: T | T[];
    const _response: MResponse = new MResponse(response.data);
    _response.code = response.status;
    _response.status = response.statusText;
    if (modelClass && _response.data) {
      if (Array.isArray(_response.data)) {
        data = _response.data.map((item: any) => new modelClass(item));
      } else {
        data = new modelClass(_response.data);
      }
    } else {
      data = _response.data;
    }

    _response.data = data;
    console.log("🚀vo-portal: ~ Api ~ _data:", _response);

    return _response;
  }

  // Get URL params
  private getUrlParams(params: Record<string, any>) {
    return params ? `?${new URLSearchParams(params).toString()}` : "";
  }
}

export default new Api();
