export function postRequest(url: string, payload: unknown) {
  const promise = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json());

  return promise;
}

export function getRequestWithToken(url: string, token: string) {
  const promise = fetch(url, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `${token}`,
    },
  }).then((response) => response.json());

  return promise;
}

export function postRequestWithToken(
  url: string,
  token: string,
  payload: unknown
) {
  const promise = fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json());

  return promise;
}

export function patchRequestWithToken(
  url: string,
  token: string,
  payload: unknown
) {
  const promise = fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json());

  return promise;
}