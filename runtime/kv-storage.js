/**
 * This replaces the in-worker api calls for kv-storage with rest-api calls.
 */

module.exports = class KvStorage {
  constructor({ accountId, namespace, authEmail, authKey }) {
    this.accountId = accountId;
    this.namespace = namespace;
    this.authEmail = authEmail;
    this.authKey = authKey;
  }

  getUrlForKey(key) {
    return new URL(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/storage/kv/namespaces/${this.namespace}/values/${key}`,
    );
  }

  async get(key, type) {
    const url = this.getUrlForKey(key);

    // eslint-disable-next-line no-undef
    const response = await fetch(url, {
      headers: {
        'X-Auth-Email': this.authEmail,
        'X-Auth-Key': this.authKey,
      },
    });

    if (response.ok) {
      switch (type) {
        case 'json':
          return response.json();
        case 'stream':
          return response;
        case 'arrayBuffer':
          return response.arrayBuffer();
        default:
          return response.text();
      }
    }

    return null;
  }

  async put(key, value, metadata = {}) {
    const url = this.getUrlForKey(key);
    const searchParams = new URLSearchParams();

    if (this.metadata) {
      searchParams.append('metadata', JSON.stringify(metadata));
    }

    const headers = {
      'X-Auth-Email': this.authEmail,
      'X-Auth-Key': this.authKey,
      metadata: JSON.stringify(metadata),
    };

    url.search = searchParams;

    // eslint-disable-next-line no-undef
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers,
      body: value,
    });

    return response.ok;
  }

  async delete(key) {
    const url = this.getUrlForKey(key);

    // eslint-disable-next-line no-undef
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'X-Auth-Email': this.authEmail,
        'X-Auth-Key': this.authKey,
      },
    });
  }
};
