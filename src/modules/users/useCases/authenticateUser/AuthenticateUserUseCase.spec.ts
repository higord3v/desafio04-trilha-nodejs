import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;


import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let user;

describe("Authenticate User Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    user = await createUserUseCase.execute({
      name: "teste nome",
      email: "teste@teste.com",
      password: "password",
    });
  });

  it("should be able to authenticate a user", async () => {
    const authUserDTO = {
      email: "teste@teste.com",
      password: "password",
    };

    const authData = await authenticateUserUseCase.execute(authUserDTO);
    console.log(authData.token);
    expect(authData).toHaveProperty("token");
  });
});
