export const PATRA_STATUS = {
  SENT: 'sent',
  RECEIVED: 'received',
  READ: 'read',
  REPLIED: 'replied',
  FORWARDED: 'forwarded',
  COMPLETED: 'completed'
};

export const PATRA_PRIORITY = {
  NORMAL: 'normal',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const PATRA_VALIDATION = {
  SUBJECT: {
    REQUIRED: true,
    MAX_LENGTH: 255,
    MIN_LENGTH: 3
  },
  CONTENT: {
    REQUIRED: true,
    MIN_LENGTH: 10
  },
  FILE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt']
  }
};

export const PATRA_API_ENDPOINTS = {
  LIST: '/patra/',
  INBOX: '/patra/inbox/',
  SENT: '/patra/sent/',
  DETAIL: (id) => `/patra/${id}/`,
  TRANSFER: (id) => `/patra/${id}/transfer/`,
  TRACKING: (id) => `/patra/${id}/tracking/`,
  MARK_READ: (id) => `/patra/${id}/mark-read/`
};

export const PATRA_FILTER_OPTIONS = {
  STATUS: [
    { value: '', label: 'सबै' },
    { value: PATRA_STATUS.RECEIVED, label: 'प्राप्त' },
    { value: PATRA_STATUS.READ, label: 'पढिएको' },
    { value: PATRA_STATUS.REPLIED, label: 'जवाफ दिइएको' },
    { value: PATRA_STATUS.FORWARDED, label: 'फर्वार्ड गरिएको' }
  ],
  PRIORITY: [
    { value: '', label: 'सबै' },
    { value: PATRA_PRIORITY.NORMAL, label: 'सामान्य' },
    { value: PATRA_PRIORITY.MEDIUM, label: 'मध्यम' },
    { value: PATRA_PRIORITY.HIGH, label: 'उच्च' },
    { value: PATRA_PRIORITY.URGENT, label: 'अति जरुरी' }
  ]
};

export const PATRA_STATUS_COLORS = {
  [PATRA_STATUS.SENT]: 'bg-blue-100 text-blue-800',
  [PATRA_STATUS.RECEIVED]: 'bg-yellow-100 text-yellow-800',
  [PATRA_STATUS.READ]: 'bg-green-100 text-green-800',
  [PATRA_STATUS.REPLIED]: 'bg-purple-100 text-purple-800',
  [PATRA_STATUS.FORWARDED]: 'bg-indigo-100 text-indigo-800',
  [PATRA_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800'
};

export const PATRA_PRIORITY_COLORS = {
  [PATRA_PRIORITY.NORMAL]: 'bg-green-100 text-green-800',
  [PATRA_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [PATRA_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [PATRA_PRIORITY.URGENT]: 'bg-red-100 text-red-800'
};
