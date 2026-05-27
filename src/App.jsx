import { useState } from "react";
import { items } from "./data/items";
import { evolutions } from "./data/evolutions";

const colors = {
  background: "#000000",
  panel: "#220000",
  panelAlt: "#330000",
  panelDeep: "#160000",
  border: "#8B0000",
  borderSoft: "#5A0000",
  button: "#5A0000",
  buttonAlt: "#7A0000",
  buttonHover: "#CC0000",
  evolved: "#6A0DAD",
  ready: "#1f5c2e",
  notReady: "#2a0f0f",
  possible: "#3a0000",
  planned: "#b8860b",
  owned: "#166534",
  text: "#F5E6D0",
  subtext: "#C8AFA0",
  warning: "#ff5555",
  gold: "#d6a84f",
};

const sets = [
  "Base Game",
  "Legacy of the Moonspell",
  "Emergency Meeting",
  "Tides of the Foscari",
  "Operation Guns",
  "Emerald Diorama",
  "Ode to Castlevania",
];

export default function App() {
  const [owned, setOwned] = useState([]);
  const [levels, setLevels] = useState({});
  const [evolvedWeapons, setEvolvedWeapons] = useState([]);
  const [showEvolvedWeapons, setShowEvolvedWeapons] = useState(false);
  const [plannedEvos, setPlannedEvos] = useState([]);
  const [showPossibleEvos, setShowPossibleEvos] = useState(false);
  const [openSections, setOpenSections] = useState({
    baseWeapons: {
      "Base Game": true,
      "Legacy of the Moonspell": false,
      "Tides of the Foscari": false,
      "Emergency Meeting": false,
      "Operation Guns": false,
      "Emerald Diorama": false,
      "Ode to Castlevania": false,
    },
    evolvedWeapons: {
      "Base Game": true,
      "Legacy of the Moonspell": false,
      "Tides of the Foscari": false,
      "Emergency Meeting": false,
      "Operation Guns": false,
      "Emerald Diorama": false,
      "Ode to Castlevania": false,
    },
    passives: {
      "Base Game": true,
      "Legacy of the Moonspell": false,
      "Tides of the Foscari": false,
      "Emergency Meeting": false,
      "Operation Guns": false,
      "Emerald Diorama": false,
      "Ode to Castlevania": false,
    },
  });

  const panelStyle = {
    background: colors.panel,
    border: `2px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "15px",
    boxShadow: `0 0 14px ${colors.borderSoft}`,
  };

  const sectionButtonStyle = {
    width: "100%",
    padding: "9px 10px",
    background: colors.button,
    color: colors.text,
    border: `1px solid ${colors.gold}`,
    borderRadius: "6px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const togglePlannedEvo = (resultName) => {
    setPlannedEvos((prev) =>
      prev.includes(resultName)
        ? prev.filter((item) => item !== resultName)
        : [...prev, resultName],
    );
  };

  const toggleSection = (sectionType, setName) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        [setName]: !prev[sectionType][setName],
      },
    }));
  };

  const getItemsBySetAndType = (setName, type) =>
    Object.entries(items)
      .filter(([, data]) => data.set === setName && data.type === type)
      .map(([name]) => name);

  const getImagePath = (item) => items[item]?.img || null;

  const getMaxLevel = (item) => items[item]?.max || 8;

  const fullEvolutionCount = owned.filter(
    (item) => items[item]?.type === "evolvedWeapon",
  ).length;

  const maxedPassiveCount = owned.filter(
    (item) =>
      items[item]?.type === "passive" &&
      (levels[item] || 0) >= getMaxLevel(item),
  ).length;

  const toggleOwned = (name) => {
    setOwned((prev) => {
      const alreadyOwned = prev.includes(name);

      if (alreadyOwned) {
        setLevels((currentLevels) => ({
          ...currentLevels,
          [name]: 0,
        }));

        return prev.filter((item) => item !== name);
      }

      setLevels((currentLevels) => ({
        ...currentLevels,
        [name]: currentLevels[name] || 1,
      }));

      return [...prev, name];
    });
  };

  const resetRun = () => {
    setOwned([]);
    setLevels({});
    setEvolvedWeapons([]);
    setPlannedEvos([]);
    setShowPossibleEvos(false);
  };

  const increaseLevel = (name, max) => {
    setLevels((prev) => ({
      ...prev,
      [name]: Math.min((prev[name] || 0) + 1, max),
    }));

    setOwned((prev) => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });
  };

  const decreaseLevel = (name) => {
    setLevels((prev) => {
      const newLevel = Math.max((prev[name] || 0) - 1, 0);

      if (newLevel === 0) {
        setOwned((ownedPrev) => ownedPrev.filter((item) => item !== name));
      }

      return {
        ...prev,
        [name]: newLevel,
      };
    });
  };

  const evolveWeapon = (evo) => {
    setOwned((prev) => {
      let updated = [...prev];

      evo.consumes.forEach((item) => {
        updated = updated.filter((ownedItem) => ownedItem !== item);
      });

      if (!updated.includes(evo.result)) {
        updated.push(evo.result);
      }

      return updated;
    });

    setLevels((prev) => {
      const updated = {
        ...prev,
        [evo.result]: 1,
      };

      evo.consumes.forEach((item) => {
        updated[item] = 0;
      });

      return updated;
    });

    setEvolvedWeapons((prev) => [...new Set([...prev, ...evo.consumes])]);
  };

  const visibleEvos = evolutions.filter((evo) => {
    if (owned.includes(evo.result)) return false;

    if (plannedEvos.includes(evo.result)) return true;

    return evo.requirements.some((req) => {
      const itemType = items[req.item]?.type;

      return owned.includes(req.item) && itemType !== "passive";
    });
  });

  const possibleEvos = evolutions.filter((evo) => {
    if (owned.includes(evo.result)) return false;
    if (plannedEvos.includes(evo.result)) return false;
    if (visibleEvos.includes(evo)) return false;

    return evo.requirements.some((req) => owned.includes(req.item));
  });

  const isEvolutionReady = (evo) => {
    const normalRequirementsMet = evo.requirements.every(
      (req) => (levels[req.item] || 0) >= req.level,
    );

    const fullEvolutionsMet =
      !evo.specialRequirements?.fullEvolutions ||
      fullEvolutionCount >= evo.specialRequirements.fullEvolutions;

    const maxedPassivesMet =
      !evo.specialRequirements?.maxedPassives ||
      maxedPassiveCount >= evo.specialRequirements.maxedPassives;

    return normalRequirementsMet && fullEvolutionsMet && maxedPassivesMet;
  };

  const specialRequirementDisplay = (evo) => {
    const special = evo.specialRequirements;

    if (!special) return null;

    return (
      <div
        style={{
          marginTop: "8px",
          marginBottom: "8px",
          color: colors.subtext,
          fontSize: "14px",
        }}
      >
        {special.fullEvolutions && (
          <div>
            <strong>Full Evolutions:</strong> {fullEvolutionCount}/
            {special.fullEvolutions}
          </div>
        )}

        {special.maxedPassives && (
          <div>
            <strong>Maxed Passives:</strong> {maxedPassiveCount}/
            {special.maxedPassives}
          </div>
        )}
      </div>
    );
  };

  const pickerButton = (item) => {
    const isOwned = owned.includes(item);
    const isEvolved = evolvedWeapons.includes(item);
    const imagePath = getImagePath(item);
    const isPlannedEvo = plannedEvos.includes(item);

    let background = colors.buttonAlt;
    let borderColor = colors.border;

    if (isEvolved) {
      background = colors.evolved;
      borderColor = colors.gold;
    } else if (isOwned) {
      background = colors.owned;
      borderColor = colors.gold;
    } else if (isPlannedEvo) {
      background = colors.planned;
      borderColor = colors.gold;
    }

    return (
      <button
        key={item}
        onClick={() => {
          if (items[item]?.type === "evolvedWeapon") {
            togglePlannedEvo(item);
          } else {
            toggleOwned(item);
          }
        }}
        style={{
          margin: "5px",
          padding: "10px",
          background,
          color: colors.text,
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "95px",
          minHeight: "80px",
          cursor: "pointer",
          boxShadow: isOwned || isEvolved || isPlannedEvo ? `0 0 8px ${borderColor}` : "none",
        }}
      >
        {imagePath && (
          <img
            src={imagePath}
            alt={item}
            style={{
              width: "40px",
              height: "40px",
              marginBottom: "5px",
              objectFit: "contain",
            }}
          />
        )}

        <span>{item}</span>
      </button>
    );
  };

  const levelControl = (name, max, requiredLevel = null) => {
    const currentLevel = levels[name] || 0;

    const imagePath = getImagePath(name);

    const requirementText =
      requiredLevel === max
        ? " (max)"
        : requiredLevel
          ? ` (needs ${requiredLevel})`
          : "";

    return (
      <div
        style={{
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {imagePath && (
          <img
            src={imagePath}
            alt={name}
            style={{
              width: "32px",
              height: "32px",
              objectFit: "contain",
            }}
          />
        )}

        <div>
          <strong>{name}</strong>: {currentLevel}/{max}
          <span style={{ color: colors.subtext }}>{requirementText}</span>
          <br />
          <button
            onClick={() => decreaseLevel(name)}
            style={{
              marginRight: "4px",
              background: colors.button,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            -
          </button>
          <button
            onClick={() => increaseLevel(name, max)}
            style={{
              background: colors.buttonAlt,
              color: colors.text,
              border: `1px solid ${colors.gold}`,
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const setSection = (sectionType, setName, sectionItems) => (
    <div key={`${sectionType}-${setName}`} style={{ marginBottom: "10px" }}>
      <button
        onClick={() => toggleSection(sectionType, setName)}
        style={sectionButtonStyle}
      >
        {setName} {openSections[sectionType][setName] ? "▲" : "▼"} (
        {sectionItems.length})
      </button>

      {openSections[sectionType][setName] && (
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "8px" }}>
          {sectionItems.length > 0 ? (
            sectionItems.map((item) => pickerButton(item))
          ) : (
            <p style={{ color: colors.subtext }}>No entries yet.</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        background: colors.background,
        color: colors.text,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <img
            src="/images/vampireSurvivorsMain.webp"
            alt="Vampire Survivors Run Helper"
            style={{
              maxWidth: "420px",
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        <button
          onClick={resetRun}
          style={{
            padding: "10px 16px",
            marginBottom: "20px",
            background: colors.button,
            color: colors.text,
            border: `1px solid ${colors.gold}`,
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: `0 0 10px ${colors.borderSoft}`,
          }}
        >
          Reset Run
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            alignItems: "start",
            width: "100%",
          }}
        >
          <div style={panelStyle}>
            <h2 style={{ color: colors.gold }}>Weapons</h2>

            <h3>Base Weapons</h3>

            {sets.map((setName) =>
              setSection(
                "baseWeapons",
                setName,
                getItemsBySetAndType(setName, "weapon"),
              ),
            )}

            <button
              onClick={() => setShowEvolvedWeapons(!showEvolvedWeapons)}
              style={{
                marginTop: "15px",
                marginBottom: "10px",
                padding: "10px",
                background: colors.button,
                color: colors.text,
                border: `1px solid ${colors.gold}`,
                borderRadius: "6px",
                width: "100%",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showEvolvedWeapons
                ? "Hide Evolved Weapons ▲"
                : "Show Evolved Weapons ▼"}
            </button>

            {showEvolvedWeapons && (
              <>
                <h3>Evolved Weapons</h3>

                {sets.map((setName) =>
                  setSection(
                    "evolvedWeapons",
                    setName,
                    getItemsBySetAndType(setName, "evolvedWeapon"),
                  ),
                )}
              </>
            )}
          </div>

          <div style={panelStyle}>
            <h2 style={{ color: colors.gold }}>Passive Items</h2>

            {sets.map((setName) =>
              setSection(
                "passives",
                setName,
                getItemsBySetAndType(setName, "passive"),
              ),
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
            alignItems: "start",
            width: "100%",
          }}
        >
          <div style={panelStyle}>
            <h2 style={{ color: colors.gold }}>Inventory</h2>

            {owned.length === 0 && (
              <p style={{ color: colors.subtext }}>No items yet.</p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                alignItems: "start",
              }}
            >
              <div>
                <h3>Weapons</h3>

                {owned
                  .filter((item) => items[item]?.type !== "passive")
                  .map((item) => (
                    <div
                      key={item}
                      style={{
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: `1px solid ${colors.borderSoft}`,
                      }}
                    >
                      {levelControl(item, getMaxLevel(item))}
                    </div>
                  ))}
              </div>

              <div>
                <h3>Passive Items</h3>

                {owned
                  .filter((item) => items[item]?.type === "passive")
                  .map((item) => (
                    <div
                      key={item}
                      style={{
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: `1px solid ${colors.borderSoft}`,
                      }}
                    >
                      {levelControl(item, getMaxLevel(item))}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div style={panelStyle}>
            <h2 style={{ color: colors.gold }}>Evolution Tracker</h2>

            {visibleEvos.length === 0 && (
              <p style={{ color: colors.subtext }}>
                Pick a weapon or passive item to track an evolution.
              </p>
            )}

            {visibleEvos.map((evo) => {
              const ready = isEvolutionReady(evo);

              return (
                <div
                  key={evo.result}
                  style={{
                    border: `1px solid ${ready ? colors.gold : colors.border}`,
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "15px",
                    background: ready ? colors.ready : colors.notReady,
                    boxShadow: ready ? `0 0 12px ${colors.gold}` : "none",
                  }}
                >
                  <h3
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {getImagePath(evo.result) && (
                        <img
                          src={getImagePath(evo.result)}
                          alt={evo.result}
                          style={{
                            width: "36px",
                            height: "36px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    {evo.result}
                    </h3>

                  {evo.requirements.map((req) =>
                    levelControl(req.item, getMaxLevel(req.item), req.level),
                  )}

                  {specialRequirementDisplay(evo)}

                  <strong
                    style={{
                      color: ready ? colors.gold : colors.warning,
                    }}
                  >
                    {ready ? "READY FOR EVOLUTION" : "NOT READY"}
                  </strong>

                  <br />

                  {ready && (
                    <button
                      onClick={() => evolveWeapon(evo)}
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        background: colors.evolved,
                        color: colors.text,
                        border: `1px solid ${colors.gold}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Evolve
                    </button>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setShowPossibleEvos(!showPossibleEvos)}
              style={{
                marginTop: "15px",
                marginBottom: "10px",
                padding: "10px",
                background: colors.button,
                color: colors.text,
                border: `1px solid ${colors.gold}`,
                borderRadius: "6px",
                width: "100%",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showPossibleEvos
                ? "Hide Possible Evo Paths ▲"
                : `Show Possible Evo Paths ▼ (${possibleEvos.length})`}
            </button>

            {showPossibleEvos &&
              possibleEvos.map((evo) => {
                const ready = isEvolutionReady(evo);

                return (
                  <div
                    key={evo.result}
                    style={{
                      border: `1px solid ${ready ? colors.gold : colors.border}`,
                      borderRadius: "10px",
                      padding: "15px",
                      marginBottom: "15px",
                      background: colors.possible,
                      opacity: 0.95,
                    }}
                  >
                    <h3
                      style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      }}
                    >
                      {getImagePath(evo.result) && (
                        <img
                          src={getImagePath(evo.result)}
                          alt={evo.result}
                          style={{
                            width: "36px",
                            height: "36px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      
                      {evo.result}
                    </h3>

                    {evo.requirements.map((req) =>
                      levelControl(req.item, getMaxLevel(req.item), req.level),
                    )}

                    {specialRequirementDisplay(evo)}

                    <strong
                      style={{
                        color: ready ? colors.gold : colors.warning,
                      }}
                    >
                      {ready ? "READY FOR EVOLUTION" : "POSSIBLE PATH"}
                    </strong>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: `1px solid ${colors.border}`,
          textAlign: "center",
          fontSize: "12px",
          opacity: 0.7,
          maxWidth: "900px",
        }}
      >
        Fan-made companion app for Vampire Survivors. <br />
        Vampire Survivors and all related assets are property of poncle. <br />
        This project is non-commercial and not affiliated with or endorsed by poncle.
      </div>
    </div>
  );
}
