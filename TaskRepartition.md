# MVP Features - Task Breakdown for Team Division

## BACKEND - Person 1: User Authentication & Setup

**User Model Creation**
Define schema with email, password, name fields. Add password hashing before save. Create methods for password comparison and token generation. Set email as unique index.

**User Registration Endpoint**
POST /api/auth/register - Accept email, password, name. Validate input (email format, password strength). Hash password, save user to database. Return user data and JWT token. Handle duplicate email error.

**User Login Endpoint**
POST /api/auth/login - Accept email and password. Find user by email. Compare provided password with hashed password. Generate JWT token. Return token and user data. Handle wrong credentials error.

**JWT Authentication Middleware**
Create middleware to verify JWT tokens from request headers. Extract user_id from token. Attach user to request object. Return 401 if token missing or invalid. Protect all routes requiring authentication.

**Authorization Middleware**
Create middleware to check if user owns the resource (event or registration). Compare user_id from JWT with owner_id in document. Return 403 if unauthorized. Use for update/delete endpoints.

---

## BACKEND - Person 2: Events & Registrations

**Event Model Creation**
Define schema with title, description, date, location, organizer_id. Define ticketTypes array with type, price, capacity, available fields. Add registration count field. Create validation for future dates and capacity checks.

**Event CRUD Endpoints - Part 1**
POST /api/events - Create event. GET /api/events - List all published events. GET /api/events/:id - Get single event details with all ticket types. Validate organizer_id from JWT matches creator.

**Event CRUD Endpoints - Part 2**
PUT /api/events/:id - Update event details and ticket types. Verify user is organizer. Validate new date is future. Prevent reducing capacity below current registrations. DELETE /api/events/:id - Mark event as cancelled or delete. Verify user is organizer.

**Registration Model Creation**
Define schema with user_id, event_id, ticketTypeId, quantity, status. Add unique index on (user_id, event_id) to prevent duplicates. Create validation for ticket availability.

**Registration Endpoints - Part 1**
POST /api/events/:id/register - Register user for event. Check ticket capacity. Check for duplicate registration. Create registration. Decrease available count for ticket type. Increase registration count for event. Return confirmation.

**Registration Endpoints - Part 2**
GET /api/my-registrations - List user's registrations with event details. GET /api/events/:id/registrations - List registrations for event (only organizer). DELETE /api/registrations/:id - Cancel registration. Restore available ticket count. Update registration count.

---

## FRONTEND - Person 1: Authentication & Navigation

**Login Form Component**
Create form with email and password fields. Add input validation feedback. Handle login submission. Store JWT token in localStorage. Redirect to appropriate dashboard on success. Display error messages for failed login.

**Register Form Component**
Create form with email, password, confirm password, name fields. Validate email format and password strength. Handle registration submission. Auto-login after successful registration. Store JWT token. Redirect to dashboard.

**Authentication Service/Context**
Create service to manage JWT token (save, retrieve, clear). Create context or state to track logged-in user. Provide function to logout and clear token. Handle token expiration.

**Protected Routes**
Create route guard/wrapper that checks if user is authenticated. Redirect to login if no token. Redirect to dashboard if trying to access login while logged in. Apply to all protected pages.

**Navigation/Layout Component**
Create header/navbar with navigation links. Show different links based on authentication status. Add logout button. Include user name or profile indicator. Responsive on mobile and desktop.

---

## FRONTEND - Person 2: Events & Registrations UI

**Event Creation Form**
Create form for event details (title, description, date, location). Add dynamic ticket type form (add/remove types with price and capacity). Validate all inputs. Handle submit to backend. Show success/error messages. Draft/Publish toggle.

**Event List Page**
Display all published events in grid or list format. Show event title, date, location, available tickets. Add search bar to filter by title. Add date range filter. Make cards clickable to view details. Show loading state while fetching.

**Event Details Page**
Display full event information. Show all ticket types with prices and availability. Display organizer name. Add registration form (ticket type selection, quantity input). Show register button. If user is organizer, show edit/delete buttons.

**Organizer Dashboard**
List all events created by user. Show registration count per event. Show event status (draft/published/cancelled). Quick action buttons (create new, view registrations, edit, delete). Show loading state and empty state messaging.

**Participant Dashboard**
List all registered events for user. Show which ticket type and quantity for each. Display event dates and locations. Show cancel registration button. Link to event details page. Show no registrations message if empty.

**My Registrations List**
Dedicated page/section showing user's registrations. Display event details for each registration. Show ticket type and quantity. Add cancel button with confirmation dialog. Show registration date. Link to event details.

**Registration Confirmation**
After successful registration, show confirmation message with registration details. Display ticket type, quantity, and event information. Option to download or view registration. Button to return to event list or go to my registrations.
