import UserOrdersManagement from "@/components/modules/user/orders";
import { getCurrentUser } from "@/services/auth";

const UserOrdersPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="w-full">
      <UserOrdersManagement id={user?.id} />
    </div>
  );
};

export default UserOrdersPage;
