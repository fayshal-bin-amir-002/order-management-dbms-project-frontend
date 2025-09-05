"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/order";

interface ICartProduct extends IProduct {
  quantity: number;
}

const CartManagement = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [cart, setCart] = useState<ICartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
    setLoading(false);
  }, []);

  const saveCart = (newCart: ICartProduct[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (id: string) => {
    const newCart = cart.map((p) =>
      p._id === id ? { ...p, quantity: p.quantity + 1 } : p
    );
    saveCart(newCart);
  };

  const decreaseQty = (id: string) => {
    const newCart = cart
      .map((p) =>
        p._id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
      )
      .filter((p) => p.quantity > 0);
    saveCart(newCart);
  };

  const deleteProduct = (id: string) => {
    const newCart = cart.filter((p) => p._id !== id);
    saveCart(newCart);
    toast.success("Product removed from cart");
  };

  const subtotal = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const total = subtotal;

  const handleOrder = async () => {
    const orderData = {
      customer_id: userId,
      items: cart.map((item: ICartProduct) => {
        return {
          product_id: item._id,
          quantity: item.quantity,
        };
      }),
    };
    try {
      const res = await createOrder(orderData);
      if (res?.success) {
        toast.success(res?.message);
        router.push("/user/orders");
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">Your cart is empty.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {cart.map((p) => (
        <Card
          key={p._id}
          className="flex flex-col md:flex-row items-center justify-between gap-4 p-4"
        >
          {/* Product Image + Info */}
          <div className="flex items-center gap-4 flex-1">
            <div>
              <p className="font-semibold text-lg">{p.name}</p>
              <p className="text-gray-500">Category: {p.category}</p>
              <p className="text-gray-700 font-medium">
                Unit Price: ৳ {p.price}
              </p>
              <p className="text-gray-700 font-medium">
                Total: ৳ {p.price * p.quantity}
              </p>
            </div>
          </div>

          {/* Quantity Controls + Delete */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => decreaseQty(p._id)}
              >
                -
              </Button>
              <Input
                type="number"
                value={p.quantity}
                readOnly
                className="w-16 text-center"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => increaseQty(p._id)}
              >
                +
              </Button>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteProduct(p._id)}
            >
              Remove
            </Button>
          </div>
        </Card>
      ))}

      {/* Subtotal & Total */}
      <Card className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-0 bg-white shadow-lg">
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Subtotal:</p>
          <p className="text-lg md:text-xl font-bold">৳ {subtotal}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500 font-medium">Total:</p>
          <p className="text-xl md:text-2xl font-bold">৳ {total}</p>
        </div>
        <Button
          size="lg"
          className="w-full md:w-auto"
          onClick={() => handleOrder()}
        >
          Order Now
        </Button>
      </Card>
    </div>
  );
};

export default CartManagement;
