import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

let user_id: string;

describe("Get Balance Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

    await createUserUseCase.execute({
      name: "teste nome",
      email: "teste@teste.com",
      password: "password",
    });

    let authData = await authenticateUserUseCase.execute({
      email: "teste@teste.com",
      password: "password",
    });

    user_id = authData.user.id as string;
  });

  it("should be able get user's balance", async () => {

    const response = await getBalanceUseCase.execute({user_id});
    expect(response).toHaveProperty("balance");
    expect(response).toHaveProperty("statement");
  });
});
