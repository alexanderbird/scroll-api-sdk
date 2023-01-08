export interface HttpGet {
  (request: HttpGetRequest): Promise<{}>;
}

export interface HttpGetRequest {
  url: string;
  queryParams: { [key: string]: string };
  headers: { [key: string]: string };
  logSink: (key: string, value: any) => void;
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
  return ({ url, queryParams, headers, logSink }) => {
    const urlWithParams = url + "?" + stringifyQueryString(queryParams);
    logSink('urlWithParams', urlWithParams);
    return fetch(urlWithParams, { headers })
      .then(response => {
        logSink('responseStatus', response.status);
        if (response.ok) {
          return response.json().then(json => {
            if (json['__type']) {
              throw new Error(`Internal failure that we haven't correctly mapped to 500 status code yet. ${JSON.stringify(json, null, 2)}`);
            }
            logSink('responseJson', json);
            return json;
          });
        }
        return response.text().then(details => {
          throw new Error(`HTTP ${response.status} ${response.statusText}: ${details}`);
        });
      });
    };
}

function stringifyQueryString(params: { [key: string]: string }) {
  return Object.entries(params).map(([key, value]) => key + '=' + value).join('&');
}
