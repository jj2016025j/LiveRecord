import { en_US, en_HK, zh_TW, zh_CN, Faker, en, fr_CA } from "@faker-js/faker";

export const myFactory = new Faker({
  locale: [zh_TW, en_US, zh_CN, en_HK, en, fr_CA],
});
