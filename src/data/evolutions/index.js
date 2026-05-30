import { baseGameEvolutions } from "./baseGame";
import { legacyOfTheMoonspellEvolutions } from "./legacyOfTheMoonspell";
import { emergencyMeetingEvolutions } from "./emergencyMeeting";
import { tidesOfTheFoscariEvolutions } from "./tidesOfTheFoscari";
import { operationGunsEvolutions } from "./operationGuns";
import { emeraldDioramaEvolutions } from "./emeraldDiorama";
import { odeToCastlevaniaEvolutions } from "./odeToCastlevania";
import { anteChamberEvolutions } from "./anteChamber";

export const evolutions = [
  ...baseGameEvolutions,
  ...legacyOfTheMoonspellEvolutions,
  ...emergencyMeetingEvolutions,
  ...tidesOfTheFoscariEvolutions,
  ...operationGunsEvolutions,
  ...emeraldDioramaEvolutions,
  ...odeToCastlevaniaEvolutions,
  ...anteChamberEvolutions,
];
