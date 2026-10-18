# Kokoro SE

React save editor for [Kokoro Kitchen](https://store.steampowered.com/app/3079770/) (MangoLeafGames), built with Vite.

Drag &lsquo;n&rsquo; drop a save file (`saveSlot1/2/3.json`), edit, download the edited JSON back. Unknown keys pass through untouched.

## Edits

- Customer: level, experience, days open, save date
- Money: coins, skill points, recipe unlock points
- Restaurant stats: meals served, missed customers, dishes, and friends
- Recipes: add/remove dishes (full meal catalog), set times served, unlock all 43
- Skills, kitchen ingredients, activated items, gatcha states
- Outfit & appearance indices (shirt / pants / hair / colors / skin tone)
- NPC wondering-star states, guest book pages, merchant flag
- Raw JSON pane for everything else

## Save location

| Platform | Path |
| --- | --- |
| Steam on Linux / Steam Deck (Proton) | `.../steamapps/compatdata/3079770/pfx/drive_c/users/steamuser/AppData/LocalLow/MangoLeafGames/Kokoro Kitchen/` |
| Steam on Windows | `%USERPROFILE%\AppData\LocalLow\MangoLeafGames\Kokoro Kitchen\` |

Back up your saves before editing. The in-app "Where to put the save back" panel has copy buttons for each path.

## Run

```sh
npm install
npm run dev
```

Open `http://localhost:5199/?save=saveSlot2.json` to auto-load a snapshot, or just drag your file onto the page.

## Build

```sh
npm run build
```

Not affiliated with MangoLeafGames.
