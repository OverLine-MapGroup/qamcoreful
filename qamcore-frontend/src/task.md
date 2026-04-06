# Инструкции для агента — Qamfront

## Шаг 1 — Удалить все моковые данные

### 1.1 `src/pages/Messages.tsx`
Удали объект `sampleChatMessages` и интерфейс `ChatMessage` (строки в начале файла).
Убери всё, что связано с моковым чатом:
- `const sampleChatMessages: { [key: number]: ChatMessage[] } = { 1: [...], 2: [...] }`
- стейт `chatMessages` и `newMessage`
- функцию `handleSendMessage`
- блок "Chat View" целиком (весь JSX `{viewMode === "chat" && (...)}`)
- кнопку переключения "Чат / Кейсы" — оставь только режим "Кейсы"
- импорт `ChatMessage` если остался

Вкладка "Чат" — это мок, реального API чата нет в swagger. Оставить только раздел кейсов (`viewMode === "cases"`).

---

### 1.2 `src/pages/Complaints.tsx`
Строка:
```ts
const userRole = "PSYCHOLOGIST"; // Will be updated based on actual auth context
```
Замени на получение роли из Zustand store:
```ts
const { role: userRole, logout } = useAuthStore();
```
Убери дублирующий `const { logout } = useAuthStore()` если он уже есть.

---

### 1.3 `src/pages/SuperAdminPage.tsx`
Карточка "Базы данных" захардкожена значением `8` и текстом "Системные данные" — это мок.
Удали эту карточку целиком из грида статистики (она не соответствует ни одному полю из `GET /api/v1/super-admin/stats`).

Также в таблице тенантов есть дублирующийся столбец "Создано" (`<td>` с `createdAt` встречается дважды — оставь только один).

---

### 1.4 `src/api/superAdmin.ts`
Функция `createSuperAdminGroup` вызывает несуществующие эндпоинты:
- `POST /api/v1/super-admin/groups` — нет в swagger
- `POST /api/v1/school-admin/groups` с параметром `superAdminOverride: true` — нет в swagger

Удали эту функцию полностью. В `SuperAdminPage.tsx` удали кнопку "Группа" и обработчик `handleCreateGroup` — этот функционал для SUPER_ADMIN не предусмотрен API.

---

### 1.5 `src/api/schoolAdmin.ts`
Функция `getStaff` вызывает `GET /api/v1/school-admin/staff` — такого эндпоинта нет в swagger (есть только POST).
Удали функцию `getStaff` и интерфейс `Staff` если он нигде не используется.

---

## Шаг 2 — Изучи Swagger

Файл: `src/swagger.md`

Прочитай его полностью. Запомни все эндпоинты, методы, параметры и схемы ответов.

---

## Шаг 3 — Протестировать каждый эндпоинт

Базовый URL бэкенда: `https://qamcore-backend-example-production.up.railway.app`

Пройдись по каждому контроллеру и убедись что:
- Запрос уходит на правильный путь
- Передаются нужные параметры/body
- Ответ обрабатывается согласно схеме из swagger

### Чеклист по контроллерам:

#### auth-controller
- [ ] `POST /api/v1/auth/register-anonymous` — body: `{ inviteCode, password }` → `{ accessToken, refreshToken, username, role }`
- [ ] `POST /api/v1/auth/login` — body: `{ username, password }` → `{ accessToken, refreshToken, username, role }`
- [ ] `POST /api/v1/auth/refresh-token`
- [ ] `POST /api/v1/auth/logout`

#### check-in-controller
- [ ] `GET /api/v1/checkins/active` → `{ checkinId, status, deadline, message, questions[] }`
- [ ] `POST /api/v1/checkins` — body: `{ checkinId, answers: { [questionId]: number } }` → `{ status, totalScore, riskLevel }`

#### student-controller
- [ ] `GET /api/v1/student/messages` → массив кейсов
- [ ] `GET /api/v1/student/psychologists` → массив психологов
- [ ] `POST /api/v1/student/psychologists/{psychologistId}/book-click`
- [ ] `POST /api/v1/student/complaints` — body: `{ category, text }`

#### psychologist-controller
- [ ] `GET /api/v1/psychologist/dashboard/stats` → `{ riskGroupCount, totalStudents, riskPercentage, activeToday, hasBookingUrl }`
- [ ] `GET /api/v1/psychologist/students` (с параметром `filter` и `pageable`) → paginated `{ content: StudentRiskDto[] }`
- [ ] `GET /api/v1/psychologist/students/{studentId}` → `{ id, anonymousId, groupName }`
- [ ] `GET /api/v1/psychologist/students/{studentId}/history` → paginated `{ content: CheckInHistory[] }`
- [ ] `GET /api/v1/psychologist/students/{studentId}/cases` → массив кейсов
- [ ] `POST /api/v1/psychologist/students/{studentId}/cases` — body: `{ message, communicationLink }`
- [ ] `POST /api/v1/psychologist/cases/{caseId}/resolve`
- [ ] `GET /api/v1/psychologist/complaints` (pageable)
- [ ] `PATCH /api/v1/psychologist/complaints/{complaintId}/resolve` — body: `{ status, resolutionComment }`
- [ ] `PATCH /api/v1/psychologist/profile/booking-url` — body: `{ bookingUrl }`

#### school-admin-controller
- [ ] `GET /api/v1/school-admin/dashboard/stats` → `{ totalStudents, totalTeachers, unusedCodesCount, weeklyParticipationRate }`
- [ ] `GET /api/v1/school-admin/groups` → массив групп
- [ ] `POST /api/v1/school-admin/groups` — body: `{ name, curatorId }`
- [ ] `GET /api/v1/school-admin/groups/{groupId}/details` → детальная информация о группе со студентами
- [ ] `GET /api/v1/school-admin/groups/{groupId}/unused-codes`
- [ ] `POST /api/v1/school-admin/staff` — body: `{ fullName, role }`
- [ ] `GET /api/v1/school-admin/teachers`
- [ ] `POST /api/v1/school-admin/codes/generate` — body: `{ amount, groupId }`
- [ ] `GET /api/v1/school-admin/complaints` (pageable)
- [ ] `PATCH /api/v1/school-admin/complaints/{complaintId}/resolve` — body: `{ status, resolutionComment }`
- [ ] `GET /api/v1/school-admin/analytics/participation`

#### super-admin-controller
- [ ] `GET /api/v1/super-admin/stats` → `{ totalTenants, totalUsers, totalStudents }`
- [ ] `GET /api/v1/super-admin/tenants` → массив тенантов
- [ ] `POST /api/v1/super-admin/tenants` — body: `{ name }`
- [ ] `POST /api/v1/super-admin/tenants/{tenantId}/create-admin` → `{ username, password, role }`

#### health-controller
- [ ] `GET /api/v1/public/health`

---

## Шаг 4 — Написать код

Только после того как прошёл все шаги выше — пиши финальный код.

### Что нужно исправить по результатам тестирования:

**`src/pages/Dashboard.tsx`**
- Поле `hasBookingUrl` приходит с `/api/v1/psychologist/dashboard/stats` — добавь его в интерфейс `DashboardStats`
- Если `hasBookingUrl === false`, показывай баннер/кнопку для добавления booking URL через `PATCH /api/v1/psychologist/profile/booking-url`
- Убери `console.log` отладочные строки

**`src/pages/Complaints.tsx`**
- Роль теперь берётся из store — убедись что логика выбора между `getPsychologistComplaints` и `getSchoolAdminComplaints` работает правильно для ролей `PSYCHOLOGIST`, `SCHOOL_ADMIN`

**`src/pages/SchoolAdminPage.tsx`**
- Добавить вкладку "Analytics" использующую `GET /api/v1/school-admin/analytics/participation`
- При клике на группу в таблице Groups переходить на детальный вид через `GET /api/v1/school-admin/groups/{groupId}/details` (показывать студентов, riskLevel, lastScore и т.д.)

**`src/pages/SuperAdminPage.tsx`**
- Удалить кнопку "Группа" из строки тенанта (функция не поддерживается API)
- Поле `totalUsers` в `SuperAdminStats` — уточни что это именно количество пользователей, а не только студентов

**`src/api/psychologist.ts`**
- Функция `fetchStudentDetails` возвращает `{ id, anonymousId, groupName }` — убедись что интерфейс `StudentDetailsResponse` совпадает (убери несуществующее поле `history`)

**`src/pages/StudentDetails.tsx`**
- История загружается отдельным запросом `/api/v1/psychologist/students/{studentId}/history?page=0&size=50` — это правильно, оставить как есть

---

## Важные замечания

- Не вызывай несуществующие эндпоинты — сверяйся только со swagger.md
- Не добавляй новых моковых данных
- Делай шаги строго по порядку: 1 → 2 → 3 → 4
- Не пиши код до завершения тестирования