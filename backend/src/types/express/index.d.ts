import User from "../../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
