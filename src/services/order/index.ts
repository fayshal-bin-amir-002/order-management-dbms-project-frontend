"use server";

import { FieldValues } from "react-hook-form";
import { getCurrentToken } from "../auth";

export const getAllOrders = async () => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/order`, {
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

export const createOrder = async (payload: FieldValues) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/order`, {
      method: "POST",
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

export const updateOrderStatus = async (id: string, payload: FieldValues) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/order/${id}/status`, {
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

export const deleteOrder = async (id: string) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/order/${id}`, {
      method: "DELETE",
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
