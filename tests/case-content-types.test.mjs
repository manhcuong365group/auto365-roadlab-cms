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
      { value: "case", label: "Ca thực tế" },
      { value: "proof", label: "Bằng chứng & nghiệm thu" },
      { value: "brand", label: "Nội dung thương hiệu" },
      { value: "product", label: "Nội dung sản phẩm" },
    ],
  );
  assert.equal(normalizeCaseContentType("proof"), "proof");
  assert.equal(normalizeCaseContentType(null), "case");
  assert.equal(normalizeCaseContentType("legacy-value"), "case");
  assert.equal(getCaseContentType("product").description, "Nội dung trọng tâm sản phẩm");
});
