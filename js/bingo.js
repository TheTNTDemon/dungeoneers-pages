const palList = [
  'Brymm & Dunamir fight',
  'Maid outfit',
  'Ynsart made bad food',
  'Dunamir falls in love',
  'Brair gets angry',
  'Ynsart f*cks a dragon',
  'Orion actually succeeding a grapple',
  'Fluffy mention (by xy)',
  'Party member dies (permanently)',
  'Dunamir\'s invention leveling a city',
  'Party member gets jailed',
  'Brair/Ynsart willingly become cursed',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24'
];

const coiList = [];

const seedDisplay = document.getElementById('seed');
const generateCardButton = document.getElementById('generate-card');
const cardInputs = document.querySelectorAll(".grid label input");
const currentType = document.currentScript.dataset.type;
const storageKey = `DP${currentType}Bingo`;

function generateSeed(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let seed = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    seed += characters[randomIndex];
  }

  return seed;
}

function getSeedFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("seed");
}

function setSeedInUrl(seed) {
  const url = new URL(window.location.href);
  url.searchParams.set("seed", seed);

  window.history.replaceState({}, "", url);
}

function setSeed(seed) {
  seedDisplay.textContent = seed;
  setSeedInUrl(seed);
}

let seed = getSeedFromUrl();

let DPBingoData = LocalStorage.getJSON(storageKey) || {};

seed = DPBingoData?.seed || seed;

if (!seed) {
  seed = generateSeed();
  setSeedInUrl(seed);
  LocalStorage.setJSON(storageKey, DPBingoData);
}

setSeed(seed);

function hashSeed(seedText) {
  let hash = 2166136261;

  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seedText) {
  let state = hashSeed(seedText);

  return function () {
    state += 0x6D2B79F5;

    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed(array, seedText) {
  const shuffled = [...array];
  const random = createSeededRandom(seedText);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  return shuffled;
}

function insertToCard(array) {
  const cardSlots = document.querySelectorAll("label .mark span");
  let itemIndex = 0;

  cardSlots.forEach((slot, index) => {
    const spotNumber = index + 1;

    if (spotNumber === 13) {
      slot.textContent = "FREE";
      return;
    }

    slot.textContent = array[itemIndex] ?? "";
    itemIndex++;
  });
}

function saveCheckedSlots() {
  const checkedSlots = [];

  cardInputs.forEach((input, index) => {
    if (input.checked) {
      checkedSlots.push(index);
    }
  });

  const DPBingoData = LocalStorage.getJSON(storageKey) || {};
  DPBingoData.checkedSlots = checkedSlots;

  LocalStorage.setJSON(storageKey, DPBingoData);
}

function restoreCheckedSlots() {
  const DPBingoData = LocalStorage.getJSON(storageKey) || {};
  const checkedSlots = DPBingoData.checkedSlots || [];

  cardInputs.forEach((input, index) => {
    input.checked = checkedSlots.includes(index);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const shuffledLines = shuffleWithSeed(currentType === "PaL" ? palList : coiList, seed);

  insertToCard(shuffledLines);
  restoreCheckedSlots();
});

cardInputs.forEach((input, index) => {
  input.addEventListener("change", () => {
    saveCheckedSlots();
  });
});

generateCardButton.addEventListener('click', () => {
  seed = generateSeed();
  setSeed(seed);

  let DPBingoData = LocalStorage.getJSON(storageKey) || {};
  DPBingoData.seed = seed;
  DPBingoData.checkedSlots = [];

  LocalStorage.setJSON(storageKey, DPBingoData);

  const shuffledLines = shuffleWithSeed(currentType === "PaL" ? palList : coiList, seed);

  insertToCard(shuffledLines);

  cardInputs.forEach(input => {
    input.checked = false;
  });
});