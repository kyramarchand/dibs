# Dibs!

Dibs! helps small business owners run limited-seat events (yoga classes,
café tastings, workshops) without overbooking. An owner creates an event
with a seat limit and shares a link. Guests reserve a spot with just a
name and email, and the server stops taking sign-ups once the event is full.

SOEN 287 Web Programming, Fall 2026, Course Project (Solo-Founder MVP)

## Team

- Kyra Marchand

## Tech stack

- **Front end:** HTML5, CSS, JavaScript
- **Back end:** Node.js with Express
- **Storage:** JSON files (no SQL database)
- **Authentication:** session-based login (express-session), passwords hashed with bcryptjs
- **Configuration:** secrets read from environment variables (dotenv)

## Features

Done so far (milestone):

- Public landing page and sample event page, responsive down to phone width
- User registration with server-side validation and hashed passwords
- Login with sessions, and logout
- Protected dashboard that only logged-in users can reach

Planned for the final version:

- Owners create, edit, and delete their own events
- Public RSVP with live seats-left counter
- Server-side seat limit and duplicate-email checks
- Owner guest list with search and filter
- Per-user data isolation, protection against cross-site scripting
- Deployment to a public URL
