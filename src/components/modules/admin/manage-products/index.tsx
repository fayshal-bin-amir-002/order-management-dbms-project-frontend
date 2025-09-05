"use client";

import { useEffect, useState } from "react";
import { deleteProduct, getAllProducts } from "@/services/product";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/types/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddNewProductModal from "./AddNewProductModal";
import UpdateProductModal from "./UpdateProductModal";
import Swal from "sweetalert2";
import ViewCustomers from "./ViewCustomers";

const ManageProductsContainer = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [productId, setProductId] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <Button onClick={() => setAddOpen(true)}>Add New Product</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 w-full">
                <CardContent className="space-y-4">
                  {/* Bigger product image skeleton */}
                  {/* Product name */}
                  <Skeleton className="h-4 w-3/4" />
                  {/* Category */}
                  <Skeleton className="h-3 w-1/2" />
                  {/* Price */}
                  <Skeleton className="h-4 w-1/3" />
                  {/* Stock */}
                  <Skeleton className="h-2 w-1/4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          : products.map((product) => (
              <Card key={product._id} className="w-full">
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="mt-2 text-primary font-bold">
                      ৳ {product.price}
                    </p>
                    <p className="text-xs text-gray-400">
                      Stock: {product.stock}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    {/* Admin actions (update + delete) */}
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                        onClick={() => {
                          setOpenView(true);
                          setProductId(product._id);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                        onClick={() => {
                          setUpdateOpen(true);
                          setProduct(product);
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
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
                                const res = await deleteProduct(
                                  product?._id as string
                                );
                                if (res?.success) {
                                  toast.success(res?.message);

                                  fetchProducts();
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
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
      {openView && productId && (
        <ViewCustomers
          productId={productId}
          openModal={openView}
          setOpenModal={setOpenView}
        />
      )}
      {addOpen && (
        <AddNewProductModal
          openModal={addOpen}
          setOpenModal={setAddOpen}
          fetchProducts={fetchProducts}
        />
      )}
      {updateOpen && product && (
        <UpdateProductModal
          product={product}
          openModal={updateOpen}
          setOpenModal={setUpdateOpen}
          fetchProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default ManageProductsContainer;
