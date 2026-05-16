# StudentHousingTM — API Reference
> Base URL: `http://localhost:5000/api`  (change port to match your launchSettings.json)

---

## Users `/api/users`
| Method | Route | Body / Params | Returns |
|--------|-------|--------------|---------|
| GET | `/api/users` | — | `UserBLL[]` |
| GET | `/api/users/{id}` | — | `UserBLL` |
| GET | `/api/users/by-email?email=` | query param | `UserBLL` |
| POST | `/api/users` | `{ fullName, email, passwordHash, phoneNumber?, nationalityID, genderID, role, profilePhoto? }` | `{ userID }` 201 |
| PUT | `/api/users/{id}` | `{ fullName, phoneNumber?, nationalityID, genderID, profilePhoto? }` | 204 |
| PUT | `/api/users/{id}/deactivate` | — | 204 |
| PUT | `/api/users/{id}/password` | `{ newPasswordHash }` | 204 |

---

## Student Profiles `/api/student-profiles`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/student-profiles/{id}` | — | `StudentProfileBLL` |
| GET | `/api/student-profiles/by-user/{userID}` | — | `StudentProfileBLL` |
| POST | `/api/student-profiles` | `{ userID, university, fieldOfStudy, yearOfStudyID, isSmoker, hasPets }` | `{ studentProfileID }` 201 |
| PUT | `/api/student-profiles/{id}` | `{ university, fieldOfStudy, yearOfStudyID, isSmoker, hasPets }` | 204 |

---

## Owner Profiles `/api/owner-profiles`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/owner-profiles/{id}` | — | `OwnerProfileBLL` |
| GET | `/api/owner-profiles/by-user/{userID}` | — | `OwnerProfileBLL` |
| POST | `/api/owner-profiles` | `{ userID, numberOfProperties, requiresInsurance, acceptsInternational, preferredTenantGenderID }` | `{ ownerProfileID }` 201 |
| PUT | `/api/owner-profiles/{id}` | `{ requiresInsurance, acceptsInternational, preferredTenantGenderID }` | 204 |

---

## Properties `/api/properties`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/properties` | — | `PropertyBLL[]` |
| GET | `/api/properties/{id}` | — | `PropertyBLL` |
| GET | `/api/properties/by-owner/{ownerProfileID}` | — | `PropertyBLL[]` |
| POST | `/api/properties` | `{ ownerProfileID, title, propertyTypeID, address, areaZone, pricePerMonth, utilitiesIncluded, furnished, insuranceRequired, maxTenants, availableFrom, availableUntil?, preferredGenderID, acceptsInternational, smokersAllowed, petsAllowed, description? }` | `{ propertyID }` 201 |
| PUT | `/api/properties/{id}` | same as create + `statusID` | 204 |
| DELETE | `/api/properties/{id}` | — | 204 |

---

## Student Requests `/api/student-requests`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/student-requests/by-student/{studentProfileID}` | — | `StudentRequestBLL[]` |
| GET | `/api/student-requests/{id}` | — | `StudentRequestBLL` |
| POST | `/api/student-requests` | `{ studentProfileID, title, budgetMin, budgetMax, moveInDate, moveOutDate?, propertyTypePreferredID, furnishedRequired?, utilitiesRequired, petsAllowed, smokersAllowed, additionalNotes? }` | `{ requestID }` 201 |
| PUT | `/api/student-requests/{id}` | same as create + `statusID` | 204 |
| DELETE | `/api/student-requests/{id}` | — | 204 |

---

## Matches `/api/matches`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/matches/by-student/{studentProfileID}` | — | `MatchBLL[]` |
| GET | `/api/matches/by-owner/{ownerProfileID}` | — | `MatchBLL[]` |
| GET | `/api/matches/{id}` | — | `MatchBLL` |
| POST | `/api/matches` | `{ studentRequestID, propertyID, matchScore, matchType }` | `{ matchID }` 201 |
| PUT | `/api/matches/{id}/student-interest` | `{ interested: bool }` | 204 |
| PUT | `/api/matches/{id}/owner-interest` | `{ interested: bool }` | 204 |
| PUT | `/api/matches/{id}/reject` | `{ rejectedBy: "Student"\|"Owner" }` | 204 |
| PUT | `/api/matches/{id}/confirm` | — | 204 |

---

## Conversations `/api/conversations`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/conversations/by-user/{userID}` | — | `ConversationBLL[]` |
| GET | `/api/conversations/{id}` | — | `ConversationBLL` |
| GET | `/api/conversations/by-match/{matchID}` | — | `ConversationBLL` |
| POST | `/api/conversations` | `{ matchID, studentProfileID, ownerProfileID }` | `{ conversationID }` 201 |
| PUT | `/api/conversations/{id}/deactivate` | — | 204 |

---

## Messages `/api/messages`
| Method | Route | Body / Params | Returns |
|--------|-------|--------------|---------|
| GET | `/api/messages/by-conversation/{conversationID}` | — | `MessageBLL[]` |
| GET | `/api/messages/unread-count?conversationID=&userID=` | query params | `{ unreadCount }` |
| POST | `/api/messages` | `{ conversationID, senderID, messageText }` | `{ messageID }` 201 |
| PUT | `/api/messages/mark-read` | `{ conversationID, userID }` | `{ markedRead }` |

---

## Visit Requests `/api/visit-requests`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/visit-requests/by-conversation/{conversationID}` | — | `VisitRequestBLL[]` |
| GET | `/api/visit-requests/{id}` | — | `VisitRequestBLL` |
| POST | `/api/visit-requests` | `{ conversationID, studentProfileID, propertyID, studentNote? }` | `{ visitRequestID }` 201 |
| PUT | `/api/visit-requests/{id}/status` | `{ statusID }` | 204 |
| POST | `/api/visit-requests/{id}/proposed-dates` | `{ proposedDate }` | 201 |

---

## Appointments `/api/appointments`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/appointments/by-student/{studentProfileID}` | — | `AppointmentBLL[]` |
| GET | `/api/appointments/by-owner/{ownerProfileID}` | — | `AppointmentBLL[]` |
| GET | `/api/appointments/{id}` | — | `AppointmentBLL` |
| POST | `/api/appointments` | `{ visitRequestID, conversationID, studentProfileID, ownerProfileID, propertyID, confirmedDate, confirmedTime? }` | `{ appointmentID }` 201 |
| PUT | `/api/appointments/{id}/status` | `{ statusID }` | 204 |

> `confirmedTime` format: `"HH:mm:ss"` e.g. `"14:30:00"`

---

## Notifications `/api/notifications`
| Method | Route | Body | Returns |
|--------|-------|------|---------|
| GET | `/api/notifications/by-user/{userID}` | — | `NotificationBLL[]` |
| GET | `/api/notifications/unread-count/{userID}` | — | `{ unreadCount }` |
| POST | `/api/notifications` | `{ userID, notificationTypeID, referenceTypeID, message }` | `{ notificationID }` 201 |
| PUT | `/api/notifications/{id}/read` | — | 204 |
| PUT | `/api/notifications/mark-all-read/{userID}` | — | `{ markedRead }` |

---

## Lookup tables (hardcoded values to know)

| Table | ID → Value |
|-------|-----------|
| Genders | 1=Male, 2=Female, 3=No preference |
| PropertyTypes | 1=Room, 2=Apartment, 3=House |
| PropertyStatuses | 1=Active, 2=Rented, 3=Inactive |
| MatchStatuses | 1=Pending, 2=StudentConfirmed, 3=Mutual, 4=Rejected |
| VisitStatuses | 1=Pending, 2=Accepted, 3=Declined, 4=Cancelled |
| AppointmentStatuses | 1=Scheduled, 2=Completed, 3=Cancelled |
| StudyYears | 1–7 (Year 1 → Year 7 / PhD) |

---

## Next.js fetch example

```js
// Send a message
const res = await fetch('http://localhost:5000/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversationID: 1,
    senderID: 3,
    messageText: 'Hello, is the room still available?'
  })
});
const data = await res.json(); // { messageID: 7 }
```
