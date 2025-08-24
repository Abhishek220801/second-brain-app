import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./config.js";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "You are not logged in" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET);

    // ✅ Narrow the type properly
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      (req as any).userId = (decoded as { id: string }).id;
      return next();
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
