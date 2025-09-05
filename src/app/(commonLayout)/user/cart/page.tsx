import CartManagement from "@/components/modules/common/cart";
import { getCurrentUser } from "@/services/auth";

const CartPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="w-full">
      <CartManagement userId={user?.id} />
    </div>
  );
};

export default CartPage;
