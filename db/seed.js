import db from "#db/client";
import { createTeam } from "#db/queries/teams";
import { createMutant } from "#db/queries/mutants";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await createUser("admin", "Jk#23nmaSgH26793");

  const xmen = await createTeam(
    "X-Men",
    "A team of mutants fighting for peaceful coexistence between humans and mutants, led by Professor X.",
    "Xavier's School for Gifted Youngsters, Westchester, NY",
    "https://i.imgur.com/placeholder.png"
  );

  const brotherhood = await createTeam(
    "Brotherhood of Mutants",
    "Formed after the Cuban Missile Crisis, Magneto leads this group believing mutants should rule over humans.",
    "Various locations, global",
    "https://i.imgur.com/placeholder.png"
  );

  const hellfire = await createTeam(
    "Hellfire Club",
    "A secret society of powerful mutants and humans seeking world domination through political and economic means.",
    "New York City, NY",
    "https://i.imgur.com/placeholder.png"
  );

  // X-Men
  await createMutant("Charles Xavier", "Professor X", "The world's most powerful telepath and founder of the X-Men. Dedicated his life to peaceful coexistence between mutants and humans.", "Telepathy, mind control, psychic blasts", "https://i.imgur.com/placeholder.png", "active", xmen.id);
  await createMutant("Hank McCoy", "Beast", "A brilliant scientist and agile fighter whose mutation gives him superhuman strength and agility.", "Superhuman strength, agility, and intellect", "https://i.imgur.com/placeholder.png", "active", xmen.id);
  await createMutant("Alex Summers", "Havok", "Brother of Cyclops, Alex can absorb cosmic energy and release it as powerful plasma blasts.", "Plasma blasts, cosmic energy absorption", "https://i.imgur.com/placeholder.png", "active", xmen.id);
  await createMutant("Sean Cassidy", "Banshee", "An Irish mutant who can fly and disorient enemies using his powerful sonic scream.", "Sonic scream, flight via screaming", "https://i.imgur.com/placeholder.png", "active", xmen.id);
  await createMutant("Angel Salvadore", "Angel", "A young mutant with insectoid wings who can fly and spit acid at enemies.", "Flight, acid spit", "https://i.imgur.com/placeholder.png", "active", xmen.id);

  // Brotherhood
  await createMutant("Erik Lehnsherr", "Magneto", "A Holocaust survivor who became the most powerful mutant on Earth. After the Cuban Missile Crisis, he broke from Xavier to lead the Brotherhood.", "Master of magnetism, can manipulate all forms of metal", "https://i.imgur.com/placeholder.png", "active", brotherhood.id);
  await createMutant("Raven Darkholme", "Mystique", "A shapeshifter who left the X-Men to join Magneto, believing mutants must fight for their own survival.", "Shapeshifting, retarded aging, enhanced agility", "https://i.imgur.com/placeholder.png", "active", brotherhood.id);
  await createMutant("Azazel", "Azazel", "A demonic-looking mutant and one of Magneto's most dangerous allies.", "Teleportation, wall crawling, sword mastery", "https://i.imgur.com/placeholder.png", "active", brotherhood.id);

  // Hellfire Club
  await createMutant("Sebastian Shaw", "Black King", "The ruthless leader of the Hellfire Club who absorbs kinetic energy to make himself stronger.", "Kinetic energy absorption and redirection", "https://i.imgur.com/placeholder.png", "deceased", hellfire.id);
  await createMutant("Emma Frost", "White Queen", "A powerful telepath and former Hellfire Club member with a diamond-hard second mutation.", "Telepathy, diamond form transformation", "https://i.imgur.com/placeholder.png", "active", hellfire.id);
  await createMutant("Janos Quested", "Riptide", "A Hellfire Club enforcer who can spin at superhuman speeds and fling hardened projectiles.", "Whirlwind generation, projectile creation", "https://i.imgur.com/placeholder.png", "deceased", hellfire.id);
}