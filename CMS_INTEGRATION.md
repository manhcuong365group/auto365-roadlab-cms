# CMS Integration Contract — Case Lab V2.0

## Nguyên tắc

- Case Lab là content type trong CMS Auto365, không phải CMS thứ hai.
- CMS dùng chung account/RBAC, media/CDN, draft/revision, workflow, publisher, sitemap, cache, audit và rollback.
- `CaseRecord`/revision máy chủ là SSOT cho UI, preview, public HTML, metadata và JSON-LD.

## Write DTO của content

```ts
type CasePatch = {
  expectedRevision: number;
  customerNeed?: string;
  caseNote?: string;
  publishAfterApproval?: boolean;
};
```

Không nhận từ client: xe, sản phẩm, giá, branch, author, reviewer, source, URL, schema, gate, workflow hoặc technical approval.

## API và database

- OpenAPI: `openapi/case-lab-v2.yaml`.
- Interface adapter: `server/case-lab-contract.ts`.
- D1/SQLite reference: `db/schema.ts` và migration `drizzle/`.
- Kiến trúc/ownership: `docs/ARCHITECTURE.md`.
- Workflow/RBAC: `docs/RBAC_WORKFLOW.md`.

## Media

Server policy là 6 core + 2 optional; không tin `required=false` từ client. Bytes đi qua storage/media pipeline, không nhập URL tự do. Xem `docs/MEDIA_PIPELINE.md`.

## Publish

Publish cần `If-Match`, `Idempotency-Key`, server-side gates, atomic URL reservation và outbox. Preview luôn noindex; live chỉ index khi published revision khớp locked canonical. Xem `docs/SEO_AI_CONTRACT.md`.

## Nghiệm thu

Chạy `npm run qa`, hoàn thành test matrix và 15 bài pilot trong `docs/QA_UAT.md` trước khi bật cho content production.
