"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FieldValues } from "react-hook-form";

export const loginUser = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (result.success) {
      (await cookies()).set("accessToken", result.data.accessToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const registerUser = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/customer/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (result.success) {
      (await cookies()).set("accessToken", result.data.accessToken);
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
  }
  return decodedData;
};

export const logout = async () => {
  (await cookies()).delete("accessToken");
};

export const getCurrentToken = async (): Promise<string> => {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")!.value;

  return token;
};
