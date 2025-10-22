import { CreateUserUseCase } from '../../usecases/create-user.usecase';

describe('CreateUserUseCase', () => {
  it('creates user with hashed password', async () => {
    const repo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'u1' }),
    } as any;
    const hash = { hash: jest.fn().mockResolvedValue('h:123') } as any;
    const usecase = new CreateUserUseCase(repo, hash);
    const out = await usecase.execute({
      name: 'A',
      email: 'a@a.com',
      password: '123456',
    } as any);
    expect(out.id).toBeDefined();
    expect(hash.hash).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalled();
  });
});
