export interface HttpGet {
  (request: HttpGetRequest): Promise<{}>;
}

export interface HttpGetRequest {
  url: string;
  queryParams: { [key: string]: string };
  headers: { [key: string]: string };
}

export interface SimpleFetch {
  (url: string, options: { headers: { [key: string]: string } }): Promise<FetchResponse>;
}

export interface FetchResponse {
  json: () => Promise<{}>;
  text: () => Promise<string>;
  ok: boolean;
  status: number;
  statusText: string;
}

export function wrapFetch(fetch: SimpleFetch): HttpGet {
  return ({ url, queryParams, headers }) =>
    fetch(url + "?" + stringifyQueryString(queryParams), { headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return response.text().then(details => {
          throw new Error(`HTTP ${response.status} ${response.statusText}: ${details}`);
        });
      });
}

function stringifyQueryString(params: { [key: string]: string }) {
  return Object.entries(params).map(([key, value]) => key + '=' + value).join('&');
}
