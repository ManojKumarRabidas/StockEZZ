# Architecture — Multi-Tenant Inventory Management System

## Goals
- Safely isolate tenant data while enabling rapid development and low operational cost.
- Record every stock movement with timestamps.
- Ensure data integrity under concurrent operations (orders/purchase receipts).
- Keep queries fast for dashboards at scale (10,000+ products per tenant).

## Tenant isolation approach (chosen)
**Shared single MongoDB (one logical database) with row-level tenancy using `companyId` on all relevant collections.**
- All collections include `companyId`.
- Compound indexes include `companyId` as the leading key where appropriate.

### Why this choice
- Fast to implement and easiest to seed and demo.
- Cost-effective for SaaS MVP (single DB instance).
- Simplest developer experience (single connection string; one code path).
- Easier to query cross-tenant data for admin/debugging.

### Trade-offs / Alternatives
- **Separate DB per tenant**
  - Pros: strongest data isolation, per-tenant backups, easier tenant limits.
  - Cons: operational complexity, provisioning complexity, higher cost; harder to run local demo with many DBs.
- **Shared DB, separate collections per tenant (schema-based)**
  - Pros: some isolation, per-tenant collections.
  - Cons: collection explosion; harder to maintain indexes at scale.
- **Row-level (chosen)**
  - Pros: simplest, low friction for seeding and deployment.
  - Cons: "noisy neighbor" risk, harder to apply per-tenant backups & migrations. Mitigation: use logical partitioning and prefix indexes, and consider moving large tenants to separate DB later.

