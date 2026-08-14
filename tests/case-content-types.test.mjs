import assert from "node:assert/strict";
import test from "node:test";

import {
  caseContentTypeOptions,
  getCaseContentType,
  normalizeCaseContentType,
} from "../lib/case-content-types.ts";

test("Case Lab exposes the four approved article types and safely falls back legacy rows", () => {
  assert.deepEqual(
    caseContentTypeOptions.map(({ value, label }) => ({ value, label })),
    [
      { value: "case", label: "Road Case" },
      { value: "proof", label: "Proof Lab" },
      { value: "brand", label: "Brand Pillar" },
      { value: "product", label: "Product Owner" },
    ],
  );
  assert.equal(normalizeCaseContentType("proof"), "proof");
  assert.equal(normalizeCaseContentType(null), "case");
  assert.equal(normalizeCaseContentType("legacy-value"), "case");
  assert.equal(getCaseContentType("product").description, "Nội dung trọng tâm sản phẩm");
});
