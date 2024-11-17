import { faker } from "@faker-js/faker";

export const MAX_MESSAGES = 6;
faker.seed(12);
export const generateNewMessage = () => ({
  key: faker.string.uuid(),
  content: faker.commerce.price({ min: 5, max: 1000, dec: 2, symbol: "$" }),
  description: faker.lorem.sentences({ min: 1, max: 2 }),
  user: {
    name: faker.internet.username(),
    avatar: faker.image.avatarGitHub(),
  },
});

export type ChatItem = ReturnType<typeof generateNewMessage>;
