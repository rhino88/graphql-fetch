type RequestMethod = "GET" | "POST";
type GraphQLFetchArgs<V = unknown> = {
  headers?: HeadersInit;
  query: string;
  operationName?: string;
  method?: RequestMethod;
  url: string;
  variables?: V;
};

// type FetchArgs = Pick<RequestInit, "headers" | "credentials" | "mode"> & {
//   method: RequestMethod;
// };

interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
}

// type Scalar = string | boolean | number | null;
// type ScalarOrList = Scalar | Scalar[];

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: any;
  status: number;
  [key: string]: any;
}

const graphqlFetch = async <T, V>({
  url,
  query,
  operationName,
  variables,
  method = "POST",
  headers = {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "content-type": "application/json",
  },
}: GraphQLFetchArgs<V>): Promise<GraphQLResponse<T>> => {
  const graphQLParams = {
    query: query,
    ...(variables && { variables: JSON.stringify(variables) }),
    ...(operationName && { operationName }),
  };

  const urlAndMaybeParams =
    method === "GET" ? `${url}?${new URLSearchParams(graphQLParams)}` : url;

  const response = await fetch(urlAndMaybeParams, {
    method,
    headers,
    ...(method === "POST" && { body: JSON.stringify(graphQLParams) }),
  });
  const rawResponse = await response.text();
  try {
    return JSON.parse(rawResponse);
  } catch (error) {
    throw error;
  }
};

export default graphqlFetch;
