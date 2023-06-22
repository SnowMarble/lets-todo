declare global {
  namespace Express {
    interface Request {
      auth: boolean
      user: any
    }
    interface Response {
      nosend?: boolean
    }
  }
}

export {}
