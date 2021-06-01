export const health = () => {
  const response = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  return response;
};
