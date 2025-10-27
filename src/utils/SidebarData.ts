type Role = "admin" | "user" | "default";

interface NavItem {
  title: string;
  url: string;
}

interface NavData {
  navMain: NavItem[];
}

export const getNavData = (role?: Role): NavData => {
  switch (role) {
    case "admin":
      return {
        navMain: [
          { title: "Dashboard", url: "/admin/dashboard" },
          { title: "Products", url: "/admin" },
          { title: "Manage Products", url: "/admin/manage-products" },
          { title: "Customers", url: "/admin/customers" },
          { title: "Orders", url: "/admin/orders" },
        ],
      };
    case "user":
      return {
        navMain: [
          { title: "Products", url: "/user" },
          { title: "Cart", url: "/user/cart" },
          { title: "My Orders", url: "/user/orders" },
        ],
      };
    default:
      return {
        navMain: [{ title: "Login", url: "/auth" }],
      };
  }
};
