//#region lib/case-extended.ts
var lines = (value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
var SEPARATOR = /\s*[—–]\s*|\s+-{1,2}\s+/;
var splitDash = (line) => line.split(SEPARATOR).map((part) => part.trim());
/** Parses "Tiêu đề — Mô tả" lines (em dash or double hyphen separator). */
function parseTimeline(value) {
	return lines(value).map((line) => {
		const [title, ...rest] = line.split(SEPARATOR);
		return {
			title: (title ?? line).trim(),
			text: rest.join(" — ").trim()
		};
	});
}
/** Parses "Hạng mục — Kết quả" lines the same way as the timeline. */
function parseQc(value) {
	return lines(value).map((line) => {
		const [label, ...rest] = line.split(SEPARATOR);
		return {
			label: (label ?? line).trim(),
			result: rest.join(" — ").trim() || "Đã kiểm tra"
		};
	});
}
function parseListLines(value) {
	return lines(value);
}
/** Parses "Q: ...\nA: ...\n\nQ: ...\nA: ..." blocks separated by a blank line. */
function parseFaqs(value) {
	return value.split(/\r?\n\s*\r?\n/).map((block) => block.trim()).filter(Boolean).map((block) => {
		const qMatch = block.match(/^Q:\s*(.+)$/im);
		const aMatch = block.match(/^A:\s*([\s\S]+)$/im);
		return {
			q: (qMatch?.[1] ?? "").trim(),
			a: (aMatch?.[1] ?? "").trim()
		};
	}).filter((item) => item.q && item.a);
}
/** Parses "Nhãn — Giá trị — Ghi chú" lines into product spec rows. */
function parseMetrics(value) {
	return lines(value).map((line) => {
		const [label, val, note] = splitDash(line);
		return {
			label: label ?? line,
			value: val ?? "",
			note: note ?? ""
		};
	});
}
/** Parses "Mốc — Ngày — done|pending" lines into a post-service follow-up track. */
function parseFollowup(value) {
	return lines(value).map((line) => {
		const [label, date, status] = splitDash(line);
		return {
			label: label ?? line,
			date: date ?? "",
			done: (status ?? "").toLowerCase().startsWith("done")
		};
	});
}
/** Parses "Nhãn — URL" lines into related-content links. */
function parseRelated(value) {
	return lines(value).map((line) => {
		const [label, url] = splitDash(line);
		return {
			label: label ?? line,
			url: url ?? ""
		};
	}).filter((item) => item.url);
}
//#endregion
//#region lib/road-lab-draft.ts
var videoFilePattern = /\.(?:mp4|webm|mov|m4v)(?:$|[?#])/i;
var videoHosts = new Set([
	"youtube.com",
	"www.youtube.com",
	"youtu.be",
	"vimeo.com",
	"www.vimeo.com"
]);
function getRoadLabMediaUrls(value, limit = 12) {
	if (typeof value !== "string") return [];
	const urls = [];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of value.split(/\r?\n/)) {
		if (urls.length >= limit) break;
		try {
			const parsed = new URL(candidate.trim());
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:" || seen.has(parsed.href)) continue;
			seen.add(parsed.href);
			urls.push(parsed.href);
		} catch {}
	}
	return urls;
}
function isRoadLabImageUrl(value) {
	try {
		const parsed = new URL(value);
		return !videoFilePattern.test(parsed.href) && !videoHosts.has(parsed.hostname.toLowerCase());
	} catch {
		return false;
	}
}
//#endregion
export { parseListLines as a, parseRelated as c, parseFollowup as i, parseTimeline as l, isRoadLabImageUrl as n, parseMetrics as o, parseFaqs as r, parseQc as s, getRoadLabMediaUrls as t };
