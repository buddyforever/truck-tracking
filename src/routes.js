import React from "react";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

// const DashboardDefault = React.lazy(() => import("./Demo/Dashboard/Default"));

// const UIBasicButton = React.lazy(() =>
//   import("./Demo/UIElements/Basic/Button")
// );
// const UIBasicBadges = React.lazy(() =>
//   import("./Demo/UIElements/Basic/Badges")
// );
// const UIBasicBreadcrumbPagination = React.lazy(() =>
//   import("./Demo/UIElements/Basic/BreadcrumbPagination")
// );

// const UIBasicCollapse = React.lazy(() =>
//   import("./Demo/UIElements/Basic/Collapse")
// );
// const UIBasicTabsPills = React.lazy(() =>
//   import("./Demo/UIElements/Basic/TabsPills")
// );
// const UIBasicBasicTypography = React.lazy(() =>
//   import("./Demo/UIElements/Basic/Typography")
// );

// const FormsElements = React.lazy(() => import("./Demo/Forms/FormsElements"));

// const BootstrapTable = React.lazy(() => import("./Demo/Tables/BootstrapTable"));

// const Nvd3Chart = React.lazy(() => import("./Demo/Charts/Nvd3Chart/index"));

// const GoogleMap = React.lazy(() => import("./Demo/Maps/GoogleMap/index"));

// const OtherSamplePage = React.lazy(() => import("./Demo/Other/SamplePage"));
const Dashboard = React.lazy(() =>
  import("./App/layout/AdminLayout/Dashboard")
);

const LoadingScreen = React.lazy(() =>
  import("./App/layout/AdminLayout/Loading")
);

const NewLoading = React.lazy(() =>
  import("./App/layout/AdminLayout/Loading/NewLoading")
);

const UnloadingScreen = React.lazy(() =>
  import("./App/layout/AdminLayout/Unloading")
);

const LoadingDealDetail = React.lazy(() =>
  import("./App/layout/AdminLayout/Loading/DealDetail")
);

const UnloadingDealDetail = React.lazy(() =>
  import("./App/layout/AdminLayout/Unloading/DealDetail")
);

const Users = React.lazy(() => import("./App/layout/AdminLayout/Users"));

const AddUser = React.lazy(() =>
  import("./App/layout/AdminLayout/Users/AddUser")
);

const EditUser = React.lazy(() =>
  import("./App/layout/AdminLayout/Users/EditUser")
);

const Suppliers = React.lazy(() =>
  import("./App/layout/AdminLayout/Suppliers")
);

const AddSupplier = React.lazy(() =>
  import("./App/layout/AdminLayout/Suppliers/AddSupplier")
);

const EditSupplier = React.lazy(() =>
  import("./App/layout/AdminLayout/Suppliers/EditSupplier")
);

const SummaryReport = React.lazy(() =>
  import("./App/layout/AdminLayout/Report/Summary")
);
const TruckDataHistoryReport = React.lazy(() =>
  import("./App/layout/AdminLayout/Report/TruckDataHistory")
);
const SupplierDataHistoryReport = React.lazy(() =>
  import("./App/layout/AdminLayout/Report/SupplierDataHistory")
);

const Notifications = React.lazy(() =>
  import("./App/layout/AdminLayout/Notifications")
);

const routes = [
  {
    path: "/",
    exact: true,
    name: "Default",
    component: Dashboard,
    permission_users: [2, 3], // user types who can access this page
  },
  {
    path: "/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
    permission_users: [2, 3], // user types who can access this page
  },
  {
    path: "/loading",
    exact: true,
    name: "Loading Live Screen",
    component: LoadingScreen,
    permission_users: [2], // user types who can access this page
  },
  {
    path: "/loading/deal/add",
    exact: true,
    name: "Add New Loading",
    component: NewLoading,
    permission_users: [2], // user types who can access this page
  },
  {
    path: "/loading/deal/:dealId",
    exact: true,
    name: "Loading Live Screen",
    component: LoadingDealDetail,
    permission_users: [2], // user types who can access this page
  },
  {
    path: "/unloading",
    exact: true,
    name: "Unloading Live Screen",
    component: UnloadingScreen,
    permission_users: [3], // user types who can access this page
  },
  {
    path: "/unloading/deal/:dealId",
    exact: true,
    name: "Unloading Live Screen",
    component: UnloadingDealDetail,
    permission_users: [3], // user types who can access this page
  },
  {
    path: "/users",
    exact: true,
    name: "Users",
    component: Users,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/users/add",
    exact: true,
    name: "Add New User",
    component: AddUser,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/users/:id",
    exact: true,
    name: "Edit User",
    component: EditUser,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/suppliers",
    exact: true,
    name: "Supppliers",
    component: Suppliers,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/suppliers/add",
    exact: true,
    name: "Add New Supplier",
    component: AddSupplier,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/suppliers/:id",
    exact: true,
    name: "Edit Supplier",
    component: EditSupplier,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/report/summary",
    exact: true,
    name: "Summary",
    component: SummaryReport,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/report/truck_history",
    exact: true,
    name: "Truck Data History",
    component: TruckDataHistoryReport,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/report/supplier_history",
    exact: true,
    name: "Supplier Data History",
    component: SupplierDataHistoryReport,
    permission_users: [], // user types who can access this page
  },
  {
    path: "/notifications",
    exact: true,
    name: "Notificatons",
    component: Notifications,
    permission_users: [], // user types who can access this page
  },
];

export default routes;
