import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let user_id: string;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);

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

  it("should be able to deposit", async () => {
    const response = await createStatementUseCase.execute({
      user_id,
      amount: 1000,
      description: "payment deposit",
      type: OperationType.DEPOSIT,
    });

    expect(response).toHaveProperty("type")
    expect(response).toHaveProperty("amount")
    expect(response).toHaveProperty("description")

  });

  it("should be able to withdraw", async () => {

    await createStatementUseCase.execute({
      user_id,
      amount: 1000,
      description: "payment deposit",
      type: OperationType.DEPOSIT,
    });

    const response = await createStatementUseCase.execute({
      user_id,
      amount: 600,
      description: "payment deposit",
      type: OperationType.WITHDRAW,
    });

    expect(response).toHaveProperty("type")
    expect(response).toHaveProperty("amount")
    expect(response).toHaveProperty("description")
  });

  it("should not be able to withdraw more than balance", async () => {
      await createStatementUseCase.execute({
        user_id,
        amount: 1000,
        description: "payment deposit",
        type: OperationType.DEPOSIT,
      });

      expect(async () => {
        await createStatementUseCase.execute({
          user_id,
          amount: 1001,
          description: "bought transaction",
          type: OperationType.WITHDRAW,
        });
      }).rejects.toBeInstanceOf(AppError)
  })
});
