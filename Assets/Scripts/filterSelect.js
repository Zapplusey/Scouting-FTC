const roundsTeams = {
  1: [11192, 12016, 21957, 22764],
  2: [17056, 16473, 19000, 11803],
  3: [22144, 12797, 11567, 14869],
  4: [15298, 11443, 22644, 13146],
  5: [11635, 21770, 13452, 21796],
  6: [9662, 12363, 14028, 17182],
  7: [14869, 12797, 17056, 11192],
  8: [22764, 19000, 22644, 15298],
  9: [21770, 21957, 11635, 22144],
  10: [13452, 14028, 11803, 17182],
  11: [13146, 21796, 12363, 12016],
  12: [11567, 9662, 11443, 16473],
  13: [21957, 22644, 14869, 17056],
  14: [15298, 11192, 11635, 11803],
  15: [12016, 19000, 21770, 12363],
  16: [9662, 13452, 12797, 22764],
  17: [13146, 16473, 14028, 22144],
  18: [17182, 21796, 11443, 11567],
  19: [12363, 17056, 15298, 11635],
  20: [11803, 9662, 14869, 12016],
  21: [12797, 22644, 16473, 21770],
  22: [22764, 14028, 21796, 11443],
  23: [11567, 21957, 13146, 13452],
  24: [17182, 22144, 19000, 11192],
  25: [12016, 11635, 16473, 22644],
  26: [14028, 14869, 21770, 15298],
  27: [11803, 11567, 12363, 22764],
  28: [11192, 11443, 13452, 19000],
  29: [21796, 17056, 22144, 9662],
  30: [21957, 13146, 17182, 12797],
  31: [16473, 12363, 22764, 14869],
  32: [22644, 14028, 11192, 11567],
  33: [22144, 15298, 12016, 13452],
  34: [21796, 11803, 12797, 21957],
  35: [19000, 13146, 9662, 11635],
  36: [11443, 17182, 17056, 21770],
};

const TeamNames = {
  14029: "Orbit Vikings",
  15637: "Fata Morgana",
  12016: "Mishmash",
  22144: "Deagles",
  11192: "Black Tigers",
  11567: "Super Nova",
  15298: "Roboten",
  16473: "Scifighters",
  12201: "Tatooine",
  11808: "Connection",
  17019: "Blackbeard",
  15811: "Boosteam",
  22734: "Jotanheim",
  13452: "BTJ",
  11443: "Atmoix",
  14028: "Orbit 12",
  14872: "Orbit",
  12363: "Orange Fox",
  9662: "Apollo",
  13146: "Makers Assemble",
  11803: "Achva Gilboa",
  15141: "AM.I.T",
  21656: "Fireflies",
  17056: "Mechanic Makers",
  18833: "Megiddo Lions",
  22947: "Team Hydra",
  12797: "Meggido Lions",
  11635: "Quack Attack",
  19967: "AIS Talons",
  19766: "Velocity",
  21957: "Goblin Mode",
  22644: "Ray Ladies",
  14869: "Bomba",
  18735: "Ringostar",
  11226: "Black Thunder",
  19000: "Everglow",
  21796: "Eclipse",
  21850: "Arava",
  20669: "Build For Change",
  22764: "Alhekma",
  17106: "Plantech",
  12989: "Super Cow",
  21770: "Hof Hasharon",
  22646: "Mizpe Yam",
  12817: "Everest",
  22681: "Amal Maale Adumim",
  17182: "Red Mask",
  18268: "Sycatech",
};

const addSelectEvent = () => {
  const b = document.getElementById("selectTeamsRoundButton");
  const r = document.getElementById("selectTeamsRoundInput");
  const s = document.getElementById("teamRoundsSelector");
  console.log(b, r, s);
  b.addEventListener("click", () => {
    addOptions(s, r.value);
  });
};

const addOptions = (s, num = 1) => {
  s.innerHTML = "";
  roundsTeams[num].forEach((team) => {
    let option_ = document.createElement("option");
    option_.innerHTML = TeamNames[team] + " #" + team;
    s.appendChild(option_);
  });
};

addSelectEvent();
