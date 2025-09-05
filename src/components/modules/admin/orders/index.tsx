"use client";

import { useEffect, useState } from "react";
import { deleteOrder, getAllOrders, updateOrderStatus } from "@/services/order";
import { IOrder } from "@/types/order";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { updateDelivery } from "@/services/delivery";

const OrdersManagement = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState<{
    [key: string]: { status: string; shipping_method?: string };
  }>({});

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setStatusUpdate({});
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusUpdate((prev) => ({
      ...prev,
      [orderId]: { status: newStatus },
    }));
  };

  const handleShippingChange = (orderId: string, value: string) => {
    setStatusUpdate((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], shipping_method: value },
    }));
  };

  const submitStatus = async (orderId: string, deliveryId: string) => {
    const update = statusUpdate[orderId];
    if (!update) return;

    if (update.status === "delivered" && !update.shipping_method) {
      toast.error("Please provide shipping method for delivered orders");
      return;
    }

    try {
      const promises = [];

      if (update.status === "delivered") {
        promises.push(
          updateDelivery(deliveryId, {
            shipping_method: update.shipping_method,
          })
        );
      }

      promises.push(updateOrderStatus(orderId, { status: update.status }));

      const results = await Promise.all(promises);

      const orderRes = update.status === "delivered" ? results[1] : results[0];

      if (orderRes?.success) {
        toast.success(orderRes?.message || "Status updated successfully!");
        fetchOrders();
      } else {
        toast.error(orderRes?.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="w-full">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-1/4" />
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ordered At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  {order.customer_info?.name}
                </TableCell>
                <TableCell>{order.customer_info?.email}</TableCell>
                <TableCell className="space-y-2">
                  <Select
                    defaultValue={order.status}
                    onValueChange={(val: string) =>
                      handleStatusChange(order._id, val)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Conditional input for delivered */}
                  {statusUpdate[order._id]?.status === "delivered" && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Shipping Method"
                        value={statusUpdate[order._id]?.shipping_method || ""}
                        onChange={(e) =>
                          handleShippingChange(order._id, e.target.value)
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          submitStatus(order._id, order?.delivery_info?._id)
                        }
                      >
                        Update
                      </Button>
                    </div>
                  )}

                  {/* Immediate update for other statuses */}
                  {statusUpdate[order._id]?.status &&
                    statusUpdate[order._id]?.status !== "delivered" && (
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          submitStatus(order._id, order?.delivery_info?._id)
                        }
                      >
                        Update
                      </Button>
                    )}
                </TableCell>
                <TableCell>
                  {order.product_details?.map((p) => {
                    const quantity =
                      order.items.find((it) => it.product_id === p._id)
                        ?.quantity || 0;
                    const amount = p.price * quantity;

                    return (
                      <div key={p._id} className="text-sm">
                        <p>
                          {p.name} × {quantity}
                        </p>
                        <p className="font-semibold">৳ {amount}</p>
                      </div>
                    );
                  })}
                </TableCell>

                <TableCell>
                  {order.delivery_info ? (
                    <div className="text-sm">
                      <p>
                        <span className="uppercase">{order.status}</span>
                        {order.delivery_info.shipping_method && (
                          <span className="text-green-600">
                            {" "}
                            - {order.delivery_info.shipping_method}
                          </span>
                        )}
                      </p>
                      {order.delivery_info.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(
                            order.delivery_info.date
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">No delivery info</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(order.ordered_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    disabled={order?.status !== "cancelled"}
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          try {
                            const res = await deleteOrder(order?._id);
                            if (res?.success) {
                              toast.success(res?.message);
                              fetchOrders();
                            } else {
                              toast.error(res?.message);
                            }
                          } catch (err: any) {
                            toast.error(err?.message);
                          }
                        }
                      });
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrdersManagement;
