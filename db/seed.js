import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createDepartment } from "#db/queries/departments";
import { createProfessor } from "#db/queries/professors";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");


async function seed() {
  await createUser("admin", "lincolnIsTheBestestEver9867543");

  const departmentNames = [
    "Computer Science",
    "Mathematics",
    "English Literature",
    "Biology",
    "History"
  ];

  for (const name of departmentNames) {
    const department = await createDepartment(
      name,
      faker.internet.email(),
      faker.lorem.paragraph(),
      faker.image.url()
    );

    for (let i = 0; i < 4; i++) {
      await createProfessor(
        faker.person.fullName(),
        faker.internet.email(),
        faker.lorem.paragraph(),
        faker.image.avatar(),
        department.id
      );
    }
  }
}