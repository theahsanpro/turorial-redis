export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const userKey = (userID: string) => `users#${userID}`
export const sessionKey = (sessionId: string) => `sessions#${sessionId}`
export const usernameUniquqKey = () => 'usernames:unique';
export const userLikeKey = (userId: string) => `users:likes#${userId}`
export const usernameKey = () => 'usernames';

// Items
export const itemKey = (itemId: string) => `items#${itemId}`
export const itemByViewKey = () => 'items:views'
export const itemEndingAtKey = () => 'items:endingAt'
export const itemViewKey = (itemId: string) => `items:views#${itemId}`
export const bidHistoryKey = (itemId: string) => `history#${itemId}`
export const itemByPriceKey = () => 'items:price'
export const itemsIndexKey = () => 'idx:items';
