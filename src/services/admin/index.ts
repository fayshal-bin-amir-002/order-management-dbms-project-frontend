"use server";

import { getCurrentToken } from "../auth";

export const getAdminDashboardData = async () => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const result = await res.json();

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
