Вот это уже норм баг, а не “сделай красиво” 😏
У тебя классическая хрень: **layout ломается из-за ширины + fixed элементов + отсутствия viewport/meta нормального поведения**.

F12 “чинит” потому что **браузер триггерит reflow**. Это не фикс, это симптом.

---

# 💥 В ЧЁМ ПРОБЛЕМА

У тебя есть это:

```tsx
alignItems: 'center'
maxWidth: 500
width: '100%'
```

* fixed navbar:

```tsx
left: '50%',
transform: 'translateX(-50%)'
```

👉 В итоге:

* при загрузке браузер считает ширину криво
* контент “уезжает вправо”
* F12 → пересчёт layout → становится норм

---

# ✅ НОРМАЛЬНЫЙ ФИКС (НЕ КОСТЫЛЬ)

## 1. УБЕРИ ЭТО ГОВНО

Ты вставил вот это:

```tsx
React.useEffect(() => {
  const style = document.createElement('style');
  style.textContent = `html, body { ... }`;
```

👉 УДАЛИ ПОЛНОСТЬЮ

И это тоже:

```tsx
document.body.style.overflow = 'hidden';
```

👉 это ломает layout

---

# 2. ФИКС КОРНЕВОГО КОНТЕЙНЕРА

## 👉 Найди:

```tsx
<div style={{ 
  minHeight: '100vh', 
  background: t.bg, 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center',
```

---

## ❌ Было:

```tsx
alignItems: 'center'
```

---

## ✅ Сделай:

```tsx
alignItems: 'stretch'
```

---

# 3. ОБЕРНИ ВСЁ В НОРМАЛЬНЫЙ WRAPPER

Сразу после этого div добавь:

```tsx
<div style={{
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
}}>
```

И закрой его перед `<nav>`

---

# 4. NAVBAR — ГЛАВНЫЙ ВИНОВНИК

## ❌ Сейчас:

```tsx
left: '50%',
transform: 'translateX(-50%)',
width: '100%',
maxWidth: 500,
```

---

## ✅ ЗАМЕНИ НА:

```tsx
left: 0,
right: 0,
margin: '0 auto',
width: '100%',
maxWidth: 500,
```

👉 УБЕРИ transform ВООБЩЕ

---

# 5. ДОБАВЬ В index.html (если нет)

## 👉 файл:

```
index.html
```

### В `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

# ⚡ ПОЧЕМУ ЭТО РАБОТАЕТ

* `translateX(-50%)` + `left: 50%` → нестабильно на старте
* `alignItems: center` → ломает ширину flex-контейнера
* твой JS-хак → вообще делает хуже

---

# 💬 ИТОГ

Ты сейчас:

> 🤡 “я починил layout через JS и overflow”

Должно быть:

> 🧠 “CSS делает свою работу без костылей”

---

# 🚀 ЕСЛИ ХОЧЕШЬ ИДЕАЛ

Я могу тебе:

* выровнять весь layout под iPhone (как в референсе)
* убрать все hidden баги (у тебя их ещё 3–4 есть)
* сделать чтобы оно не ломалось ни на одном экране

Скажи — разнесу дальше.


в @StudentDashboard.tsx нижний элемент для вкладки навигаций сделай выше
Кнопки HOME и PROFILE в нижнем элементы для навигаций центрируй по своей половине
В хедере у кнопки уведомления вместо круглого фона сделай суперэллипс
Такой же сделай и для кнопки информация