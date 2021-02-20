import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

// Adds the access token to all requests
const jsonClient = (url, options = {}) => {
  const token = localStorage.getItem("access_token");
  console.log("httpClient " + url);
  if (token != null) {
    options.user = {
      authenticated: true,
      token: `Bearer ${token}`,
    };
  }
  return fetchUtils.fetchJson(url, options);
};

const c_to_id = (user_name, resource) => {
  if (user_name.indexOf('navgurukul.org')>-1)
    return user_name;

  if (resource === 'users' || resource=== "connections")
    return '@'+ user_name +':navgurukul.org';
  else if (resource === 'rooms')
    return '#' + user_name + ':navgurukul.org';

  return user_name;
}
const mxcUrlToHttp = mxcUrl => {
  const homeserver = localStorage.getItem("base_url");
  const re = /^mxc:\/\/([^/]+)\/(\w+)/;
  var ret = re.exec(mxcUrl);
  console.log("mxcClient " + ret);
  if (ret == null) return null;
  const serverName = ret[1];
  const mediaId = ret[2];
  return `${homeserver}/_matrix/media/r0/thumbnail/${serverName}/${mediaId}?width=24&height=24&method=scale`;
};

const resourceMap = {
  users: {
    path: "/_synapse/admin/v2/users",
    map: u => ({
      ...u,
      id: u.name.split(':')[0].slice(1),
      avatar_src: mxcUrlToHttp(u.avatar_url),
      is_guest: !!u.is_guest,
      admin: !!u.admin,
      deactivated: !!u.deactivated,
      // need timestamp in milliseconds
      creation_ts_ms: u.creation_ts * 1000,
    }),
    data: "users",
    total: json => json.total,
    create: data => ({
      endpoint: `/_synapse/admin/v2/users/${data.id}`,
      body: data,
      method: "PUT",
    }),
    delete: params => ({
      endpoint: `/_synapse/admin/v1/deactivate/${c_to_id(params.id, 'users')}`,
      body: { erase: true },
      method: "POST",
    }),
  },
  rooms: {
    path: "/_synapse/admin/v1/rooms",
    map: r => ({
      ...r,
      id: r.room_id,
      alias: r.canonical_alias,
      members: r.joined_members,
      is_encrypted: !!r.encryption,
      federatable: !!r.federatable,
      public: !!r.public,
    }),
    data: "rooms",
    total: json => {
      return json.total_rooms;
    },
    delete: params => ({
      endpoint: `/_synapse/admin/v1/rooms/${params.id}/delete`,
      body: { block: false },
      method: "POST",
    }),
  },
  reports: {
    path: "/_synapse/admin/v1/event_reports",
    map: er => ({
      ...er,
      id: er.id,
    }),
    data: "event_reports",
    total: json => json.total,
  },
  devices: {
    map: d => ({
      ...d,
      id: d.device_id,
    }),
    data: "devices",
    total: json => {
      return json.total;
    },
    reference: id => ({
      endpoint: `/_synapse/admin/v2/users/${id}/devices`,
    }),
    delete: params => ({
      endpoint: `/_synapse/admin/v2/users/${params.user_id}/devices/${params.id}`,
    }),
  },
  connections: {
    path: "/_synapse/admin/v1/whois",
    map: c => ({
      ...c,
      id: c_to_id(c.user_id),
    }),
    data: "connections",
  },
  room_members: {
    map: m => ({
      id: m,
    }),
    reference: id => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/members`,
    }),
    data: "members",
    total: json => {
      return json.total;
    },
  },
  pushers: {
    map: p => ({
      ...p,
      id: p.pushkey,
    }),
    reference: id => ({
      endpoint: `/_synapse/admin/v1/users/${id}/pushers`,
    }),
    data: "pushers",
    total: json => {
      return json.total;
    },
  },
  joined_rooms: {
    map: jr => ({
      id: jr,
    }),
    reference: id => ({
      endpoint: `/_synapse/admin/v1/users/${id}/joined_rooms`,
    }),
    data: "joined_rooms",
    total: json => {
      return json.total;
    },
  },
  users_media: {
    map: um => ({
      ...um,
      id: um.media_id,
    }),
    reference: id => ({
      endpoint: `/_synapse/admin/v1/users/${id}/media`,
    }),
    data: "media",
    total: json => {
      return json.total;
    },
    delete: params => ({
      endpoint: `/_synapse/admin/v1/media/${localStorage.getItem(
        "home_server"
      )}/${params.id}`,
    }),
  },
  servernotices: {
    map: n => ({ id: n.event_id }),
    create: data => ({
      endpoint: "/_synapse/admin/v1/send_server_notice",
      body: {
        user_id: data.id,
        content: {
          msgtype: "m.text",
          body: data.body,
        },
      },
      method: "POST",
    }),
  },
  user_media_statistics: {
    path: "/_synapse/admin/v1/statistics/users/media",
    map: usms => ({
      ...usms,
      id: usms.user_id,
    }),
    data: "users",
    total: json => {
      return json.total;
    },
  },
};

function filterNullValues(key, value) {
  // Filtering out null properties
  if (value === null) {
    return undefined;
  }
  return value;
}

function getSearchOrder(order) {
  if (order === "DESC") {
    return "b";
  } else {
    return "f";
  }
}

const dataProvider = {
  getList: (resource, params) => {
    console.log("getList " + resource);
    const { user_id, name, guests, deactivated, search_term } = params.filter;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const from = (page - 1) * perPage;
    const query = {
      from: from,
      limit: perPage,
      user_id: user_id,
      search_term: search_term,
      name: name,
      guests: guests,
      deactivated: deactivated,
      order_by: field,
      dir: getSearchOrder(order),
    };
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const url = `${endpoint_url}?${stringify(query)}`;

    return jsonClient(url).then(({ json }) => ({
      data: json[res.data].map(res.map),
      total: res.total(json, from, perPage),
    }));
  },

  getOne: (resource, params) => {
    console.log("getOne " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];
    params.id = c_to_id(params.id, resource);

    const endpoint_url = homeserver + res.path;
    return jsonClient(`${endpoint_url}/${params.id}`).then(({ json }) => ({
      data: res.map(json),
    }));
  },

  getMany: (resource, params) => {
    console.log("getMany " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    return Promise.all(
      params.ids.map(
        id => {
          console.log(id);
          return jsonClient(`${endpoint_url}/${c_to_id(id, resource)}`)
        }
      )
    ).then(responses => ({
      data: responses.map(({ json }) => res.map(json)),
      total: responses.length,
    }));
  },

  getManyReference: (resource, params) => {
    console.log("getManyReference " + resource);
    const { page, perPage } = params.pagination;
    const from = (page - 1) * perPage;
    const query = {
      from: from,
      limit: perPage,
    };

    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    const ref = res["reference"](params.id);
    const endpoint_url = `${homeserver}${ref.endpoint}?${stringify(query)}`;

    return jsonClient(endpoint_url).then(({ headers, json }) => ({
      data: json[res.data].map(res.map),
      total: res.total(json, from, perPage),
    }));
  },

  update: (resource, params) => {
    console.log("update " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    return jsonClient(`${endpoint_url}/${c_to_id(params.data.id, resource)}`, {
      method: "PUT",
      body: JSON.stringify(params.data, filterNullValues),
    }).then(({ json }) => ({
      data: res.map(json),
    }));
  },

  updateMany: (resource, params) => {
    console.log("updateMany " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    return Promise.all(
      params.ids.map(id => jsonClient(`${endpoint_url}/${c_to_id(id, resource)}`), {
        method: "PUT",
        body: JSON.stringify(params.data, filterNullValues),
      })
    ).then(responses => ({
      data: responses.map(({ json }) => json),
    }));
  },

  create: (resource, params) => {
    console.log("create " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    if (!("create" in res)) return Promise.reject();

    params.data.id = c_to_id(params.data.id, resource);
    params.data.threepids=[];

    if (params.data.email)
      params.data.threepids.push({"medium": "email", "address": params.data.email})

    if (params.data.msisdn)
      params.data.threepids.push({"medium": "msisdn", "address": params.data.msisdn})

    const create = res["create"](params.data);
    const endpoint_url = homeserver + create.endpoint;
    return jsonClient(endpoint_url, {
      method: create.method,
      body: JSON.stringify(create.body, filterNullValues),
    }).then(({ json }) => ({
      data: res.map(json),
    }));
  },

  createMany: (resource, params) => {
    console.log("createMany " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];
    if (!("create" in res)) return Promise.reject();

    return Promise.all(
      params.ids.map(id => {
        params.data.id = id;
        const cre = res["create"](params.data);
        const endpoint_url = homeserver + cre.endpoint;
        return jsonClient(endpoint_url, {
          method: cre.method,
          body: JSON.stringify(cre.body, filterNullValues),
        });
      })
    ).then(responses => ({
      data: responses.map(({ json }) => json),
    }));
  },

  delete: (resource, params) => {
    console.log("delete " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    if ("delete" in res) {
      const del = res["delete"](params);
      const endpoint_url = homeserver + del.endpoint;

      console.log(23, del.body);

      return jsonClient(endpoint_url, {
        method: "method" in del ? del.method : "DELETE",
        body: "body" in del ? JSON.stringify(del.body) : null,
      }).then(({ json }) => ({
        data: json,
      }));
    } else {
      console.log(12, params);
      const endpoint_url = homeserver + res.path;
      return jsonClient(`${endpoint_url}/${params.id}`, {
        method: "DELETE",
        body: JSON.stringify(params.data, filterNullValues),
      }).then(({ json }) => ({
        data: json,
      }));
    }
  },

  deleteMany: (resource, params) => {
    console.log("deleteMany " + resource, params);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) return Promise.reject();

    const res = resourceMap[resource];

    if ("delete" in res) {
      return Promise.all(
        params.ids.map(id => {
          const del = res["delete"]({ ...params, id: id });
          const endpoint_url = homeserver + del.endpoint;
          console.log(endpoint_url);
          return jsonClient(endpoint_url, {
            method: "method" in del ? del.method : "DELETE",
            body: "body" in del ? JSON.stringify(del.body) : null,
          });
        })
      ).then(responses => ({
        data: responses.map(({ json }) => json),
      }));
    } else {
      const endpoint_url = homeserver + res.path;
      console.log(endpoint_url);
      return Promise.all(
        params.ids.map(id => {
            console.log(id);
            return jsonClient(`${endpoint_url}/${c_to_id(id, resource)}`, {
              method: "DELETE",
              body: JSON.stringify(params.data, filterNullValues),
            })
          }
        )
      ).then(responses => ({
        data: responses.map(({ json }) => json),
      }));
    }
  },
};

export default dataProvider;
