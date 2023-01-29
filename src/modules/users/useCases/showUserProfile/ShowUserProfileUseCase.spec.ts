import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let user, user_id: string;

describe("Show User's Profile Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    user = await createUserUseCase.execute({
      name: "teste nome",
      email: "teste@teste.com",
      password: "password",
    });

    let authData = await authenticateUserUseCase.execute({
      email: "teste@teste.com",
      password: "password",
    });

    user_id = authData.user.id as string;
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show user's profile", async () => {

    const userProfile = await showUserProfileUseCase.execute(user_id);
    console.log(userProfile.name);
    expect(userProfile).toHaveProperty("name");
  });
});
