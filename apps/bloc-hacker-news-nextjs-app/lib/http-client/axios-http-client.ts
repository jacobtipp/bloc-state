import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  HttpClient,
  HttpClientOptions,
  HttpMethod,
  HttpResponse,
} from './http-client';

export class AxiosHttpClient extends HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(options: HttpClientOptions) {
    super(options.baseURL, options.endpointSetPrefix, options.version);

    this.axiosInstance = axios.create();

    // Add interceptors
    this.axiosInstance.interceptors.request.use(
      this.requestInterceptor.bind(this)
    );

    this.axiosInstance.interceptors.response.use(
      this.responseSuccessInterceptor.bind(this),
      this.responseErrorInterceptor.bind(this)
    );
  }

  protected async makeRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.request({
      method,
      url,
      data,
      headers,
      signal,
    });
    return {
      data: response.data,
      status: response.status,
    };
  }

  protected async requestInterceptor(
    request: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    // You can modify the request config before sending the request
    // For example, you can add headers, authentication, etc.
    const { method, url } = request;

    console.log(`[${method?.toUpperCase()}] ${url} | Request`);
    return request;
  }

  protected async responseSuccessInterceptor<T>(
    response: AxiosResponse<T>
  ): Promise<AxiosResponse<T>> {
    // You can handle the response data before it's returned
    const { method, url } = response.config;
    const { status } = response;

    console.log(`[${method?.toUpperCase()}] ${url} | Response ${status}`);

    return response;
  }

  protected async responseErrorInterceptor(error: any): Promise<void> {
    // You can handle errors here
    if (axios.isAxiosError(error)) {
      const { message, status, response, config } = error;
      if (config && response) {
        const { data } = response;
        const { method, url } = config;

        console.error(
          `[${method?.toUpperCase()}] ${url} | Error ${status} ${
            data?.message ?? ''
          } | ${message}`
        );
      }
    }

    throw error;
  }

  get<T>(
    url: string,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      'GET',
      this.constructUrl(url),
      undefined,
      headers,
      signal
    );
  }

  post<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      'POST',
      this.constructUrl(url),
      data,
      headers,
      signal
    );
  }

  put<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      'PUT',
      this.constructUrl(url),
      data,
      headers,
      signal
    );
  }

  patch<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      'PATCH',
      this.constructUrl(url),
      data,
      headers,
      signal
    );
  }

  delete<T>(
    url: string,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    return this.request<T>(
      'DELETE',
      this.constructUrl(url),
      undefined,
      headers,
      signal
    );
  }
}
