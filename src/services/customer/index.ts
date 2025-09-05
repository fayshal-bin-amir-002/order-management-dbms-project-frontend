"use server";

import { getCurrentToken } from "../auth";

export const getAllCustomers = async () => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/customer`, {
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

export const getCustomerAllOrders = async (id: string) => {
  const token = await getCurrentToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/order/customer/${id}`, {
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
