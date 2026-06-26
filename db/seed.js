import db from "#db/client";
import { createTeam } from "#db/queries/teams";
import { createMutant } from "#db/queries/mutants";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await createUser("admin", "dsjk799#hsI&");

  const xmen = await createTeam(
    "X-Men",
    "Xavier's School for Gifted Youngsters, Westchester, NY",
    "A team of mutants fighting for peaceful coexistence between humans and mutants, led by Professor X.",
    "https://i.imgur.com/placeholder.png"
  );

  const brotherhood = await createTeam(
    "Brotherhood of Mutants",
    "Various locations, global",
    "Formed after the Cuban Missile Crisis, Magneto leads this group believing mutants should rule over humans.",
    "https://i.imgur.com/placeholder.png"
  );

  const hellfire = await createTeam(
    "Hellfire Club",
    "New York City, NY",
    "A secret society of powerful mutants and humans seeking world domination through political and economic means.",
    "https://i.imgur.com/placeholder.png"
  );

  // X-Men
  await createMutant("Charles Xavier", "Professor X", "active", "Telepathy, mind control, psychic blasts", "The world's most powerful telepath and founder of the X-Men. Dedicated his life to peaceful coexistence between mutants and humans.", "https://i.imgur.com/placeholder.png", xmen.id);
  await createMutant("Hank McCoy", "Beast", "active", "Superhuman strength, agility, and intellect", "A brilliant scientist and agile fighter whose mutation gives him superhuman strength and agility.", "https://i.imgur.com/placeholder.png", xmen.id);
  await createMutant("Alex Summers", "Havok", "active", "Plasma blasts, cosmic energy absorption", "Brother of Cyclops, Alex can absorb cosmic energy and release it as powerful plasma blasts.", "https://i.imgur.com/placeholder.png", xmen.id);
  await createMutant("Sean Cassidy", "Banshee", "active", "Sonic scream, flight via screaming", "An Irish mutant who can fly and disorient enemies using his powerful sonic scream.", "https://i.imgur.com/placeholder.png", xmen.id);
  await createMutant("Angel Salvadore", "Angel", "active", "Flight, acid spit", "A young mutant with insectoid wings who can fly and spit acid at enemies.", "https://i.imgur.com/placeholder.png", xmen.id);

  // Brotherhood
  await createMutant("Erik Lehnsherr", "Magneto", "active", "Master of magnetism, can manipulate all forms of metal", "A Holocaust survivor who became the most powerful mutant on Earth. After the Cuban Missile Crisis, he broke from Xavier to lead the Brotherhood.", "https://i.imgur.com/placeholder.png", brotherhood.id);
  await createMutant("Raven Darkholme", "Mystique", "active", "Shapeshifting, retarded aging, enhanced agility", "A shapeshifter who left the X-Men to join Magneto, believing mutants must fight for their own survival.", "https://i.imgur.com/placeholder.png", brotherhood.id);
  await createMutant("Azazel", "Azazel", "active", "Teleportation, wall crawling, sword mastery", "A demonic-looking mutant and one of Magneto's most dangerous allies.", "https://i.imgur.com/placeholder.png", brotherhood.id);

  // Hellfire Club
  await createMutant("Sebastian Shaw", "Black King", "deceased", "Kinetic energy absorption and redirection", "The ruthless leader of the Hellfire Club who absorbs kinetic energy to make himself stronger.", "https://i.imgur.com/placeholder.png", hellfire.id);
  await createMutant("Emma Frost", "White Queen", "active", "Telepathy, diamond form transformation", "A powerful telepath and former Hellfire Club member with a diamond-hard second mutation.", "https://i.imgur.com/placeholder.png", hellfire.id);
  await createMutant("Janos Quested", "Riptide", "deceased", "Whirlwind generation, projectile creation", "A Hellfire Club enforcer who can spin at superhuman speeds and fling hardened projectiles.", "https://i.imgur.com/placeholder.png", hellfire.id);
}