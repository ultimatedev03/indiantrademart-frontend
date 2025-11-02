/**
 * Notification Service
 * Handles all notification related API calls
 */

import apiService from './api.service';
import API_CONFIG from '@/config/api.config';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationPreference {
  id: number;
  userId: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  newsAndUpdates: boolean;
}

class NotificationService {
  async getNotifications(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS, {
      params: { page, size },
    });
  }

  async getUnreadNotifications() {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_UNREAD_NOTIFICATIONS);
  }

  async getNotificationCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATION_COUNT);
  }

  async getUnreadCount() {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_UNREAD_COUNT);
  }

  async getNotificationById(id: number) {
    return apiService.get<Notification>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATION_BY_ID(id)
    );
  }

  async markAsRead(id: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id), {});
  }

  async markAllAsRead() {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ, {});
  }

  async markAsUnread(id: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_AS_UNREAD(id), {});
  }

  async deleteNotification(id: number) {
    return apiService.delete(API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE_NOTIFICATION(id));
  }

  async deleteAllNotifications() {
    return apiService.delete(API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE_ALL_NOTIFICATIONS);
  }

  async archiveNotification(id: number) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.ARCHIVE_NOTIFICATION(id), {});
  }

  async getArchivedNotifications(page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_ARCHIVED_NOTIFICATIONS, {
      params: { page, size },
    });
  }

  async getNotificationsByType(type: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_BY_TYPE(type), {
      params: { page, size },
    });
  }

  async searchNotifications(searchTerm: string, page = 0, size = 20) {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SEARCH_NOTIFICATIONS, {
      params: { searchTerm, page, size },
    });
  }

  async getNotificationPreferences() {
    return apiService.get<NotificationPreference>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_PREFERENCES
    );
  }

  async updateNotificationPreferences(data: Partial<NotificationPreference>) {
    return apiService.put<NotificationPreference>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.UPDATE_PREFERENCES,
      data
    );
  }

  async testNotification() {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEST_NOTIFICATION, {});
  }

  async subscribeToTopic(topic: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SUBSCRIBE_TO_TOPIC, { topic });
  }

  async unsubscribeFromTopic(topic: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE_FROM_TOPIC, {
      topic,
    });
  }

  async getSubscribedTopics() {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_SUBSCRIBED_TOPICS);
  }

  async registerPushToken(token: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.REGISTER_PUSH_TOKEN, {
      token,
    });
  }

  async unregisterPushToken(token: string) {
    return apiService.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREGISTER_PUSH_TOKEN, {
      token,
    });
  }

  async getNotificationStatistics() {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_STATISTICS);
  }

  async getRecentNotifications(limit = 10) {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.GET_RECENT_NOTIFICATIONS, {
      params: { limit },
    });
  }

  async exportNotifications(format: 'csv' | 'pdf') {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.EXPORT_NOTIFICATIONS, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'text',
    });
  }
}

export default new NotificationService();
