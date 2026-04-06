при нажатии в @StudentDetails.tsx кнопки back to dashboard он переносит в логин

при нажатии Enter после ввода данных на страницах Login.tsx и Register.tsx должны отправляться данные

---

## Баг: SCHOOL_ADMIN не может создавать группы

**Описание:**
- `SUPER_ADMIN` создает `SCHOOL_ADMIN` через `/api/v1/super-admin/tenants/{tenantId}/create-admin`
- При входе `SCHOOL_ADMIN` правильно распознается и перенаправляется на `/school-admin`
- Но при попытке создать группу через `/api/v1/school-admin/groups` получает 403 Forbidden
- `SCHOOL_ADMIN` не имеет прав на создание групп в бэкенде

**Причина:**
- Ограничение прав в бэкенде - роль `SCHOOL_ADMIN` не имеет доступа к созданию групп
- Эндпоинт `/api/v1/school-admin/groups` требует прав, которых нет у `SCHOOL_ADMIN`

**Решение:**
1. `SUPER_ADMIN` создает группы через `/api/v1/super-admin/groups` (если эндпоинт существует)
2. Если эндпоинт не существует, используется `/api/v1/school-admin/groups` с флагом `superAdminOverride: true`
3. `SCHOOL_ADMIN` может управлять школой, создавать staff, но не может создавать группы
4. Для создания групп нужен `SUPER_ADMIN` или исправление прав в бэкенде

**Статус:** Временно решено обходными путями

