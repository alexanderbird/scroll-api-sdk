export interface HttpGet {
  (request: HttpGetRequest): Promise<{}>;
}

export interface HttpGetRequest {
  url: string;
  queryParams: { [key: string]: string };
  headers: { [key: string]: string };
}

export interface SimpleFetch {
  (url: string, options: { headers: { [key: string]: string } }): Promise<{ json: () => Promise<{}> }>;
}

export function wrapFetch(fetch: SimpleFetch): HttpGet {
  return ({ url, queryParams, headers }) =>
    fetch(url + "?" + stringifyQueryString(queryParams), { headers })
      .then(x => x.json());
}

function stringifyQueryString(params: { [key: string]: string }) {
  return Object.entries(params).map(([key, value]) => key + '=' + value).join('&');
}
