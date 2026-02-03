const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

interface GHLConfig {
  accessToken: string;
  locationId: string;
}

export class GHLClient {
  private accessToken: string;
  private locationId: string;

  constructor(config: GHLConfig) {
    this.accessToken = config.accessToken;
    this.locationId = config.locationId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${GHL_API_BASE}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Version': GHL_API_VERSION,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GHL API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // ============================================
  // Social Media Posting
  // ============================================

  async getSocialMediaAccounts() {
    return this.request<{ accounts: any[] }>(
      `/social-media-posting/${this.locationId}/accounts`
    );
  }

  async createPost(data: {
    accountIds: string[];
    content: string;
    mediaUrls?: string[];
    scheduleDate?: string;
  }) {
    return this.request<{ post: any }>(
      `/social-media-posting/${this.locationId}/posts`,
      {
        method: 'POST',
        body: JSON.stringify({
          accountIds: data.accountIds,
          summary: data.content,
          media: data.mediaUrls?.map(url => ({ url, type: 'image' })) || [],
          status: data.scheduleDate ? 'scheduled' : 'published',
          scheduleDate: data.scheduleDate,
        }),
      }
    );
  }

  async getPost(postId: string) {
    return this.request<{ post: any }>(
      `/social-media-posting/${this.locationId}/posts/${postId}`
    );
  }

  async deletePost(postId: string) {
    return this.request<void>(
      `/social-media-posting/${this.locationId}/posts/${postId}`,
      { method: 'DELETE' }
    );
  }

  async getPostAnalytics(postId: string) {
    return this.request<{ analytics: any }>(
      `/social-media-posting/${this.locationId}/posts/${postId}/analytics`
    );
  }

  // ============================================
  // Contacts (for lead capture)
  // ============================================

  async createContact(data: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    tags?: string[];
    source?: string;
    customFields?: Record<string, string>;
  }) {
    return this.request<{ contact: any }>(
      '/contacts/',
      {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          locationId: this.locationId,
        }),
      }
    );
  }

  async getContact(contactId: string) {
    return this.request<{ contact: any }>(`/contacts/${contactId}`);
  }

  async searchContacts(query: string) {
    return this.request<{ contacts: any[] }>(
      `/contacts/search?locationId=${this.locationId}&query=${encodeURIComponent(query)}`
    );
  }

  async addTagToContact(contactId: string, tags: string[]) {
    return this.request<{ contact: any }>(
      `/contacts/${contactId}/tags`,
      {
        method: 'POST',
        body: JSON.stringify({ tags }),
      }
    );
  }

  // ============================================
  // Google Business Profile
  // ============================================

  async getGMBLocations() {
    return this.request<{ locations: any[] }>(
      `/social-media-posting/${this.locationId}/google/accounts`
    );
  }

  async createGMBPost(data: {
    accountId: string;
    content: string;
    mediaUrls?: string[];
    callToAction?: {
      type: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL';
      url?: string;
    };
  }) {
    return this.request<{ post: any }>(
      `/social-media-posting/${this.locationId}/google/posts`,
      {
        method: 'POST',
        body: JSON.stringify({
          accountId: data.accountId,
          summary: data.content,
          media: data.mediaUrls?.map(url => ({ url, type: 'image' })) || [],
          callToAction: data.callToAction,
        }),
      }
    );
  }
}

export function createGHLClient(accessToken: string, locationId: string) {
  return new GHLClient({ accessToken, locationId });
}
