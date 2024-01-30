export interface HttpResponse<T = undefined> {
  data: T;
  status: number;
}

export interface HttpClientOptions {
  baseURL: string;
  endpointSetPrefix?: string;
  version?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export abstract class HttpClient {
  private readonly baseURL: string;
  private readonly endpointSetPrefix?: string;
  private readonly version?: string;

  constructor(baseURL: string, endpointSetPrefix?: string, version?: string) {
    this.baseURL = baseURL;
    this.endpointSetPrefix = endpointSetPrefix;
    this.version = version;
  }

  protected constructUrl(endpoint: string): string {
    let fullUrl = this.baseURL;

    if (this.endpointSetPrefix) {
      fullUrl += `/${this.endpointSetPrefix}`;
    }

    if (this.version) {
      fullUrl += `/${this.version}`;
    }

    fullUrl += endpoint;
    return fullUrl;
  }

  protected abstract makeRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>>;

  protected async request<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>> {
    const response = await this.makeRequest<T>(
      method,
      url,
      data,
      headers,
      signal
    );
    return response;
  }

  abstract get<T>(
    url: string,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>>;

  abstract post<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>>;

  abstract put<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>>;

  abstract patch<T>(
    url: string,
    data?: any,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>>;

  abstract delete<T>(
    url: string,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<HttpResponse<T>>;
}
