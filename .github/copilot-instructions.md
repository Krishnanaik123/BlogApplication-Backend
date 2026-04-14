---
name: Blog Project Assistant
description: Use when working on the Blog API backend - guides conventions, architecture patterns, security practices, and common pitfalls in the Express/MySQL blog project.
---

# Blog API Project Instructions

## Quick Facts
- **Type**: Node.js/Express REST API for blogging platform
- **Database**: MySQL with connection pooling (mysql2)
- **Architecture**: MVC pattern with Controllers → Services → Repositories
- **Key Libraries**: Express, JWT (jsonwebtoken), Bcrypt, Multer (uploads), Helmet (security), Validator
- **Authentication**: JWT-based
- **Entry Points**: `server.js` (starts on port 5000) → `app.js` (routes & middleware) → `src/`

## Directory Structure & Responsibilities

```
Backend/
├── app.js              # Express setup, middleware, route registration
├── server.js           # Server startup (load .env, listen on PORT)
├── package.json        # Dependencies & scripts
├── src/
│   ├── Config/         # Database connection (db.js)
│   ├── Controllers/    # Request handlers (validateInput, call services)
│   ├── Services/       # Business logic (validate, transform, orchestrate)
│   ├── Models/         # Data layer (database queries only)
│   ├── Routes/         # Endpoint definitions (method, path, controller)
│   └── middlewares/    # Upload, auth, error handling (e.g., upload.middleware.js)
```

## Architecture Patterns

### Data Flow
Request → Route → Controller → Service → Repository → Database

### Controllers (Decision Layer)
- **Role**: Validate request structure, parse query/body params, call services, return responses
- **Pattern**: 
  ```javascript
  const myAction = async (req, res) => {
    try {
      const { required_field } = req.body;
      if (!required_field) {
        return res.status(400).json({ success: false, message: "..." });
      }
      const result = await MyService.doSomething(required_field);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  ```
- **Response Format**: Always `{ success: boolean, message: string, data?: any, error?: any }`
- **Status Codes**: 200 (success), 201 (created), 400 (bad input), 404 (not found), 500 (server error)

### Services (Business Logic)
- **Role**: Core business rules, validation, transformation, orchestration
- **No database calls**: Routes to repositories only
- **No HTTP knowledge**: Returns plain data, not res.json()
- **Example**:
  ```javascript
  const createPost = async ({ title, content, category_id, AuthorId, imageUrl }) => {
    const post = await postRepo.createPost({ title, content, category_id, AuthorId, ImageUrl: imageUrl || null });
    return post;
  };
  ```

### Repositories/Models (Data Access)
- **Role**: Execute SQL queries, return raw data
- **No business logic**: Just CRUD operations
- **Use parameterized queries**: `db.execute(query, [params])` to prevent SQL injection
- **Pagination in queries**: Use LIMIT/OFFSET; return `{ data, pagination: { total, page, limit, totalPages } }`

### Routes
- **Pattern**: `router.method('/path', middleware, controller);`
- **File Structure**: One feature = one route file (postRoutes.js, categoryRoutes.js, updatePostRoutes.js)
- **Registered in app.js**: `app.use('/api/endpoint', routeFile);`

### Middleware
- **Upload**: Use `multer` with disk storage in `src/middlewares/upload.middleware.js`
- **Auth**: Verify JWT (if needed for protected routes)
- **Security**: Helmet (already in app.js) handles headers

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| File Names | camelCase | `postController.js`, `postService.js`, `postRepo.js` |
| Function Names | camelCase | `createPost()`, `getPosts()`, `updatePost()` |
| Database Columns | PascalCase in code (from DB) | `PostId`, `Title`, `CreatedAt` |
| API Routes | kebab-case (optional) | `/api/blog-posts` |
| Variable Names | camelCase | `const userId = req.body.UserId;` |
| Classes | PascalCase | Not currently used; consider for future refactors |

### Parameter Naming: Watch Case Consistency
- Example issue in current code: `ImageUrl` (DB) vs `imageUrl` (param) — normalize to one convention or translate explicitly
- **Best practice**: Service parameter in camelCase (`imageUrl`), translate to database column name in repository layer

## Common API Response Pattern

All endpoints should follow this structure:

```javascript
// Success
{ success: true, message: "...", data: {...} }

// Error
{ success: false, message: "...", error: "..." }
```

Don't mix property names like `error` and `errors`; be consistent across all endpoints.

## Security Best Practices

1. **SQL Injection Prevention**: Always use parameterized queries
   - ✅ Correct: `db.execute('SELECT * FROM posts WHERE PostId = ?', [id])`
   - ❌ Avoid: `'SELECT * FROM posts WHERE PostId = ' + id` (current in some files)

2. **Password Hashing**: Use `bcryptjs` for passwords (already in package.json)
   - Hash on creation: `bcryptjs.hash(password, 10)`
   - Compare on login: `bcryptjs.compare(plaintext, hashedPassword)`

3. **JWT Tokens**: Issued on login, verified on protected routes
   - Token in Authorization header: `Bearer <token>`
   - Extract middleware: `const token = req.headers.authorization?.split(' ')[1];`

4. **Environment Variables**: All secrets in `.env` (never in code)
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`
   - Load with `dotenv.config()` in server.js or app.js

5. **File Uploads**: Validate file types and store outside webroot
   - Current: `multer` with `/uploads` static folder (OK for dev, secure for production)
   - Check MIME types, limit file size

## Testing & Running

```bash
# Install dependencies
npm install

# Start server (watch mode not configured yet)
npm start        # Won't work until script is added
node Backend/server.js    # Direct approach

# Tests (not yet configured)
npm test         # Currently outputs error; set up proper test suite
```

**Next Steps for Testing**: Consider `jest` or `mocha` with a test script in package.json

## Known Issues & Technical Debt

1. **SQL Injection Risk**: Some queries use string concatenation instead of parameterized queries
   - Example: `'SELECT * FROM posts WHERE IsDeleted = 0 ORDER BY CreatedAt DESC LIMIT ' + limitNum + ' OFFSET ' + offset`
   - Fix: Use `LIMIT ? OFFSET ?` with parameters

2. **Incomplete File Structure**: `updateController`, `updateRepo` appear as folders
   - Clarify: Should these be `.js` files or actual directories with index.js?

3. **Case Inconsistency**: `ImageUrl` (DB) vs `imageUrl` (params)
   - Establish convention: All params camelCase, translate in repo layer

4. **No Test Suite**: package.json test script is placeholder
   - Recommendation: Add `jest` or `mocha` for unit/integration tests

5. **No Error Handling Middleware**: Each controller has try-catch; consider centralized error handler
   - Create `src/middlewares/errorHandler.js` to reduce duplication

## When to Use Each Layer

| Question | Layer |
|----------|-------|
| Need to access database? | **Repository** (Models/) |
| Need to apply business rules/validation? | **Service** |
| Need to parse HTTP request? | **Controller** |
| Need to define a URL endpoint? | **Routes** |
| Need to process files or auth? | **Middleware** |

## Example Workflow: Adding a New Feature

1. **Create Repository**: `src/Models/newFeatureRepo.js` with CRUD methods
2. **Create Service**: `src/Services/newFeatureService.js` calling repository
3. **Create Controller**: `src/Controllers/newFeatureController.js` handling HTTP
4. **Create Routes**: `src/Routes/newFeatureRoutes.js` mapping endpoints
5. **Register Routes**: Add `app.use('/api/newfeature', newRoutes)` in app.js
6. **Test**: Manual API calls or automated tests

## Code Review Checklist

Before committing:
- [ ] All database queries use parameterized values (no string concatenation)
- [ ] Status codes and response format match conventions
- [ ] Case consistency (camelCase params, PascalCase DB columns)
- [ ] Error messages are user-friendly and logged
- [ ] Secrets are in `.env`, not hardcoded
- [ ] No validation logic in controllers (should be in services)
- [ ] File uploads validated and stored securely

## Useful Commands

```bash
# Check Node version
node --version

# Install all dependencies
npm install

# Install a new package
npm install package-name

# Start server directly
node Backend/server.js

# Environment setup
# Create .env file with: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT, JWT_SECRET
```

## References & Next Steps

- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Connection Pooling](https://github.com/sidorares/node-mysql2#using-connection-pools)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [owasp.org/www-community/attacks/SQL_Injection](https://owasp.org/www-community/attacks/SQL_Injection) (prevent!)

