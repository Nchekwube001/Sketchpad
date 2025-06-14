import { faker } from "@faker-js/faker";

faker.seed(12);
const postsData = [...Array(20).keys()].map(() => ({
  key: faker.string.uuid(),
  title: faker.music.artist(),
  image: faker.image.urlPicsumPhotos({
    width: 300,
    height: 300 * 1.4,
    // category: "football",
  }),
  bg: faker.internet.color(),
  description: faker.lorem.sentences({ min: 1, max: 3 }),
  author: {
    name: faker.person.fullName(),
    avatar: faker.image.avatarGitHub(),
  },
}));

export type Item = (typeof postsData)[0];
export default postsData;
