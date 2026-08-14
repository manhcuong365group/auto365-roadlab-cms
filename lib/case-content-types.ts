export const caseContentTypeOptions = [
  { value: "case", label: "Ca thực tế", description: "Ca vận hành thực tế" },
  { value: "proof", label: "Bằng chứng & nghiệm thu", description: "Bằng chứng, đo kiểm và nghiệm thu" },
  { value: "brand", label: "Nội dung thương hiệu", description: "Nội dung định vị thương hiệu" },
  { value: "product", label: "Nội dung sản phẩm", description: "Nội dung trọng tâm sản phẩm" },
] as const;

export type CaseContentType = (typeof caseContentTypeOptions)[number]["value"];

const contentTypeByValue = new Map(caseContentTypeOptions.map((item) => [item.value, item]));

export function normalizeCaseContentType(value: unknown): CaseContentType {
  return typeof value === "string" && contentTypeByValue.has(value as CaseContentType)
    ? value as CaseContentType
    : "case";
}

export function getCaseContentType(value: unknown) {
  return contentTypeByValue.get(normalizeCaseContentType(value))!;
}
