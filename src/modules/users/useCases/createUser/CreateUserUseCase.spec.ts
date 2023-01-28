import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be  able to create a user", async () => {
    const userDTO: ICreateUserDTO = {
      name: "teste",
      email: "teste@teste.com",
      password: "password",
    };

    const newUser = await createUserUseCase.execute(userDTO);
    console.log(newUser);
    expect(newUser).toHaveProperty("name");
  });
});
