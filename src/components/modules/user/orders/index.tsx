"use client";

import { useEffect, useState } from "react";
import { getCustomerAllOrders } from "@/services/customer";
import { IOrderCustomer } from "@/types/customer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface UserOrdersManagementProps {
  id: string;
}

const UserOrdersManagement = ({ id }: UserOrdersManagementProps) => {
  const [orders, setOrders] = useState<IOrderCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getCustomerAllOrders(id);
      if (res?.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrders();
  }, [id]);

  const calculateTotals = (order: IOrderCustomer) => {
    let totalQuantity = 0;
    let totalAmount = 0;
    order.items.forEach((item) => {
      const product = order.product_details.find(
        (p) => p._id === item.product_id
      );
      if (product) {
        totalQuantity += item.quantity;
        totalAmount += product.price * item.quantity;
      }
    });
    return { totalQuantity, totalAmount };
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No orders found for this customer.
        </p>
      ) : (
        <ScrollArea className="space-y-4 max-h-[70vh]">
          {orders.map((order) => {
            const { totalQuantity, totalAmount } = calculateTotals(order);

            return (
              <Card
                key={order._id}
                className="p-4 hover:shadow-lg transition-shadow mb-4 md:mb-6"
              >
                <CardContent className="space-y-4">
                  {/* Header: Status + Order Date */}
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="uppercase"
                    >
                      {order.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Ordered: {new Date(order.ordered_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="space-y-2 border-t pt-2">
                    {order.product_details.map((p) => {
                      const item = order.items.find(
                        (it) => it.product_id === p._id
                      );
                      return (
                        <div
                          key={p._id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {p.name} × {item?.quantity || 0}
                          </span>
                          <span>৳ {p.price * (item?.quantity || 0)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Quantity: {totalQuantity}</span>
                    <span>Total Amount: ৳ {totalAmount}</span>
                  </div>

                  {/* Delivery Info */}
                  {order.delivery_info && (
                    <div className="text-xs text-gray-500 mt-2 space-y-1 border-t pt-2">
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
        </ScrollArea>
      )}
    </div>
  );
};

export default UserOrdersManagement;
