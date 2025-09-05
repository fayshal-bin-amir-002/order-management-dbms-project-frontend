"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/services/product";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/types/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ICartProduct extends IProduct {
  quantity: number;
}

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = (product: IProduct) => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as ICartProduct[];

      const existingIndex = cart.findIndex((p) => p._id === product._id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      toast.success(`Added ${product.name} to cart`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    }
  };

  return (
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
              <CardContent className=" space-y-3">
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

                {/* Add to cart button */}
                <Button
                  className="w-full mt-2"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
    </div>
  );
};

export default Products;
