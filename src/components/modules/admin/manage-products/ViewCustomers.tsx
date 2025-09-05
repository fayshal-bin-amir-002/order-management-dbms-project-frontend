"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getCustomersByOrderedProduct } from "@/services/product";
import { ICustomerOrderedProduct } from "@/types/products";

interface IProductProps {
  productId: string;
  openModal: boolean;
  setOpenModal: (b: boolean) => void;
}

const ViewCustomers = ({
  productId,
  openModal,
  setOpenModal,
}: IProductProps) => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<ICustomerOrderedProduct[]>([]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomersByOrderedProduct(productId);
      setCustomers(res?.data || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openModal) fetchCustomers();
  }, [openModal, productId]);

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-xl w-full max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Customers Ordered This Product</DialogTitle>
          <DialogDescription>
            View all customers who have ordered this product along with their
            membership level.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-4 pr-2">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <CardContent className="space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No customers have ordered this product.
            </p>
          ) : (
            <div className="space-y-3">
              {customers.map((customer) => (
                <Card
                  key={customer._id}
                  className="p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full uppercase text-gray-700">
                      {customer.membership}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomers;
