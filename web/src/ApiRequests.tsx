interface matrixLogin200 {
  user_id: string;
  device_id: string;
  access_token: string;
  well_known: {
    base_url: string;
  };
}
interface matrixLogin429 {
  errcode: 'M_LIMIT_EXCEEDED';
  error: string;
  retry_after_ms: number;
}
export async function matrixLogin(
  homeserver: string,
  username: string,
  password: string
): Promise<
  | {
      success: true;
      deviceId: string;
      accessToken: string;
    }
  | {
      success: false;
      error: string;
    }
> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  console.log(homeserver);
  const request = new Request(homeserver + '/_matrix/client/v3/login', {
    method: 'POST',
    mode: 'cors',
    headers: headers,
    body: JSON.stringify({
      type: 'm.login.password',
      identifier: {
        type: 'm.id.user',
        user: '@' + username + ':' + homeserver.split('://')[1]
      },
      password: password
    })
  });
  const response = await fetch(request);
  if (response.status === 200) {
    const responseJson: matrixLogin200 = await response.json();
    return {
      success: true,
      deviceId: responseJson.device_id,
      accessToken: responseJson.access_token
    };
  } else {
    const responseJson: matrixLogin429 = await response.json();
    return {
      success: false,
      error:
        response.status +
        ' ' +
        response.statusText +
        ' ' +
        responseJson.errcode +
        ': ' +
        responseJson.error
    };
  }
}
