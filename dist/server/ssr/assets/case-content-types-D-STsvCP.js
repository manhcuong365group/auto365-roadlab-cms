//#region lib/case-content-types.ts
var caseContentTypeOptions = [
	{
		value: "case",
		label: "Ca thực tế",
		description: "Ca vận hành thực tế"
	},
	{
		value: "proof",
		label: "Bằng chứng & nghiệm thu",
		description: "Bằng chứng, đo kiểm và nghiệm thu"
	},
	{
		value: "brand",
		label: "Nội dung thương hiệu",
		description: "Nội dung định vị thương hiệu"
	},
	{
		value: "product",
		label: "Nội dung sản phẩm",
		description: "Nội dung trọng tâm sản phẩm"
	}
];
var contentTypeByValue = new Map(caseContentTypeOptions.map((item) => [item.value, item]));
function normalizeCaseContentType(value) {
	return typeof value === "string" && contentTypeByValue.has(value) ? value : "case";
}
function getCaseContentType(value) {
	return contentTypeByValue.get(normalizeCaseContentType(value));
}
//#endregion
export { getCaseContentType as n, caseContentTypeOptions as t };
