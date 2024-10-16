interface matrixError {
  errcode: string;
  error: string;
}
interface returnError {
  success: false;
  error: string;
}
async function neatifyError(response: Response): Promise<returnError> {
  const responseJson: matrixLoginError = await response.json();
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

interface matrixLogin200 {
  user_id: string;
  device_id: string;
  access_token: string;
  well_known: {
    'm.homeserver': {
      base_url: string;
    };
    'm.identity_server': {
      base_url: string;
    };
  };
}
interface matrixLoginError extends matrixError {
  errcode: 'M_LIMIT_EXCEEDED';
  retry_after_ms: number;
}
export async function matrixLogin(
  userid: string,
  password: string
): Promise<
  | {
      success: true;
      deviceId: string;
      accessToken: string;
      homeserver: string;
    }
  | returnError
> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  const request = new Request(
    'https://' + userid.split(':')[1] + '/_matrix/client/v3/login',
    {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      body: JSON.stringify({
        type: 'm.login.password',
        identifier: {
          type: 'm.id.user',
          user: userid
        },
        password: password
      })
    }
  );
  const response = await fetch(request);
  if (response.status === 200) {
    const responseJson: matrixLogin200 = await response.json();
    return {
      success: true,
      deviceId: responseJson.device_id,
      accessToken: responseJson.access_token,
      homeserver: responseJson.well_known['m.homeserver'].base_url
    };
  } else {
    return await neatifyError(response);
  }
}

interface matrixListJoinedRooms200 {
  joined_rooms: string[];
}
export async function matrixListJoinedRooms(
  homeserver: string,
  accessToken: string
): Promise<
  | {
      success: true;
      rooms: string[];
    }
  | returnError
> {
  if (homeserver === '') {
    return {
      success: false,
      error: 'Not logged in. Use l to login'
    };
  }
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('Authorization', 'Bearer ' + accessToken);
  const request = new Request(homeserver + '_matrix/client/v3/joined_rooms', {
    method: 'GET',
    mode: 'cors',
    headers: headers
  });
  const response = await fetch(request);
  if (response.status === 200) {
    const responseJson: matrixListJoinedRooms200 = await response.json();
    return {
      success: true,
      rooms: responseJson.joined_rooms
    };
  } else {
    return await neatifyError(response);
  }
}

interface matrixListPublicRooms200 {
  chunk: {
    avatar_url?: string;
    canonical_alias?: string;
    guest_can_join: boolean;
    join_rule?: string; // Default 'public
    name?: string;
    num_joined_members: number;
    room_id: string;
    room_type?: string;
    topic?: string;
    world_readable: boolean;
  }[];
  next_batch: string;
  prev_batch: string;
  total_room_count_estimate: number;
}
export async function matrixListPublicRooms(
  homeserver: string,
  accessToken: string,
  server?: string,
  since?: string
): Promise<
  | {
      success: true;
      totalRoomCount: number;
      nextBatch: string;
      prevBatch: string;
      rooms: {
        name?: string;
        id: string;
      }[];
    }
  | returnError
> {
  if (homeserver === '') {
    return {
      success: false,
      error: 'Not logged in. Use l to login'
    };
  }
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('Authorization', 'Bearer ' + accessToken);
  const request = new Request(
    homeserver +
      '_matrix/client/v3/publicRooms' +
      (server || since ? '?' : '') +
      (server ? 'server=' + server : '') +
      (server && since ? '&' : '') +
      (since ? 'since=' + since : ''),
    {
      method: 'GET',
      mode: 'cors',
      headers: headers
    }
  );
  const response = await fetch(request);
  if (response.status === 200) {
    const responseJson: matrixListPublicRooms200 = await response.json();
    return {
      success: true,
      totalRoomCount: responseJson.total_room_count_estimate,
      nextBatch: responseJson.next_batch,
      prevBatch: responseJson.prev_batch,
      rooms: responseJson.chunk.map((room) => ({
        name: room.name,
        id: room.room_id
      }))
    };
  } else {
    return neatifyError(response);
  }
}
