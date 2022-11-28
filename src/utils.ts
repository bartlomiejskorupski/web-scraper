export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (date: Date): string => date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
