"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCustomerAllOrders } from "@/services/customer";
import { IOrderCustomer } from "@/types/customer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface ICustomerModalProps {
  id: string;
  openModal: boolean;
  setOpenModal: (b: boolean) => void;
}

const CustomerOrdersModal = ({
  id,
  openModal,
  setOpenModal,
}: ICustomerModalProps) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<IOrderCustomer[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCustomerAllOrders(id);
      if (res?.success) {
        setOrders(res?.data || []);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openModal) fetchData();
  }, [id, openModal]);

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-2xl w-full max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Customer Orders</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-2">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <CardContent className="space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">
              No orders found for this customer.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const totalQuantity = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                const totalAmount = order.product_details.reduce((sum, p) => {
                  const quantity =
                    order.items.find((it) => it.product_id === p._id)
                      ?.quantity || 0;
                  return sum + p.price * quantity;
                }, 0);

                return (
                  <Card key={order._id} className="p-4">
                    <CardContent className="space-y-3">
                      {/* Order status + date */}
                      <div className="flex justify-between items-center">
                        <Badge
                          className="uppercase"
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(order.ordered_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Order items */}
                      <div className="space-y-2">
                        {order.product_details.map((p) => {
                          const quantity =
                            order.items.find((it) => it.product_id === p._id)
                              ?.quantity || 0;
                          return (
                            <div
                              key={p._id}
                              className="flex justify-between text-sm border-b pb-1"
                            >
                              <span>
                                {p.name} × {quantity}
                              </span>
                              <span>৳ {p.price * quantity}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total quantity and amount */}
                      <div className="flex justify-between mt-2 text-sm font-medium">
                        <span>Total Quantity: {totalQuantity}</span>
                        <span>Total Amount: ৳ {totalAmount}</span>
                      </div>

                      {/* Delivery info */}
                      {order.delivery_info && (
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                          <p>
                            Shipping:{" "}
                            <span className="font-medium">
                              {order.delivery_info.shipping_method}
                            </span>
                          </p>
                          <p>
                            Delivered:{" "}
                            {order.delivery_info.delivered ? "✅ Yes" : "❌ No"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerOrdersModal;
