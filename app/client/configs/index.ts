import "../env"

export const PROD = process.env.NODE_ENV == 'production' ? true : false;
export const HOST = process.env.HOST;
export const PORT = process.env.PORT;