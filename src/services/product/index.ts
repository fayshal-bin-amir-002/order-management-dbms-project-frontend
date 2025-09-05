"use server";

import { FieldValues } from "react-hook-form";
import { getCurrentToken } from "../auth";

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/product`);
    const result = await res.json();

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCustomersByOrderedProduct = async (id: string) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/product/customers/${id}`, {
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

export const createProduct = async (payload: FieldValues) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/product`, {
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

export const updateProduct = async (payload: FieldValues, id: string) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/product/${id}`, {
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

export const deleteProduct = async (id: string) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/product/${id}`, {
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
