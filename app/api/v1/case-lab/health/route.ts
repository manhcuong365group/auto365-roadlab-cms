import { apiContractVersion } from "../../../../../server/case-lab-contract";

export function GET() {
  return Response.json({
    version: apiContractVersion,
    status: "ok",
  });
}
