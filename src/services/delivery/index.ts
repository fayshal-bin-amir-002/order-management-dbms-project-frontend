"use server";

import { FieldValues } from "react-hook-form";
import { getCurrentToken } from "../auth";

export const updateDelivery = async (id: string, payload: FieldValues) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/delivery/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
