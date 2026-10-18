import { useRef, useState } from "react";

import {
  asBool,
  asNumber,
  asStringList,
  INGREDIENTS,
  isSaveShape,
  MEALS,
  MEAL_LABELS,
  type SaveData,
} from "./save";

type NumberKind = "int" | "float";

function App() {
  const [save, setSave] = useState<SaveData | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFile = async (file: File) => {
    const text = await file.text();
    const data = isSaveShape(text);
    if (!data) {
      setError(
        `"${file.name}" doesn't look like a Kokoro Kitchen save (expected a JSON save with a playerCoins field).`,
      );
      return;
    }
    setError("");
    setSave(data);
    setFileName(file.name);
  };

  const patch = (updates: Partial<SaveData>) => {
    setSave((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const setNum = (key: keyof SaveData, kind: NumberKind = "int") => (
    value: number,
  ) => {
    patch({ [key]: kind === "int" ? Math.floor(value) : value } as Partial<SaveData>);
  };

  const download = () => {
    if (!save) return;
    const blob = new Blob([JSON.stringify(save, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRaw = () => {
    const textarea = document.getElementById("raw-json") as HTMLTextAreaElement;
    const data = isSaveShape(textarea.value);
    if (!data) {
      setError("Not a valid Kokoro Kitchen save.");
      return;
    }
    setSave(data);
    setShowRaw(false);
  };

  if (!save) {
    return (
      <main className="landing">
        <h1>Kokoro Kitchen Save Editor</h1>
        <p>
          Drag &lsquo;n&rsquo; drop a save file (e.g.{" "}
          <code>saveSlot2.json</code>) or click to browse.
        </p>
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) openFile(file);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) openFile(file);
            }}
          />
          Open save file
        </div>
        {error && <p className="error">{error}</p>}
        <p className="hint">
          Saves live at{" "}
          <code>
            .../steamapps/compatdata/3079770/pfx/drive_c/users/steamuser/AppData/LocalLow/MangoLeafGames/Kokoro
            Kitchen/
          </code>{" "}
          on Linux/Proton, or{" "}
          <code>
            %USERPROFILE%\AppData\LocalLow\MangoLeafGames\Kokoro Kitchen\
          </code>{" "}
          on Windows. Always back up your saves before editing.
        </p>
      </main>
    );
  }

  const recipes = save.PlayerRecpies ?? [];
  const npcs = save.specialNPCStates ?? [];
  const guestPages = save.guestBookPages ?? [];

  return (
    <main className="editor">
      <header>
        <div>
          <h1>Kokoro Kitchen Save Editor</h1>
          <p className="filename">{fileName}</p>
        </div>
        <div className="actions">
          <button
            onClick={() => {
              fileInputRef.current?.click() as never;
            }}
            hidden
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              const input = e.target;
              if (file) openFile(file);
              input.value = "";
            }}
          />
          <button onClick={download}>Download edited save</button>
          <button className="secondary" onClick={() => fileInputRef.current?.click()}>
            Open another file
          </button>
          <button className="secondary" onClick={() => setShowRaw(!showRaw)}>
            Raw JSON
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {showRaw && (
        <section className="card">
          <h2>Raw JSON</h2>
          <textarea id="raw-json" defaultValue={JSON.stringify(save, null, 2)} />
          <div className="row">
            <button onClick={importRaw}>Apply raw JSON</button>
          </div>
        </section>
      )}

      <div className="grid">
        <section className="card">
          <h2>Customer</h2>
          <label>Level</label>
          <NumInput
            value={asNumber(save.playerLevel, 1)}
            min={1}
            max={99}
            onCommit={setNum("playerLevel")}
          />
          <label>Experience</label>
          <NumInput
            value={asNumber(save.playerExp)}
            kind="float"
            min={0}
            onCommit={setNum("playerExp", "float")}
          />
          <label>Days open</label>
          <NumInput
            value={asNumber(save.DaysOpenCount)}
            min={0}
            onCommit={setNum("DaysOpenCount")}
          />
          <label>Save date</label>
          <input
            type="text"
            value={(save.saveDate as string) ?? ""}
            onChange={(e) => patch({ saveDate: e.target.value })}
          />
        </section>

        <section className="card">
          <h2>Money &amp; points</h2>
          <label>Coins</label>
          <NumInput
            value={asNumber(save.playerCoins)}
            min={0}
            max={99999999}
            onCommit={setNum("playerCoins")}
          />
          <label>Skill points</label>
          <NumInput
            value={asNumber(save.playerCurrentSkillPoints)}
            min={0}
            onCommit={setNum("playerCurrentSkillPoints")}
          />
          <label>Spent skill points</label>
          <NumInput
            value={asNumber(save.playerCurrentSpentSkillPoints)}
            min={0}
            onCommit={setNum("playerCurrentSpentSkillPoints")}
          />
          <label>Recipe unlock points</label>
          <NumInput
            value={asNumber(save.recpieUnlockPoints)}
            min={0}
            onCommit={setNum("recpieUnlockPoints")}
          />
          <label>Spent unlock points</label>
          <NumInput
            value={asNumber(save.spentUnlockPoints)}
            min={0}
            onCommit={setNum("spentUnlockPoints")}
          />
        </section>

        <section className="card">
          <h2>Restaurant stats</h2>
          {(
            [
              ["SitDownMeals", "Sit-down meals"],
              ["TakeOutMeals", "Take-out meals"],
              ["TimeTotalMeals", "Total meals"],
              ["MissedCustomers", "Missed customers"],
              ["MoneyEarned", "Money earned"],
              ["GotchasSold", "Gotchas sold"],
              ["RicesSold", "Rices sold"],
              ["HandWashedDishes", "Hand-washed dishes"],
            ] as [keyof SaveData, string][]
          ).map(([key, label]) => (
            <div key={String(key)}>
              <label>{label}</label>
              <NumInput
                value={asNumber(save[key])}
                min={0}
                onCommit={setNum(key)}
              />
            </div>
          ))}
          <div className="row">
            <button
              className="secondary"
              onClick={() =>
                patch({
                  TimeTotalMeals:
                    asNumber(save.SitDownMeals) + asNumber(save.TakeOutMeals),
                })
              }
            >
              Total = sit-down + take-out
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Recipes</h2>
          {recipes.map((entry, index) => (
            <div className="recipe-row" key={index}>
              <select
                value={entry.unlockedRecpie}
                onChange={(e) => {
                  const updated = [...recipes];
                  updated[index] = { ...entry, unlockedRecpie: e.target.value };
                  patch({ PlayerRecpies: updated });
                }}
              >
                {MEALS.filter(
                  (m) =>
                    m === entry.unlockedRecpie ||
                    !recipes.some((r) => r.unlockedRecpie === m),
                ).map((meal) => (
                  <option key={meal} value={meal}>
                    {MEAL_LABELS[meal]}
                  </option>
                ))}
                {!MEALS.includes(entry.unlockedRecpie) && (
                  <option value={entry.unlockedRecpie}>
                    {entry.unlockedRecpie}
                  </option>
                )}
              </select>
              <NumInput
                className="served"
                value={asNumber(entry.timesServed)}
                min={0}
                onCommit={(value) => {
                  const updated = [...recipes];
                  updated[index] = {
                    ...entry,
                    timesServed: Math.floor(value),
                  };
                  patch({ PlayerRecpies: updated });
                }}
              />
              <button
                className="secondary danger"
                title="Remove recipe"
                onClick={() =>
                  patch({
                    PlayerRecpies: recipes.filter((_, i) => i !== index),
                  })
                }
              >
                &times;
              </button>
            </div>
          ))}
          <div className="row">
            <button
              className="secondary"
              onClick={() =>
                patch({
                  PlayerRecpies: [
                    ...recipes,
                    { unlockedRecpie: MEALS[0], timesServed: 0 },
                  ],
                })
              }
            >
              Add recipe
            </button>
            <button
              className="secondary"
              onClick={() =>
                patch({
                  PlayerRecpies: MEALS.map((meal) => ({
                    unlockedRecpie: meal,
                    timesServed: asNumber(
                      recipes.find((r) => r.unlockedRecpie === meal)
                        ?.timesServed,
                    ),
                  })),
                })
              }
            >
              Unlock all 43 meals
            </button>
          </div>
          <label>Recipe unlock points</label>
          <NumInput
            value={asNumber(save.recpieUnlockPoints)}
            min={0}
            onCommit={setNum("recpieUnlockPoints")}
          />
        </section>

        <section className="card">
          <h2>Unlocked skills</h2>
          <Chips
            values={asStringList(save.unlockedSkills)}
            suggestions={[]}
            onChange={(values) => patch({ unlockedSkills: values })}
          />
          <div className="row">
            <NumInput
              className="inline"
              value={asNumber(save.playerCurrentSkillPoints)}
              min={0}
              onCommit={setNum("playerCurrentSkillPoints")}
            />
            <span className="hint">unspent skill points</span>
          </div>
        </section>

        <section className="card">
          <h2>Kitchen &amp; items</h2>
          <label>Ingredients available</label>
          <Chips
            values={asStringList(save.availableIngredientsForKitchen)}
            suggestions={INGREDIENTS}
            onChange={(values) =>
              patch({ availableIngredientsForKitchen: values })
            }
          />
          <label>Activated items</label>
          <Chips
            values={asStringList(save.activatedItems)}
            suggestions={[]}
            onChange={(values) => patch({ activatedItems: values })}
          />
          <label>Gatcha states ({asNumber(save.GatchaStates?.length)})</label>
          <Chips
            values={asStringList(save.GatchaStates)}
            suggestions={[]}
            rawJson
            onChange={(values) => patch({ GatchaStates: values })}
          />
        </section>

        <section className="card">
          <h2>Outfit &amp; appearance</h2>
          {(
            [
              ["selectedShirt", "Shirt"],
              ["selectedPants", "Pants"],
              ["selectedHair", "Hair"],
              ["SelectedShirtColor", "Shirt color"],
              ["SelectedPantsColor", "Pants color"],
              ["SelectedHairColor", "Hair color"],
              ["SelectedSkinTone", "Skin tone"],
              ["SelectedAccessoryColor", "Accessory color"],
            ] as [keyof SaveData, string][]
          ).map(([key, label]) => (
            <div className="appearance-row" key={String(key)}>
              <label>{label}</label>
              <NumInput
                value={asNumber(save[key])}
                min={0}
                onCommit={setNum(key)}
              />
            </div>
          ))}
        </section>

        <section className="card">
          <h2>NPC wondering stars</h2>
          <table>
            <thead>
              <tr>
                <th>NPC</th>
                <th>Served</th>
                <th>Cutscene finished</th>
              </tr>
            </thead>
            <tbody>
              {npcs.map((npc, index) => (
                <tr key={index}>
                  <td>#{asNumber(npc.npcId)}</td>
                  {(["hasServed", "cutSceneFinished"] as const).map((field) => (
                    <td key={field}>
                      <input
                        type="checkbox"
                        checked={asBool(npc[field])}
                        onChange={(e) => {
                          const updated = [...npcs];
                          updated[index] = { ...npc, [field]: e.target.checked };
                          patch({ specialNPCStates: updated });
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h2>Guest book</h2>
          <table>
            <thead>
              <tr>
                <th>Page</th>
                <th>Hint unlocked</th>
                <th>Full unlocked</th>
              </tr>
            </thead>
            <tbody>
              {guestPages.map((page, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {(["hintUnlocked", "fullUnlocked"] as const).map((field) => (
                    <td key={field}>
                      <input
                        type="checkbox"
                        checked={asBool(page[field])}
                        onChange={(e) => {
                          const updated = [...guestPages];
                          updated[index] = {
                            ...page,
                            [field]: e.target.checked,
                          };
                          patch({ guestBookPages: updated });
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row">
            <button
              className="secondary"
              onClick={() =>
                patch({
                  guestBookPages: guestPages.map(() => ({
                    hintUnlocked: true,
                    fullUnlocked: true,
                  })),
                })
              }
            >
              Unlock all pages
            </button>
          </div>
        </section>

        <section className="card">
          <h2>Flags</h2>
          <BoolInput
            label="Merchant unlocked"
            checked={asBool(save.merchentUnlocked)}
            onChange={(checked) => patch({ merchentUnlocked: checked })}
          />
          <BoolInput
            label="Tool tip activated"
            checked={asBool(save.HasToolTipActivated)}
            onChange={(checked) => patch({ HasToolTipActivated: checked })}
          />
        </section>
      </div>

      <footer>
        <p className="hint">
          Copy the downloaded file back into the save folder (backup the
          original first). The game rewrites <code>saveDate</code> and totals on
          the next save.
        </p>
      </footer>
    </main>
  );
}

function NumInput(props: {
  value: number;
  min?: number;
  max?: number;
  kind?: NumberKind;
  className?: string;
  onCommit?: (value: number) => void;
}) {
  const { value, min, max, kind = "int", className, onCommit } = props;
  const [text, setText] = useState(String(value));

  if (String(value) !== text && Number(text) === value) {
    setText(String(value));
  }

  const commit = () => {
    let next = kind === "float" ? parseFloat(text) : parseInt(text, 10);
    if (!Number.isFinite(next)) {
      next = value;
    }
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    if (kind === "int") next = Math.floor(next);
    setText(String(next));
    onCommit?.(next);
  };

  return (
    <input
      className={className}
      type="number"
      value={text}
      min={min}
      max={max}
      step={kind === "float" ? "any" : 1}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commit();
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}

function BoolInput(props: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { label, checked, onChange } = props;
  return (
    <div className="bool-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label>{label}</label>
    </div>
  );
}

function Chips(props: {
  values: string[];
  suggestions: string[];
  rawJson?: boolean;
  onChange: (values: string[]) => void;
}) {
  const { values, suggestions, rawJson, onChange } = props;
  const [text, setText] = useState("");

  const add = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setText("");
  };

  return (
    <div className="chips">
      {values.map((value, index) => (
        <span className="chip" key={`${value}-${index}`}>
          {rawJson ? trip(value) : value}
          <button
            title="Remove"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            &times;
          </button>
        </span>
      ))}
      <div className="chip-add">
        <input
          type="text"
          value={text}
          placeholder="Add…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(text);
            }
          }}
        />
        {suggestions
          .filter((s) => !values.includes(s))
          .map((s) => (
            <button
              key={s}
              className="chip suggestion"
              onClick={() => add(s)}
            >
              {s} +
            </button>
          ))}
      </div>
    </div>
  );
}

function trip(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value));
  } catch {
    return value;
  }
}

export default App;
