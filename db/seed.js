import db from "#db/client";
import { createTeam } from "#db/queries/teams";
import { createMutant } from "#db/queries/mutants";
import { createTeamMutant } from "#db/queries/teams_mutants";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await createUser("admin", "Hlkjhdsfn873jhj2");

  const xmen = await createTeam(
    "X-Men",
    "Xavier's School for Gifted Youngsters, Westchester, NY",
    "A team of mutants fighting for peaceful coexistence between humans and mutants, led by Professor X.",
    "/images/xmen.jpg"
  );

  const brotherhood = await createTeam(
    "Brotherhood of Mutants",
    "Various locations, global",
    "Formed after the Cuban Missile Crisis, Magneto leads this group believing mutants should rule over humans.",
    "/images/brotherhood.jpg"
  );

  const hellfire = await createTeam(
    "Hellfire Club",
    "New York City, NY",
    "A secret society of powerful mutants and humans seeking world domination through political and economic means.",
    "/images/hellfire.jpg"
  );

  const xforce = await createTeam(
    "X-Force",
    "Undisclosed location",
    "A black ops mutant team willing to do what the X-Men cannot.",
    "/images/xforce.jpg"
  );

  // Create all mutants
  const xavier = await createMutant("Charles Xavier", "Professor X", "active", "Telepathy, mind control, psychic blasts", "The world's most powerful telepath and founder of the X-Men.", "/images/xavier.jpg");
  const beast = await createMutant("Hank McCoy", "Beast", "active", "Superhuman strength, agility, and intellect", "A brilliant scientist and agile fighter.", "/images/beast.jpg");
  const havok = await createMutant("Alex Summers", "Havok", "active", "Plasma blasts, cosmic energy absorption", "Brother of Cyclops, Alex can absorb cosmic energy and release it as powerful plasma blasts.", "/images/havok.jpg");
  const banshee = await createMutant("Sean Cassidy", "Banshee", "active", "Sonic scream, flight via screaming", "An Irish mutant who can fly and disorient enemies using his powerful sonic scream.", "/images/banshee.jpg");
  const angel = await createMutant("Angel Salvadore", "Angel", "active", "Flight, acid spit", "A young mutant with insectoid wings who can fly and spit acid at enemies.", "/images/angel.jpg");
  const magneto = await createMutant("Erik Lehnsherr", "Magneto", "active", "Master of magnetism, can manipulate all forms of metal", "A Holocaust survivor who became the most powerful mutant on Earth.", "/images/magneto.jpg");
  const mystique = await createMutant("Raven Darkholme", "Mystique", "active", "Shapeshifting, retarded aging, enhanced agility", "A shapeshifter who left the X-Men to join Magneto, later returning as a reluctant ally.", "/images/mystique.jpg");
  const azazel = await createMutant("Azazel", "Azazel", "deceased", "Teleportation, wall crawling, sword mastery", "A demonic-looking mutant and one of Magneto's most dangerous allies.", "/images/azazel.jpg");
  const shaw = await createMutant("Sebastian Shaw", "Black King", "deceased", "Kinetic energy absorption and redirection", "The ruthless leader of the Hellfire Club.", "/images/shaw.jpg");
  const emma = await createMutant("Emma Frost", "White Queen", "active", "Telepathy, diamond form transformation", "A powerful telepath who defected from the Hellfire Club to join the X-Men.", "/images/emma.jpg");
  const riptide = await createMutant("Janos Quested", "Riptide", "deceased", "Whirlwind generation, projectile creation", "A Hellfire Club enforcer who can spin at superhuman speeds.", "/images/riptide.jpg");
  const wolverine = await createMutant("James Howlett", "Wolverine", "active", "Adamantium claws, accelerated healing factor, enhanced senses", "A gruff Canadian mutant with a mysterious past. Has served on both the X-Men and X-Force.", "/images/wolverine.jpg");

  // X-Men memberships
  await createTeamMutant(xmen.id, xavier.id);
  await createTeamMutant(xmen.id, beast.id);
  await createTeamMutant(xmen.id, havok.id);
  await createTeamMutant(xmen.id, banshee.id);
  await createTeamMutant(xmen.id, angel.id);
  await createTeamMutant(xmen.id, wolverine.id);
  // Mystique and Emma defect to X-Men later
  await createTeamMutant(xmen.id, mystique.id);
  await createTeamMutant(xmen.id, emma.id);

  // Brotherhood memberships
  await createTeamMutant(brotherhood.id, magneto.id);
  await createTeamMutant(brotherhood.id, mystique.id);
  await createTeamMutant(brotherhood.id, azazel.id);

  // Hellfire Club memberships
  await createTeamMutant(hellfire.id, shaw.id);
  await createTeamMutant(hellfire.id, emma.id);
  await createTeamMutant(hellfire.id, riptide.id);

  // X-Force memberships
  await createTeamMutant(xforce.id, wolverine.id);
}