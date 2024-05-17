import { randomUUID } from "node:crypto";
import { hash } from "bcrypt";
import { UserDataCreate } from "../repositories/userRepository";
import { appError } from "../utils/appError";

type UserData = {
  name: string;
  email: string;
  password: string;
};

type Repository = {
  createUser(data: UserDataCreate): Promise<{} | undefined>;
  getUserByID(id: string): Promise<{}>;
};

export const userServices = {
  async create(data: UserData, repository: Repository) {
    try {
      const { name, email, password } = data;

      const passwordHash = await hash(password, 10);

      const user = {
        id: randomUUID(),
        name,
        email,
        password: passwordHash,
      };

      const userCreated = await repository.createUser(user);

      return userCreated;
    } catch (error) {
      throw error;
    }
  },

  async read(id: string, repository: Repository) {
    try {
      const userData = await repository.getUserByID(id);

      if (!userData) throw appError("user not found!", 404);

      return userData;
    } catch (error) {
      throw error;
    }
  },
};