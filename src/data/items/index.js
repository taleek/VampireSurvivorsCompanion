import { baseGameItems } from "./baseGame";
import { legacyOfTheMoonspellItems } from "./legacyOfTheMoonspell";
import { emergencyMeetingItems } from "./emergencyMeeting";
import { tidesOfTheFoscariItems } from "./tidesOfTheFoscari";
import { operationGunsItems } from "./operationGuns";
import { emeraldDioramaItems } from "./emeraldDiorama";
import { odeToCastlevaniaItems } from "./odeToCastlevania";

export const items = {
  ...baseGameItems,
  ...legacyOfTheMoonspellItems,
  ...emergencyMeetingItems,
  ...tidesOfTheFoscariItems,
  ...operationGunsItems,
  ...emeraldDioramaItems,
  ...odeToCastlevaniaItems,
};
