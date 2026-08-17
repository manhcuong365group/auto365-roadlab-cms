import assert from "node:assert/strict";
import test from "node:test";

import { createCaseDraft } from "../lib/case-draft.ts";
import { buildArticleViewModel, buildCaseArticleJsonLd } from "../lib/case-article-view.ts";

test("builds a distinct view model per content type with no duplicated lead/paragraph text", () => {
  for (const contentType of ["case", "proof", "brand", "product"]) {
    const draft = createCaseDraft(contentType, { vehicleName: "Ford Ranger", productName: "Bi Laser X9" });
    draft.publication.title = "Bài kiểm thử";
    draft.publication.summary = "Tóm tắt kiểm thử";

    const vm = buildArticleViewModel(draft);

    assert.equal(vm.title, "Bài kiểm thử");
    assert.equal(vm.facts.length, 4, `${contentType} should surface exactly 4 facts for the fact-strip`);
    assert.ok(vm.profileEntries.length > 0);
    assert.ok(vm.methodEntries.length > 0);
    // The editorial "lead" (intro line) must not just repeat the first body
    // paragraph verbatim — that was a real rendering bug caught by hand.
    if (vm.editorialParagraphs.length) {
      assert.notEqual(vm.editorialLead, vm.editorialParagraphs[0]);
    }
  }
});

test("road_lab view model maps vehicle/configuration fields into facts and entries", () => {
  const draft = createCaseDraft("case", { vehicleName: "Kia Carnival" });
  draft.publication.title = "Kia Carnival lắp Bi Gầm Titan";
  draft.vehicle.modelYear = "2022";
  draft.vehicle.odometer = "18.500 km";
  draft.configuration.productName = "Bi Gầm Titan";

  const vm = buildArticleViewModel(draft);

  assert.deepEqual(vm.facts.map((f) => f.value), ["Kia Carnival", "2022", "18.500 km", "—"]);
  assert.ok(vm.methodEntries.some((entry) => entry.value === "Bi Gầm Titan"));
});

test("buildCaseArticleJsonLd produces Article + WebPage + BreadcrumbList + Organization + author Person, no reviewer/FAQPage when absent", () => {
  const draft = createCaseDraft("product", { productName: "LED Matrix A5" });
  draft.publication.title = "LED Matrix A5 review";
  draft.publication.heroUrl = "https://images.example.test/hero.jpg";
  const vm = buildArticleViewModel(draft);

  const graph = buildCaseArticleJsonLd(vm, "https://auto365.vn/tin-tuc/led-matrix-a5", "2026-08-09T10:00:00+07:00");
  const types = graph["@graph"].map((node) => node["@type"]);

  assert.deepEqual(types, ["Article", "WebPage", "BreadcrumbList", "Organization", "Person"]);
  assert.equal(graph["@graph"][0].headline, "LED Matrix A5 review");
  assert.equal(graph["@graph"][1].url, "https://auto365.vn/tin-tuc/led-matrix-a5");
});

test("buildCaseArticleJsonLd adds a reviewer Person and FAQPage node when the draft has them", () => {
  const draft = createCaseDraft("proof");
  draft.publication.title = "Nghiệm thu demo";
  draft.extended.reviewerName = "Đặng Minh Hoàng";
  draft.extended.reviewerRole = "Kỹ thuật viên";
  draft.extended.faqs = "Q: Câu hỏi 1?\nA: Trả lời 1.\n\nQ: Câu hỏi 2?\nA: Trả lời 2.";
  const vm = buildArticleViewModel(draft);

  const graph = buildCaseArticleJsonLd(vm, "https://auto365.vn/tin-tuc/nghiem-thu-demo", "2026-08-09T10:00:00+07:00");
  const types = graph["@graph"].map((node) => node["@type"]);

  assert.deepEqual(types, ["Article", "WebPage", "BreadcrumbList", "Organization", "Person", "Person", "FAQPage"]);
  const faqNode = graph["@graph"].find((node) => node["@type"] === "FAQPage");
  assert.equal(faqNode.mainEntity.length, 2);
  assert.equal(faqNode.mainEntity[0].name, "Câu hỏi 1?");
});
