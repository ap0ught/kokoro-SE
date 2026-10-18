export interface RecipeEntry {
  unlockedRecpie: string;
  timesServed: number;
}

export interface NpcState {
  npcId: number;
  hasServed: boolean;
  cutSceneFinished: boolean;
}

export interface GuestBookPage {
  hintUnlocked: boolean;
  fullUnlocked: boolean;
}

export interface SaveData {
  gameStarted?: boolean;
  playerLevel?: number;
  playerExp?: number;
  saveDate?: string;
  DaysOpenCount?: number;
  SitDownMeals?: number;
  TakeOutMeals?: number;
  TimeTotalMeals?: number;
  MissedCustomers?: number;
  MoneyEarned?: number;
  GotchasSold?: number;
  RicesSold?: number;
  HandWashedDishes?: number;
  unlockedSkills?: string[];
  playerCurrentSkillPoints?: number;
  playerCurrentSpentSkillPoints?: number;
  playerCoins?: number;
  PlayerRecpies?: RecipeEntry[];
  recpieUnlockPoints?: number;
  spentUnlockPoints?: number;
  availableIngredientsForKitchen?: string[];
  activatedItems?: string[];
  selectedShirt?: number;
  selectedPants?: number;
  selectedHair?: number;
  SelectedShirtColor?: number;
  SelectedPantsColor?: number;
  SelectedHairColor?: number;
  SelectedSkinTone?: number;
  SelectedAccessoryColor?: number;
  specialNPCStates?: NpcState[];
  merchentUnlocked?: boolean;
  GatchaStates?: unknown[];
  HasToolTipActivated?: boolean;
  guestBookPages?: GuestBookPage[];
  [key: string]: unknown;
}

export const MEALS = [
  "Meals.BaoBun.Title",
  "Meals.BaoVeggie.Title",
  "Meals.ChocolateMochi.Title",
  "Meals.ChocolateTaiyaki.Title",
  "Meals.CustardTaiyaki.Title",
  "Meals.Daifuku.Title",
  "Meals.Dorayaki.Title",
  "Meals.Edamame.Title",
  "Meals.EggSando.Title",
  "Meals.Gyoza.Title",
  "Meals.GyozaVeggie.Title",
  "Meals.Gyudon.Title",
  "Meals.HanamiDango.Title",
  "Meals.IceCreamBites.Title",
  "Meals.Inari.Title",
  "Meals.KatsuCurry.Title",
  "Meals.KatsuSando.Title",
  "Meals.MatchaIceCream.Title",
  "Meals.MatchaPancakes.Title",
  "Meals.MisoSoup.Title",
  "Meals.MitarashiDango.Title",
  "Meals.Omurice.Title",
  "Meals.Onigiri.Title",
  "Meals.Purin.Title",
  "Meals.Ramen.Title",
  "Meals.RamenVeggie.Title",
  "Meals.RedBeanTaiyaki.Title",
  "Meals.RiceBowl.Title",
  "Meals.SalmonNigiri.Title",
  "Meals.SalmonRoll.Title",
  "Meals.Sashimi.Title",
  "Meals.Soba.Title",
  "Meals.SobaVeggie.Title",
  "Meals.StrawberryMochi.Title",
  "Meals.Sukiyaki.Title",
  "Meals.SukiyakiVeggie.Title",
  "Meals.Takoyaki.Title",
  "Meals.TamagoSushi.Title",
  "Meals.Tamagoyaki.Title",
  "Meals.Toast.Title",
  "Meals.TunaNigiri.Title",
  "Meals.TunaRoll.Title",
  "Meals.VegTempura.Title",
];

export const MEAL_LABELS: { [key: string]: string } = Object.fromEntries(
  MEALS.map((m) => [m, m.replace("Meals.", "").replace(".Title", "")]),
);

export const INGREDIENTS = [
  "Rice",
  "Nori",
  "Matcha",
  "Miso",
  "Salmon",
  "Tuna",
];

export function isSaveShape(text: string): SaveData | null {
  try {
    const data = JSON.parse(text);
    if (data && typeof data === "object" && "playerCoins" in data) {
      return data as SaveData;
    }
    return null;
  } catch {
    return null;
  }
}

export function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
}
