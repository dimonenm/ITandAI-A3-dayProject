// ===== Плавный скролл к разделу "Мои навыки" =====
const skillsButton = document.getElementById("skillsButton")
const skillsSection = document.getElementById("skills")

if (skillsButton && skillsSection) {
  skillsButton.addEventListener("click", () => {
    skillsSection.scrollIntoView({ behavior: "smooth" })
  })
}

// ===== Логика блока "Мои навыки" =====

const skillsGrid = document.getElementById("skillsGrid")
const addSkillButton = document.getElementById("addSkillButton")
const STORAGE_KEY = "mySkillsCards"

/**
 * Чтение навыков из localStorage
 * @returns {Array<{id:string,title:string,description:string}>}
 */
function loadSkills() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      ...item,
      done: Boolean(item.done),
    }))
  } catch {
    return []
  }
}

/**
 * Сохранение навыков в localStorage
 * @param {Array} skills
 */
function saveSkills(skills) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(skills))
}

/**
 * Создание DOM‑элемента карточки навыка
 * @param {{id:string,title:string,description:string}} skill
 */
function createSkillCard(skill) {
  const card = document.createElement("article")
  card.className = "skill-card"
  card.dataset.id = skill.id

  const removeBtn = document.createElement("button")
  removeBtn.className = "skill-card__remove"
  removeBtn.type = "button"
  removeBtn.title = "Удалить навык"
  removeBtn.setAttribute("aria-label", "Удалить навык")
  removeBtn.textContent = "×"
  removeBtn.addEventListener("click", (event) => {
    event.stopPropagation()
    const confirmed = window.confirm(`Удалить навык «${skill.title}»?`)
    if (!confirmed) return
    skillsState = skillsState.filter((item) => item.id !== skill.id)
    saveSkills(skillsState)
    renderSkills(skillsState)
  })

  const completeBtn = document.createElement("button")
  completeBtn.className = "skill-card__complete"
  completeBtn.type = "button"
  completeBtn.title = "Отметить как освоено"
  completeBtn.setAttribute("aria-label", "Отметить как освоено")
  completeBtn.textContent = "✓"
  completeBtn.addEventListener("click", (event) => {
    event.stopPropagation()
    skillsState = skillsState.map((item) =>
      item.id === skill.id ? { ...item, done: !item.done } : item
    )
    saveSkills(skillsState)
    renderSkills(skillsState)
  })

  const meta = document.createElement("div")
  meta.className = "skill-card__meta"
  meta.textContent = "Навык"

  const title = document.createElement("h3")
  title.className = "skill-card__title"
  title.textContent = skill.title

  const description = document.createElement("p")
  description.className = "skill-card__description"
  description.textContent = skill.description || "Описание пока не добавлено."

  const status = document.createElement("div")
  status.className = "skill-card__status"

  const statusDot = document.createElement("span")
  statusDot.className = "skill-card__status-dot"

  const statusText = document.createElement("span")
  statusText.textContent = "в процессе прокачки"

  status.appendChild(statusDot)
  status.appendChild(statusText)

  card.appendChild(completeBtn)
  card.appendChild(removeBtn)
  card.appendChild(meta)
  card.appendChild(title)
  card.appendChild(description)
  card.appendChild(status)

  // обработчик разворачивания/сворачивания
  card.addEventListener("click", () => {
    card.classList.toggle("skill-card--expanded")
  })

  if (skill.done) {
    card.classList.add("skill-card--done")
    statusText.textContent = "освоено"
  }

  return card
}

/**
 * Полная перерисовка сетки навыков
 * @param {Array} skills
 */
function renderSkills(skills) {
  if (!skillsGrid) return
  skillsGrid.innerHTML = ""
  skills.forEach((skill) => {
    const card = createSkillCard(skill)
    skillsGrid.appendChild(card)
  })
}

// Инициализация: восстановление из localStorage или стартовый набор
let skillsState = loadSkills()
if (!skillsState.length) {
  skillsState = [
    {
      id: "html",
      title: "HTML & семантика",
      description:
        "Умею строить аккуратную, семантическую разметку, которая понятна и браузеру, и человеку.",
      done: false,
    },
    {
      id: "css",
      title: "Современный CSS",
      description:
        "Работаю с Flexbox, Grid, адаптивной версткой и небольшими анимациями для живого интерфейса.",
      done: false,
    },
    {
      id: "js",
      title: "JavaScript основы",
      description:
        "Понимаю базовые концепции языка и умею добавлять интерактив к страницам без лишних библиотек.",
      done: false,
    },
  ]
  saveSkills(skillsState)
}

renderSkills(skillsState)

// Добавление нового навыка через prompt()
if (addSkillButton) {
  addSkillButton.addEventListener("click", () => {
    const title = window.prompt("Введите название навыка:")
    if (!title || !title.trim()) {
      return
    }

    const description =
      window.prompt("Кратко опишите, что вы уже умеете по этому навыку:") ||
      ""

    const newSkill = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: title.trim(),
      description: description.trim(),
      done: false,
    }

    skillsState = [newSkill, ...skillsState]
    saveSkills(skillsState)
    renderSkills(skillsState)
  })
}

// ===== Анимация фона: реакция на курсор =====
const root = document.documentElement

function updateGradientPosition(x, y) {
  // x, y — координаты курсора в процентах от размера окна
  const percentX = (x / window.innerWidth) * 100
  const percentY = (y / window.innerHeight) * 100

  // Делаем диапазон шире, чтобы реакция фона была заметнее
  const clampedX = 5 + percentX * 0.9 // от ~5% до ~95%
  const clampedY = 0 + percentY * 0.8 // от ~0% до ~80%

  root.style.setProperty("--bg-gradient-x", `${clampedX}%`)
  root.style.setProperty("--bg-gradient-y", `${clampedY}%`)
}

// Слушаем движение мыши
window.addEventListener("mousemove", (event) => {
  updateGradientPosition(event.clientX, event.clientY)
})

// Поддержка тача (чтобы на телефоне тоже был лёгкий эффект)
window.addEventListener("touchmove", (event) => {
  const touch = event.touches[0]
  if (touch) {
    updateGradientPosition(touch.clientX, touch.clientY)
  }
}, { passive: true });

// ===== Логика блока "Мой индекс навыков" =====

const SKILL_INDEX_STORAGE_KEY = "skillIndexValues"

const skillInputs = {
  html: document.getElementById("skill-html"),
  css: document.getElementById("skill-css"),
  js: document.getElementById("skill-js"),
  react: document.getElementById("skill-react"),
  llm: document.getElementById("skill-llm"),
}

const skillValues = {
  html: document.getElementById("value-html"),
  css: document.getElementById("value-css"),
  js: document.getElementById("value-js"),
  react: document.getElementById("value-react"),
  llm: document.getElementById("value-llm"),
}

const averageValue = document.getElementById("averageValue")
const progressFill = document.getElementById("progressFill")
const resultDescription = document.getElementById("resultDescription")

/**
 * Загрузка значений из localStorage
 * @returns {Object}
 */
function loadSkillIndexValues() {
  try {
    const raw = window.localStorage.getItem(SKILL_INDEX_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      html: Number(parsed.html) || 0,
      css: Number(parsed.css) || 0,
      js: Number(parsed.js) || 0,
      react: Number(parsed.react) || 0,
      llm: Number(parsed.llm) || 0,
    }
  } catch {
    return null
  }
}

/**
 * Сохранение значений в localStorage
 * @param {Object} values
 */
function saveSkillIndexValues(values) {
  window.localStorage.setItem(SKILL_INDEX_STORAGE_KEY, JSON.stringify(values))
}

/**
 * Расчет среднего значения
 * @param {Object} values
 * @returns {number}
 */
function calculateAverage(values) {
  const sum = values.html + values.css + values.js + values.react + values.llm
  return Math.round(sum / 5)
}

/**
 * Получение текстового описания на основе уровня
 * @param {number} level
 * @returns {string}
 */
function getLevelDescription(level) {
  if (level >= 0 && level <= 25) {
    return "Начинающий, верный старт"
  } else if (level >= 26 && level <= 50) {
    return "Прогрессируешь, держи темп"
  } else if (level >= 51 && level <= 75) {
    return "Уверенно растёшь, почти junior"
  } else {
    return "Сильная база — готов к портфолио"
  }
}

/**
 * Обновление всех значений и отображения
 */
function updateSkillIndex() {
  const currentValues = {
    html: Number(skillInputs.html.value),
    css: Number(skillInputs.css.value),
    js: Number(skillInputs.js.value),
    react: Number(skillInputs.react.value),
    llm: Number(skillInputs.llm.value),
  }

  // Обновление значений под слайдерами
  skillValues.html.textContent = `${currentValues.html}%`
  skillValues.css.textContent = `${currentValues.css}%`
  skillValues.js.textContent = `${currentValues.js}%`
  skillValues.react.textContent = `${currentValues.react}%`
  skillValues.llm.textContent = `${currentValues.llm}%`

  // Расчет и отображение среднего значения
  const average = calculateAverage(currentValues)
  averageValue.textContent = `${average}%`

  // Обновление progress bar
  progressFill.style.width = `${average}%`

  // Обновление текстового описания
  resultDescription.textContent = getLevelDescription(average)

  // Сохранение в localStorage
  saveSkillIndexValues(currentValues)
}

// Инициализация: загрузка значений из localStorage
const savedValues = loadSkillIndexValues()
if (savedValues) {
  skillInputs.html.value = savedValues.html
  skillInputs.css.value = savedValues.css
  skillInputs.js.value = savedValues.js
  skillInputs.react.value = savedValues.react
  skillInputs.llm.value = savedValues.llm
}

// Добавление обработчиков событий для всех слайдеров
Object.values(skillInputs).forEach((input) => {
  if (input) {
    input.addEventListener("input", updateSkillIndex)
  }
})

// Первоначальное обновление для отображения текущих значений
updateSkillIndex()

