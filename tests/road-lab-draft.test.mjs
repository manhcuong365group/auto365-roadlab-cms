import assert from "node:assert/strict";
import test from "node:test";

import {
  createRoadLabDraft,
  getRoadLabMediaUrls,
  isRoadLabImageUrl,
  normalizeRoadLabDraft,
} from "../lib/road-lab-draft.ts";

test("normalizes legacy generic content into the Road Lab publication step", () => {
  const draft = normalizeRoadLabDraft({
    title: "Mazda CX-5 nâng cấp Bi LED Ultra Pro",
    summary: "Tóm tắt tình trạng và kết quả nghiệm thu.",
    body: "Ghi chú cũ cần được giữ lại.",
  });

  assert.equal(draft.templateKey, "road_lab");
  assert.equal(draft.publication.title, "Mazda CX-5 nâng cấp Bi LED Ultra Pro");
  assert.equal(draft.publication.summary, "Tóm tắt tình trạng và kết quả nghiệm thu.");
  assert.equal(draft.publication.answerFirst, "Ghi chú cũ cần được giữ lại.");
  assert.equal(draft.vehicle.vehicleName, "");
});

test("creates a complete Road Lab draft with every workflow section", () => {
  const draft = createRoadLabDraft({ vehicleName: "Ford Ranger", productName: "Bi Laser X9" });

  assert.deepEqual(Object.keys(draft), ["templateKey", "publication", "vehicle", "configuration", "evidence", "seo", "review", "extended"]);
  assert.equal(draft.vehicle.vehicleName, "Ford Ranger");
  assert.equal(draft.configuration.productName, "Bi Laser X9");
  assert.equal(draft.review.contentChecked, false);
});

test("keeps only safe unique media URLs for revision previews", () => {
  const media = getRoadLabMediaUrls(`
https://images.example.test/hero.jpg
javascript:alert(1)
https://images.example.test/evidence.webp
https://images.example.test/hero.jpg
ftp://images.example.test/ignored.png
`);

  assert.deepEqual(media, [
    "https://images.example.test/hero.jpg",
    "https://images.example.test/evidence.webp",
  ]);
  assert.equal(isRoadLabImageUrl(media[0]), true);
  assert.equal(isRoadLabImageUrl("https://cdn.example.test/video.mp4"), false);
});
