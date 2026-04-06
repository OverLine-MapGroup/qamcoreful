import { http, HttpResponse } from "msw";

const BASE = "https://qamcore-backend-example-production.up.railway.app";

// ─── Seed Data ───────────────────────────────────────────────────────────────

const tenants = [
  { id: 1, name: "Школа №1 — Алматы", createdAt: "2024-09-01T08:00:00.000Z" },
  { id: 2, name: "Колледж Технологий", createdAt: "2024-10-15T10:00:00.000Z" },
  { id: 3, name: "Гимназия им. Абая", createdAt: "2025-01-20T09:30:00.000Z" },
];

const teachers = [
  { id: 10, username: "teacher-aibek" },
  { id: 11, username: "teacher-zarina" },
  { id: 12, username: "teacher-marat" },
];

const groups = [
  { id: 1, name: "9А", curatorName: "teacher-aibek" },
  { id: 2, name: "10Б", curatorName: "teacher-zarina" },
  { id: 3, name: "11В", curatorName: "teacher-marat" },
];

const students = [
  { studentId: 101, displayName: "Anon-alpha-1", riskLevel: "HIGH", riskScore: 87, lastCheckInAt: "2025-03-14T08:30:00.000Z", hasSos: true },
  { studentId: 102, displayName: "Anon-beta-2", riskLevel: "MEDIUM", riskScore: 62, lastCheckInAt: "2025-03-14T09:00:00.000Z", hasSos: false },
  { studentId: 103, displayName: "Anon-gamma-3", riskLevel: "LOW", riskScore: 22, lastCheckInAt: "2025-03-13T14:00:00.000Z", hasSos: false },
  { studentId: 104, displayName: "Anon-delta-4", riskLevel: "HIGH", riskScore: 91, lastCheckInAt: "2025-03-12T10:00:00.000Z", hasSos: true },
  { studentId: 105, displayName: "Anon-epsilon-5", riskLevel: "LOW", riskScore: 18, lastCheckInAt: "2025-03-14T07:45:00.000Z", hasSos: false },
  { studentId: 106, displayName: "Anon-zeta-6", riskLevel: "MEDIUM", riskScore: 55, lastCheckInAt: "2025-03-11T11:00:00.000Z", hasSos: false },
  { studentId: 107, displayName: "Anon-eta-7", riskLevel: "LOW", riskScore: 10, lastCheckInAt: "2025-03-14T06:00:00.000Z", hasSos: false },
];

const complaints = [
  { id: 1, tenantId: 1, category: "BULLYING", status: "NEW", text: "Меня постоянно обзывают в классе, это происходит каждый день уже несколько недель.", resolutionComment: null, createdAt: "2025-03-10T10:00:00.000Z", updatedAt: "2025-03-10T10:00:00.000Z", resolvedAt: null },
  { id: 2, tenantId: 1, category: "DEPRESSION", status: "IN_PROGRESS", text: "Чувствую себя очень плохо, не хочу ходить в школу, всё кажется бессмысленным.", resolutionComment: "Взято в работу, назначена встреча", createdAt: "2025-03-09T14:00:00.000Z", updatedAt: "2025-03-11T09:00:00.000Z", resolvedAt: null },
  { id: 3, tenantId: 1, category: "TEACHER", status: "RESOLVED_SUCCESS", text: "Учитель по математике унижает учеников перед всем классом.", resolutionComment: "Проведена беседа с преподавателем, ситуация урегулирована.", createdAt: "2025-03-05T08:00:00.000Z", updatedAt: "2025-03-08T16:00:00.000Z", resolvedAt: "2025-03-08T16:00:00.000Z" },
  { id: 4, tenantId: 1, category: "INFRASTRUCTURE", status: "NEW", text: "В туалете сломаны все замки уже месяц, никто не чинит.", resolutionComment: null, createdAt: "2025-03-13T12:00:00.000Z", updatedAt: "2025-03-13T12:00:00.000Z", resolvedAt: null },
  { id: 5, tenantId: 1, category: "BULLYING", status: "RESOLVED_REJECTED", text: "test test test", resolutionComment: "Признано спамом, не подтверждено.", createdAt: "2025-03-01T10:00:00.000Z", updatedAt: "2025-03-02T10:00:00.000Z", resolvedAt: "2025-03-02T10:00:00.000Z" },
];

const cases = [
  { caseId: 1, psychologistName: "Psych-main", message: "Замечена тревожность, приглашаю на консультацию", communicationLink: "t.me/psych_qam", status: "ACTIVE", createdAt: "2025-03-12T10:00:00.000Z", resolvedAt: null },
  { caseId: 2, psychologistName: "Psych-main", message: "Необходима поддержка, высокий уровень стресса", communicationLink: "t.me/psych_qam", status: "RESOLVED", createdAt: "2025-03-08T09:00:00.000Z", resolvedAt: "2025-03-10T15:00:00.000Z" },
];

const checkinHistory = [
  { checkInId: 1, date: "2025-03-14T08:30:00.000Z", score: 87, riskLevel: "HIGH", answersJson: JSON.stringify({ q1: 4, q2: 5, q3: 3, q4: 5 }) },
  { checkInId: 2, date: "2025-03-13T08:00:00.000Z", score: 72, riskLevel: "MEDIUM", answersJson: JSON.stringify({ q1: 3, q2: 4, q3: 3, q4: 4 }) },
  { checkInId: 3, date: "2025-03-12T08:15:00.000Z", score: 55, riskLevel: "MEDIUM", answersJson: JSON.stringify({ q1: 2, q2: 3, q3: 3, q4: 3 }) },
  { checkInId: 4, date: "2025-03-11T09:00:00.000Z", score: 30, riskLevel: "LOW", answersJson: JSON.stringify({ q1: 1, q2: 2, q3: 2, q4: 2 }) },
  { checkInId: 5, date: "2025-03-10T08:30:00.000Z", score: 20, riskLevel: "LOW", answersJson: JSON.stringify({ q1: 1, q2: 1, q3: 2, q4: 1 }) },
];

const studentMessages = [
  { caseId: 1, psychologistName: "Psych-main", message: "Здравствуйте! Я заметил ваши результаты и хочу поговорить. Пожалуйста, напишите мне.", communicationLink: "t.me/psych_qam", status: "ACTIVE", createdAt: "2025-03-12T10:00:00.000Z", resolvedAt: null },
];

const psychologists = [
  { psychologistId: 1, name: "Айгерим Сейткали", bookingUrl: "https://calendly.com/psych-aigеrim" },
  { psychologistId: 2, name: "Данияр Нурланов", bookingUrl: "https://calendly.com/psych-daniyar" },
];

// ─── Helper: paginate ─────────────────────────────────────────────────────────

function paginate<T>(data: T[], page = 0, size = 20) {
  const total = data.length;
  const totalPages = Math.ceil(total / size);
  const content = data.slice(page * size, page * size + size);
  return {
    content,
    totalPages,
    totalElements: total,
    numberOfElements: content.length,
    size,
    number: page,
    pageable: { pageNumber: page, paged: true, pageSize: size, unpaged: false, offset: page * size, sort: { sorted: false, unsorted: true, empty: true } },
    sort: { sorted: false, unsorted: true, empty: true },
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
  };
}

// ─── Handlers ────────────────────────────────────────────────────────────────

export const handlers = [

  // ── AUTH ──────────────────────────────────────────────────────────────────

  http.post(`${BASE}/api/v1/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    const roleMap: Record<string, string> = {
      "super": "SUPER_ADMIN",
      "school": "SCHOOL_ADMIN",
      "psych": "PSYCHOLOGIST",
      "student": "STUDENT",
    };
    const role = Object.entries(roleMap).find(([k]) => body.username?.includes(k))?.[1] ?? "SCHOOL_ADMIN";
    return HttpResponse.json({ accessToken: "mock-token-" + role, refreshToken: "mock-refresh", username: body.username, role });
  }),

  http.post(`${BASE}/api/v1/auth/register-anonymous`, async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({ accessToken: "mock-token-STUDENT", refreshToken: "mock-refresh", username: "anon-" + body.inviteCode?.slice(0, 6), role: "STUDENT" });
  }),

  http.post(`${BASE}/api/v1/auth/refresh-token`, () => HttpResponse.json({})),
  http.post(`${BASE}/api/v1/auth/logout`, () => HttpResponse.json({})),

  // ── HEALTH ───────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/public/health`, () => HttpResponse.json({ status: "UP" })),

  // ── SUPER ADMIN ──────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/super-admin/tenants`, () => HttpResponse.json(tenants)),

  http.post(`${BASE}/api/v1/super-admin/tenants`, async ({ request }) => {
    const body = await request.json() as any;
    const newTenant = { id: tenants.length + 1, name: body.name, createdAt: new Date().toISOString() };
    tenants.push(newTenant);
    return HttpResponse.json(newTenant);
  }),

  http.post(`${BASE}/api/v1/super-admin/tenants/:tenantId/create-admin`, () => {
    const username = `admin-${Math.random().toString(36).slice(2, 8)}`;
    return HttpResponse.json({ username, password: Math.random().toString(36).slice(2, 10), role: "SCHOOL_ADMIN" });
  }),

  http.get(`${BASE}/api/v1/super-admin/stats`, () =>
    HttpResponse.json({ totalTenants: tenants.length, totalUsers: 12, totalStudents: students.length })
  ),

  // ── SCHOOL ADMIN ─────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/school-admin/dashboard/stats`, () =>
    HttpResponse.json({ totalStudents: students.length, totalTeachers: teachers.length, unusedCodesCount: 34, weeklyParticipationRate: 72 })
  ),

  http.get(`${BASE}/api/v1/school-admin/teachers`, () => HttpResponse.json(teachers)),

  http.get(`${BASE}/api/v1/school-admin/groups`, () => HttpResponse.json(groups)),

  http.post(`${BASE}/api/v1/school-admin/groups`, async ({ request }) => {
    const body = await request.json() as any;
    const curator = teachers.find(t => t.id === body.curatorId);
    const newGroup = { id: groups.length + 1, name: body.name, curatorName: curator?.username ?? "unknown" };
    groups.push(newGroup);
    return HttpResponse.json(newGroup);
  }),

  http.get(`${BASE}/api/v1/school-admin/groups/:groupId/details`, ({ params }) => {
    const group = groups.find(g => g.id === Number(params.groupId));
    return HttpResponse.json({
      groupId: Number(params.groupId),
      groupName: group?.name ?? "Группа",
      curatorName: group?.curatorName ?? "—",
      totalStudents: students.length,
      participationRate: 68,
      unusedCodesCount: 12,
      redRiskCount: 2,
      yellowRiskCount: 2,
      greenRiskCount: 3,
      students: students.map(s => ({ studentId: s.studentId, displayName: s.displayName, lastRiskLevel: s.riskLevel, lastScore: s.riskScore, lastCheckInAt: s.lastCheckInAt })),
    });
  }),

  http.get(`${BASE}/api/v1/school-admin/groups/:groupId/unused-codes`, () =>
    HttpResponse.json(Array.from({ length: 8 }, () => Math.random().toString(36).slice(2, 10).toUpperCase()))
  ),

  http.post(`${BASE}/api/v1/school-admin/staff`, async ({ request }) => {
    const body = await request.json() as any;
    const nameParts = body.fullName?.split(" ") ?? ["User"];
    const username = `${body.role?.toLowerCase()}-${nameParts[0]?.toLowerCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    if (body.role === "TEACHER") {
      teachers.push({ id: teachers.length + 10 + 1, username });
    }
    return HttpResponse.json({ username, password: Math.random().toString(36).slice(2, 10), role: body.role });
  }),

  http.post(`${BASE}/api/v1/school-admin/codes/generate`, async ({ request }) => {
    const body = await request.json() as any;
    const codes = Array.from({ length: body.amount ?? 10 }, () => Math.random().toString(36).slice(2, 10).toUpperCase());
    return HttpResponse.json(codes);
  }),

  http.get(`${BASE}/api/v1/school-admin/complaints`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    return HttpResponse.json(paginate(complaints, page, size));
  }),

  http.patch(`${BASE}/api/v1/school-admin/complaints/:complaintId/resolve`, async ({ request, params }) => {
    const body = await request.json() as any;
    const c = complaints.find(c => c.id === Number(params.complaintId));
    if (c) { c.status = body.status; c.resolutionComment = body.resolutionComment; c.resolvedAt = new Date().toISOString(); }
    return HttpResponse.json(null, { status: 200 });
  }),

  http.get(`${BASE}/api/v1/school-admin/analytics/participation`, () =>
    HttpResponse.json(groups.map((g, i) => ({
      groupId: g.id,
      groupName: g.name,
      totalStudents: 25 + i * 5,
      activeStudents: 18 + i * 3,
      participationPercentage: 72 + i * 4,
      unusedCodes: 7 - i,
    })))
  ),

  // ── PSYCHOLOGIST ─────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/psychologist/dashboard/stats`, () =>
    HttpResponse.json({ riskGroupCount: 2, totalStudents: students.length, riskPercentage: 28, activeToday: 5, hasBookingUrl: true })
  ),

  http.get(`${BASE}/api/v1/psychologist/students`, ({ request }) => {
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter")?.toLowerCase() ?? "";
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    const filtered = filter ? students.filter(s => s.displayName.toLowerCase().includes(filter)) : students;
    return HttpResponse.json(paginate(filtered, page, size));
  }),

  http.get(`${BASE}/api/v1/psychologist/students/:studentId`, ({ params }) => {
    const s = students.find(s => s.studentId === Number(params.studentId));
    return HttpResponse.json({ id: s?.studentId ?? Number(params.studentId), anonymousId: `ANON-${params.studentId}`, groupName: "10Б" });
  }),

  http.get(`${BASE}/api/v1/psychologist/students/:studentId/history`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    return HttpResponse.json(paginate(checkinHistory, page, size));
  }),

  http.get(`${BASE}/api/v1/psychologist/students/:studentId/cases`, () => HttpResponse.json(cases)),

  http.post(`${BASE}/api/v1/psychologist/students/:studentId/cases`, async ({ request }) => {
    const body = await request.json() as any;
    const newCase = { caseId: cases.length + 1, psychologistName: "Psych-main", message: body.message, communicationLink: body.communicationLink, status: "ACTIVE", createdAt: new Date().toISOString(), resolvedAt: null };
    cases.push(newCase);
    return HttpResponse.json(newCase);
  }),

  http.post(`${BASE}/api/v1/psychologist/cases/:caseId/resolve`, ({ params }) => {
    const c = cases.find(c => c.caseId === Number(params.caseId));
    if (c) { c.status = "RESOLVED"; c.resolvedAt = new Date().toISOString(); }
    return HttpResponse.json(null, { status: 200 });
  }),

  http.get(`${BASE}/api/v1/psychologist/complaints`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 20);
    return HttpResponse.json(paginate(complaints, page, size));
  }),

  http.patch(`${BASE}/api/v1/psychologist/complaints/:complaintId/resolve`, async ({ request, params }) => {
    const body = await request.json() as any;
    const c = complaints.find(c => c.id === Number(params.complaintId));
    if (c) { c.status = body.status; c.resolutionComment = body.resolutionComment; c.resolvedAt = new Date().toISOString(); }
    return HttpResponse.json(null, { status: 200 });
  }),

  http.patch(`${BASE}/api/v1/psychologist/profile/booking-url`, async ({ request }) => {
    const body = await request.json() as any;
    psychologists[0].bookingUrl = body.bookingUrl;
    return HttpResponse.json(null, { status: 200 });
  }),

  // ── STUDENT ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/student/messages`, () => HttpResponse.json(studentMessages)),

  http.get(`${BASE}/api/v1/student/psychologists`, () => HttpResponse.json(psychologists)),

  http.post(`${BASE}/api/v1/student/psychologists/:psychologistId/book-click`, () =>
    HttpResponse.json(null, { status: 200 })
  ),

  http.post(`${BASE}/api/v1/student/complaints`, () => HttpResponse.json(null, { status: 200 })),

  // ── CHECK-IN ─────────────────────────────────────────────────────────────

  http.get(`${BASE}/api/v1/checkins/active`, () =>
    HttpResponse.json({
      checkinId: "mock-checkin-001",
      status: "PENDING",
      deadline: new Date(Date.now() + 86400000).toISOString(),
      message: "Привет! Пожалуйста, пройди короткий опрос о своём самочувствии.",
      questions: [
        { id: "q1", text: "Как ты себя чувствуешь сегодня?", type: "scale", min: 1, max: 5, weight: 1, critical: false },
        { id: "q2", text: "Ты хорошо спал(а) последние ночи?", type: "yes_no", min: 0, max: 1, weight: 1.5, critical: false },
        { id: "q3", text: "Испытываешь ли тревогу или беспокойство?", type: "scale", min: 1, max: 5, weight: 2, critical: true },
        { id: "q4", text: "Ты чувствуешь поддержку со стороны одноклассников?", type: "yes_no", min: 0, max: 1, weight: 1, critical: false },
        { id: "q5", text: "Есть ли что-то, что тебя сильно беспокоит прямо сейчас?", type: "boolean", min: 0, max: 1, weight: 2.5, critical: true },
      ],
    })
  ),

  http.post(`${BASE}/api/v1/checkins`, async ({ request }) => {
    const body = await request.json() as any;
    const total = Object.values(body.answers as Record<string, number>).reduce((a, b) => a + b, 0);
    const riskLevel = total > 12 ? "HIGH" : total > 7 ? "MEDIUM" : "LOW";
    return HttpResponse.json({ status: "SUBMITTED", totalScore: total, riskLevel });
  }),
];