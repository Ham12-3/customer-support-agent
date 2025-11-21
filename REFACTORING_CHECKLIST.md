# ✅ Backend Refactoring Checklist

## Quick Summary
- **Current Grade:** 6.5/10 ⚠️
- **Target Grade:** 9/10 ✨
- **Total Issues:** 18
- **Estimated Time:** 4 weeks (80-100 hours)

---

## 🚨 CRITICAL (Do First - This Week)

- [ ] **Issue #3: Replace Magic Strings with Enums**
  - [ ] Create UserRole enum
  - [ ] Create TenantStatus enum
  - [ ] Create SubscriptionPlan enum
  - [ ] Create ConversationStatus enum
  - [ ] Update all entities to use enums
  - [ ] Create migration to convert existing data

- [ ] **Issue #2: Implement Unit of Work Pattern**
  - [ ] Create IUnitOfWork interface
  - [ ] Implement UnitOfWork class
  - [ ] Remove SaveChanges from Repository methods
  - [ ] Update Program.cs to register UnitOfWork
  - [ ] Update services to use UnitOfWork

- [ ] **Issue #1: Create Service Layer**
  - [ ] Create IAuthService interface
  - [ ] Implement AuthService class
  - [ ] Move business logic from controller to service
  - [ ] Update AuthController to use AuthService
  - [ ] Add proper transaction handling

---

## 🔴 HIGH PRIORITY (Week 2)

- [ ] **Issue #7: Add FluentValidation**
  - [ ] Install FluentValidation.AspNetCore package
  - [ ] Create RegisterDtoValidator
  - [ ] Create LoginDtoValidator
  - [ ] Configure in Program.cs
  - [ ] Remove try-catch from controllers

- [ ] **Issue #5: Add AutoMapper**
  - [ ] Install AutoMapper packages
  - [ ] Create MappingProfile class
  - [ ] Configure in Program.cs
  - [ ] Replace manual mapping in services

- [ ] **Issue #8: Fix GetCurrentUser Authorization**
  - [ ] Add [Authorize] attribute
  - [ ] Create ClaimsPrincipalExtensions
  - [ ] Simplify user ID extraction

- [ ] **Issue #9: Optimize ExistsAsync**
  - [ ] Use AnyAsync instead of FindAsync
  - [ ] Update repository implementation

- [ ] **Issue #10: Implement Result Pattern**
  - [ ] Create Result<T> class
  - [ ] Update service methods to return Result
  - [ ] Update controllers to handle Result

---

## 🟡 MEDIUM PRIORITY (Week 3)

- [ ] **Issue #11: Fix TokenService**
  - [ ] Create JwtSettings class
  - [ ] Use Options pattern
  - [ ] Update TokenService constructor

- [ ] **Issue #12: Add Audit Fields**
  - [ ] Update BaseEntity with CreatedBy/UpdatedBy
  - [ ] Update SaveChangesAsync to track user
  - [ ] Create migration

- [ ] **Issue #13: Clean Domain Entities**
  - [ ] Remove DataAnnotations from entities
  - [ ] Move validation to FluentValidation
  - [ ] Move EF constraints to EntityTypeConfiguration

- [ ] **Issue #14: Add Rate Limiting**
  - [ ] Install AspNetCoreRateLimit package
  - [ ] Configure rate limits in appsettings.json
  - [ ] Add middleware to Program.cs

- [ ] **Issue #15: Improve Password Validation**
  - [ ] Create IPasswordValidator interface
  - [ ] Implement PasswordValidator
  - [ ] Add to RegisterDtoValidator

---

## 🟢 LOW PRIORITY (Week 4)

- [ ] **Issue #16: Improve Logging**
  - [ ] Add correlation ID enrichment
  - [ ] Use JsonFormatter
  - [ ] Add correlation ID middleware

- [ ] **Issue #17: Better Health Checks**
  - [ ] Install health check packages
  - [ ] Add database health check
  - [ ] Add Redis health check
  - [ ] Create custom health check response

- [ ] **Issue #18: Add Global Exception Handler**
  - [ ] Create GlobalExceptionMiddleware
  - [ ] Handle ValidationException
  - [ ] Handle UnauthorizedAccessException
  - [ ] Handle generic exceptions
  - [ ] Register middleware

---

## 📊 Progress Tracker

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| Critical | 3 | 0 | 0% |
| High | 5 | 0 | 0% |
| Medium | 5 | 0 | 0% |
| Low | 3 | 0 | 0% |
| **TOTAL** | **16** | **0** | **0%** |

---

## 🎯 This Week's Goals

**Target:** Complete all CRITICAL issues

1. Monday-Tuesday: Magic strings → Enums
2. Wednesday-Thursday: Unit of Work implementation
3. Friday: Service layer creation

**Deliverables:**
- All enums created and tested
- Unit of Work working with transactions
- AuthService implemented
- No business logic in controllers

---

## 📝 Notes

- Each issue has detailed implementation in CODE_REVIEW.md
- Test after each change
- Create feature branches for each issue
- Update documentation as you go

---

**Start with Issue #3 (Magic Strings) - it's the easiest and has biggest impact!** 🚀

