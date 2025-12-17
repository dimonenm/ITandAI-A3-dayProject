const skillsButton = document.getElementById("skillsButton")

if (skillsButton) {
  skillsButton.addEventListener("click", () => {
    alert("Здесь позже появится раздел с моими навыками")
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

