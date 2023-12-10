import axios from 'axios';

export const createApiClient = () => {
  const HN_BASE_API = 'https://hacker-news.firebaseio.com/v0';

  const client = axios.create({
    baseURL: HN_BASE_API,
  });

  client.interceptors.request.use((request) => {
    const { method, url } = request;

    console.log(`[${method?.toUpperCase()}] ${url} | Request`);

    return request;
  });

  client.interceptors.response.use(
    (response) => {
      const { method, url } = response.config;
      const { status } = response;

      console.log(`[${method?.toUpperCase()}] ${url} | Response ${status}`);

      return response;
    },
    (error) => {
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

      Promise.reject(error);
    }
  );

  return client;
};
