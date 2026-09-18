import { NextResponse } from "next/server";
import {
  getAuthorizedChildren,
  unauthorizedParentResponse,
} from "../../../../lib/parent-access";

export async function GET(request: Request) {
  try {
    const children = await getAuthorizedChildren(request);
    if (!children) return unauthorizedParentResponse();
    return NextResponse.json({ children });
  } catch {
    return NextResponse.json(
      { error: "Unable to load children." },
      { status: 500 },
    );
  }
}
