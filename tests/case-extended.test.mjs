import assert from "node:assert/strict";
import test from "node:test";

import {
  parseFaqs,
  parseFollowup,
  parseListLines,
  parseMetrics,
  parseQc,
  parseRelated,
  parseTimeline,
} from "../lib/case-extended.ts";

test("parseTimeline splits 'Tiêu đề — Mô tả' lines on an em dash", () => {
  const steps = parseTimeline("Kiểm tra hiện trạng — Đối chiếu hốc đèn và nguồn điện.\nKhóa cấu hình — Chốt sản phẩm theo nhu cầu.");
  assert.deepEqual(steps, [
    { title: "Kiểm tra hiện trạng", text: "Đối chiếu hốc đèn và nguồn điện." },
    { title: "Khóa cấu hình", text: "Chốt sản phẩm theo nhu cầu." },
  ]);
});

test("parseTimeline does not split a mid-word hyphen like 'X-Light'", () => {
  const steps = parseTimeline("Tư vấn cấu hình — Chốt X-Light 301 V2 theo nhu cầu sử dụng.");
  assert.deepEqual(steps, [{ title: "Tư vấn cấu hình", text: "Chốt X-Light 301 V2 theo nhu cầu sử dụng." }]);
});

test("parseTimeline tolerates a line with no separator by using it as the title only", () => {
  assert.deepEqual(parseTimeline("Chỉ có tiêu đề"), [{ title: "Chỉ có tiêu đề", text: "" }]);
});

test("parseQc splits 'Hạng mục — Kết quả' lines and defaults a missing result", () => {
  const items = parseQc("Cos — Hoạt động sau căn chỉnh\nPha");
  assert.deepEqual(items, [
    { label: "Cos", result: "Hoạt động sau căn chỉnh" },
    { label: "Pha", result: "Đã kiểm tra" },
  ]);
});

test("parseListLines trims and drops blank lines", () => {
  assert.deepEqual(parseListLines("  Mục một  \n\nMục hai\n"), ["Mục một", "Mục hai"]);
});

test("parseFaqs reads Q:/A: blocks separated by a blank line and skips incomplete blocks", () => {
  const faqs = parseFaqs("Q: Câu hỏi 1?\nA: Trả lời 1.\n\nQ: Câu hỏi 2?\nA: Trả lời 2.\n\nQ: Câu hỏi thiếu trả lời?");
  assert.deepEqual(faqs, [
    { q: "Câu hỏi 1?", a: "Trả lời 1." },
    { q: "Câu hỏi 2?", a: "Trả lời 2." },
  ]);
});

test("parseMetrics splits 'Nhãn — Giá trị — Ghi chú' lines", () => {
  const metrics = parseMetrics("Công suất Cos — Khoảng 45W — Theo tài liệu sản phẩm\nĐiện áp — Dải 12V đến 16V");
  assert.deepEqual(metrics, [
    { label: "Công suất Cos", value: "Khoảng 45W", note: "Theo tài liệu sản phẩm" },
    { label: "Điện áp", value: "Dải 12V đến 16V", note: "" },
  ]);
});

test("parseFollowup splits 'Mốc — Ngày — done/pending' lines", () => {
  const steps = parseFollowup("Bàn giao — Ngày 0 — done\nHậu kiểm 7 ngày — +7 ngày — pending");
  assert.deepEqual(steps, [
    { label: "Bàn giao", date: "Ngày 0", done: true },
    { label: "Hậu kiểm 7 ngày", date: "+7 ngày", done: false },
  ]);
});

test("parseRelated splits 'Nhãn — URL' lines and drops entries without a URL", () => {
  const links = parseRelated("Checklist sau khi lắp — https://auto365.vn/checklist\nThiếu URL");
  assert.deepEqual(links, [{ label: "Checklist sau khi lắp", url: "https://auto365.vn/checklist" }]);
});
