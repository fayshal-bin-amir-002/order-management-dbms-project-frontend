"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Users, Package, DollarSign, ShoppingBag } from "lucide-react";
import { getAdminDashboardData } from "@/services/admin";

interface DashboardData {
  counts: {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  };
  financials: {
    totalSoldAmount: number;
    totalPendingAmount: number;
  };
  topSoldProducts: {
    name: string;
    category: string;
    totalSoldQuantity: number;
    totalRevenue: number;
  }[];
  topBuyingCustomers: {
    name: string;
    membership: string;
    totalSpent: number;
  }[];
}

const DashboardManagement = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await getAdminDashboardData();
      if (res) setData(res?.data);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh] w-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-10 text-muted-foreground">
        Failed to load dashboard data.
      </div>
    );

  const { counts, financials, topSoldProducts, topBuyingCustomers } = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Products</CardTitle>
            <Package className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{counts.totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Users</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{counts.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{counts.totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Delivered Orders</CardTitle>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{counts.deliveredOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-yellow-50 dark:bg-yellow-950 border-none">
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
              {counts.pendingOrders}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950 border-none">
          <CardHeader>
            <CardTitle>Shipped Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {counts.shippedOrders}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950 border-none">
          <CardHeader>
            <CardTitle>Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {counts.deliveredOrders}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950 border-none">
          <CardHeader>
            <CardTitle>Cancelled Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
              {counts.cancelledOrders}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Total Sold Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ৳ {financials.totalSoldAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Total Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ৳ {financials.totalPendingAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Sold Products */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Sold Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSoldProducts.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.totalSoldQuantity}</TableCell>
                    <TableCell>
                      ৳ {item.totalRevenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Buying Customers */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Buying Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topBuyingCustomers.map((cust, i) => (
                  <TableRow key={i}>
                    <TableCell>{cust.name}</TableCell>
                    <TableCell className="capitalize">
                      {cust.membership}
                    </TableCell>
                    <TableCell>৳ {cust.totalSpent.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardManagement;
