"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableLoader from "@/components/shared/TableLoader";
import { ICustomer } from "@/types/customer";
import { getAllCustomers } from "@/services/customer";
import { Button } from "@/components/ui/button";
import CustomerOrdersModal from "./CustomerOrdersModal";

const CustomerManagement = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<ICustomer[] | []>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllCustomers();
      if (res?.success) {
        setCustomers(res?.data || []);
      } else {
        toast.error(res?.message || "Failed to fetch customers");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="bg-background border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoader columns={5} rows={5} />
            ) : customers?.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>{customer?.name}</TableCell>
                  <TableCell>{customer?.email}</TableCell>
                  <TableCell className="uppercase">{customer?.role}</TableCell>
                  <TableCell className="uppercase">
                    {customer?.membership}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCustomerId(customer._id);
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No Customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {open && customerId && (
        <CustomerOrdersModal
          setOpenModal={setOpen}
          openModal={open}
          id={customerId}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
