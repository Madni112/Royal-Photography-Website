"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePortfolioAction(path: string = "/") {
  try {
    revalidatePath(path);
    return {
      success: true,
      message: `Successfully revalidated path '${path}' in edge cache.`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      timestamp: new Date().toISOString()
    };
  }
}
