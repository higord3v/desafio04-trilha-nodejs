import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let user_id: string;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );

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

  it("should be able get one statement operation by statement id", async () => {
    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 1000,
      description: "payment deposit",
      type: OperationType.DEPOSIT,
    });

    await createStatementUseCase.execute({
      user_id,
      amount: 2000,
      description: "payment deposit",
      type: OperationType.DEPOSIT,
    });

    await createStatementUseCase.execute({
      user_id,
      amount: 3000,
      description: "payment deposit",
      type: OperationType.DEPOSIT,
    });

    const statementSearch = await getStatementOperationUseCase.execute({ user_id, statement_id: statement.id as string });

    console.log(statementSearch)
    expect(statementSearch.amount).toEqual(1000);
  });
});
