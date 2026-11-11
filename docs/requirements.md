# CineVerse — Product Requirements

## 1. Product Overview

CineVerse is a movie discovery and review platform.
Users can explore movies, view movie information, and
share their opinions through reviews.


## 2. User Roles

### Guest

- Browse movies.
- Search and filter movies.
- View movie details.
- Read reviews.

### Registered User

- Register and log in.
- Log out.
- Manage their account.
- Create reviews.
- Update and delete their own reviews.

### Administrator

- Manage movies.
- Manage genres.
- Manage users.
- Manage and moderate reviews.

## 3. Core System Modules

- Authentication and authorization
- User management
- Movie management
- Genre management
- Review management
- Administration


## 4. Non-Functional Requirements

- Passwords must be securely hashed.
- Protected operations must require authentication.
- Administrative operations must require administrator permission.
- User input must be validated.
- Errors must be handled consistently.
- Movie listings must support pagination.
- APIs must be tested.

## 5. Out of Scope for Version 1

- Video streaming
- Payments and subscriptions
- AI recommendations
- Social networking

## 6. Initial Data Entities

- User
- Movie
- Genre
- Review
