super-admin-controller


GET
/api/v1/super-admin/tenants

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "name": "string",
    "createdAt": "2026-03-11T16:05:45.709Z"
  }
]
No links

POST
/api/v1/super-admin/tenants

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "name": "string",
  "createdAt": "2026-03-11T16:05:45.712Z"
}
No links

POST
/api/v1/super-admin/tenants/{tenantId}/create-admin

Parameters
Try it out
Name	Description
tenantId *
integer($int64)
(path)
tenantId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "username": "string",
  "password": "string",
  "role": "string"
}
No links

GET
/api/v1/super-admin/stats

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "totalTenants": 0,
  "totalUsers": 0,
  "totalStudents": 0
}
No links
student-controller


POST
/api/v1/student/psychologists/{psychologistId}/book-click

Parameters
Try it out
Name	Description
psychologistId *
integer($int64)
(path)
psychologistId
Responses
Code	Description	Links
200	
OK

No links

POST
/api/v1/student/complaints

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "category": "BULLYING",
  "text": "string"
}
Responses
Code	Description	Links
200	
OK

No links

GET
/api/v1/student/psychologists

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "psychologistId": 0,
    "name": "string",
    "bookingUrl": "string"
  }
]
No links

GET
/api/v1/student/messages

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "caseId": 0,
    "psychologistName": "string",
    "message": "string",
    "communicationLink": "string",
    "status": "string",
    "createdAt": "2026-03-11T16:05:45.723Z",
    "resolvedAt": "2026-03-11T16:05:45.723Z"
  }
]
No links
school-admin-controller


POST
/api/v1/school-admin/staff

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "fullName": "string",
  "role": "STUDENT"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "username": "string",
  "password": "string",
  "role": "string"
}
No links

GET
/api/v1/school-admin/groups

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "name": "string",
    "curatorName": "string"
  }
]
No links

POST
/api/v1/school-admin/groups

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": "string",
  "curatorId": 0
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "name": "string",
  "curatorName": "string"
}
No links

POST
/api/v1/school-admin/codes/generate

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "amount": 100,
  "groupId": 0
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  "string"
]
No links

PATCH
/api/v1/school-admin/complaints/{complaintId}/resolve

Parameters
Try it out
Name	Description
complaintId *
integer($int64)
(path)
complaintId
Request body

application/json
Example Value
Schema
{
  "status": "NEW",
  "resolutionComment": "string"
}
Responses
Code	Description	Links
200	
OK

No links

GET
/api/v1/school-admin/teachers

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "id": 0,
    "username": "string"
  }
]
No links

GET
/api/v1/school-admin/groups/{groupId}/unused-codes

Parameters
Try it out
Name	Description
groupId *
integer($int64)
(path)
groupId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  "string"
]
No links

GET
/api/v1/school-admin/groups/{groupId}/details

Parameters
Try it out
Name	Description
groupId *
integer($int64)
(path)
groupId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "groupId": 0,
  "groupName": "string",
  "curatorName": "string",
  "totalStudents": 0,
  "participationRate": 0,
  "unusedCodesCount": 0,
  "redRiskCount": 0,
  "yellowRiskCount": 0,
  "greenRiskCount": 0,
  "students": [
    {
      "studentId": 0,
      "displayName": "string",
      "lastRiskLevel": "string",
      "lastScore": 0,
      "lastCheckInAt": "2026-03-11T16:05:45.744Z"
    }
  ]
}
No links

GET
/api/v1/school-admin/dashboard/stats

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "totalStudents": 0,
  "totalTeachers": 0,
  "unusedCodesCount": 0,
  "weeklyParticipationRate": 0
}
No links

GET
/api/v1/school-admin/complaints

Parameters
Try it out
Name	Description
pageable *
object
(query)
{
  "page": 0,
  "size": 1,
  "sort": [
    "string"
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "totalPages": 0,
  "totalElements": 0,
  "pageable": {
    "pageNumber": 0,
    "paged": true,
    "pageSize": 0,
    "unpaged": true,
    "offset": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    }
  },
  "numberOfElements": 0,
  "size": 0,
  "content": [
    {
      "createdAt": "2026-03-11T16:05:45.749Z",
      "updatedAt": "2026-03-11T16:05:45.749Z",
      "id": 0,
      "tenantId": 0,
      "category": "BULLYING",
      "status": "NEW",
      "text": "string",
      "resolutionComment": "string",
      "resolvedAt": "2026-03-11T16:05:45.749Z"
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": true,
    "empty": true
  },
  "first": true,
  "last": true,
  "empty": true
}
No links

GET
/api/v1/school-admin/analytics/participation

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "groupId": 0,
    "groupName": "string",
    "totalStudents": 0,
    "activeStudents": 0,
    "participationPercentage": 0,
    "unusedCodes": 0
  }
]
No links
psychologist-controller


GET
/api/v1/psychologist/students/{studentId}/cases

Parameters
Try it out
Name	Description
studentId *
integer($int64)
(path)
studentId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
[
  {
    "caseId": 0,
    "psychologistName": "string",
    "message": "string",
    "communicationLink": "string",
    "status": "string",
    "createdAt": "2026-03-11T16:05:45.754Z",
    "resolvedAt": "2026-03-11T16:05:45.754Z"
  }
]
No links

POST
/api/v1/psychologist/students/{studentId}/cases

Parameters
Try it out
Name	Description
studentId *
integer($int64)
(path)
studentId
Request body

application/json
Example Value
Schema
{
  "message": "string",
  "communicationLink": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "caseId": 0,
  "psychologistName": "string",
  "message": "string",
  "communicationLink": "string",
  "status": "string",
  "createdAt": "2026-03-11T16:05:45.757Z",
  "resolvedAt": "2026-03-11T16:05:45.757Z"
}
No links

POST
/api/v1/psychologist/cases/{caseId}/resolve

Parameters
Try it out
Name	Description
caseId *
integer($int64)
(path)
caseId
Responses
Code	Description	Links
200	
OK

No links

PATCH
/api/v1/psychologist/profile/booking-url

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "bookingUrl": "string"
}
Responses
Code	Description	Links
200	
OK

No links

PATCH
/api/v1/psychologist/complaints/{complaintId}/resolve

Parameters
Try it out
Name	Description
complaintId *
integer($int64)
(path)
complaintId
Request body

application/json
Example Value
Schema
{
  "status": "NEW",
  "resolutionComment": "string"
}
Responses
Code	Description	Links
200	
OK

No links

GET
/api/v1/psychologist/students

Parameters
Try it out
Name	Description
filter
string
(query)
filter
pageable *
object
(query)
{
  "page": 0,
  "size": 1,
  "sort": [
    "string"
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "totalPages": 0,
  "totalElements": 0,
  "pageable": {
    "pageNumber": 0,
    "paged": true,
    "pageSize": 0,
    "unpaged": true,
    "offset": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    }
  },
  "numberOfElements": 0,
  "size": 0,
  "content": [
    {
      "studentId": 0,
      "displayName": "string",
      "riskLevel": "string",
      "riskScore": 0,
      "lastCheckInAt": "2026-03-11T16:05:45.764Z",
      "hasSos": true
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": true,
    "empty": true
  },
  "first": true,
  "last": true,
  "empty": true
}
No links

GET
/api/v1/psychologist/students/{studentId}

Parameters
Try it out
Name	Description
studentId *
integer($int64)
(path)
studentId
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "anonymousId": "string",
  "groupName": "string"
}
No links

GET
/api/v1/psychologist/students/{studentId}/history

Parameters
Try it out
Name	Description
studentId *
integer($int64)
(path)
studentId
pageable *
object
(query)
{
  "page": 0,
  "size": 1,
  "sort": [
    "string"
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "totalPages": 0,
  "totalElements": 0,
  "pageable": {
    "pageNumber": 0,
    "paged": true,
    "pageSize": 0,
    "unpaged": true,
    "offset": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    }
  },
  "numberOfElements": 0,
  "size": 0,
  "content": [
    {
      "checkInId": 0,
      "date": "2026-03-11T16:05:45.769Z",
      "score": 0,
      "riskLevel": "string",
      "answersJson": "string"
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": true,
    "empty": true
  },
  "first": true,
  "last": true,
  "empty": true
}
No links

GET
/api/v1/psychologist/dashboard/stats

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "riskGroupCount": 0,
  "totalStudents": 0,
  "riskPercentage": 0,
  "activeToday": 0,
  "hasBookingUrl": true
}
No links

GET
/api/v1/psychologist/complaints

Parameters
Try it out
Name	Description
pageable *
object
(query)
{
  "page": 0,
  "size": 1,
  "sort": [
    "string"
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "totalPages": 0,
  "totalElements": 0,
  "pageable": {
    "pageNumber": 0,
    "paged": true,
    "pageSize": 0,
    "unpaged": true,
    "offset": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    }
  },
  "numberOfElements": 0,
  "size": 0,
  "content": [
    {
      "createdAt": "2026-03-11T16:05:45.775Z",
      "updatedAt": "2026-03-11T16:05:45.775Z",
      "id": 0,
      "tenantId": 0,
      "category": "BULLYING",
      "status": "NEW",
      "text": "string",
      "resolutionComment": "string",
      "resolvedAt": "2026-03-11T16:05:45.775Z"
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": true,
    "empty": true
  },
  "first": true,
  "last": true,
  "empty": true
}
No links
check-in-controller


POST
/api/v1/checkins

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "checkinId": "string",
  "answers": {
    "additionalProp1": 0,
    "additionalProp2": 0,
    "additionalProp3": 0
  }
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "status": "string",
  "totalScore": 0,
  "riskLevel": "LOW"
}
No links

GET
/api/v1/checkins/active

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "checkinId": "string",
  "status": "PENDING",
  "deadline": "2026-03-11T16:05:45.780Z",
  "message": "string",
  "questions": [
    {
      "id": "string",
      "text": "string",
      "type": "string",
      "min": 0,
      "max": 0,
      "weight": 0,
      "critical": true
    }
  ]
}
No links
auth-controller


POST
/api/v1/auth/register-anonymous

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "inviteCode": "string",
  "password": "stringst"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "accessToken": "string",
  "refreshToken": "string",
  "username": "string",
  "role": "STUDENT"
}
No links

POST
/api/v1/auth/refresh-token

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{}
No links

POST
/api/v1/auth/logout

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{}
No links

POST
/api/v1/auth/login

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "username": "string",
  "password": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "accessToken": "string",
  "refreshToken": "string",
  "username": "string",
  "role": "STUDENT"
}
No links
health-controller


GET
/api/v1/public/health

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "additionalProp1": {},
  "additionalProp2": {},
  "additionalProp3": {}
}