import { Suspense, lazy } from 'react';
import { Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router';
import { docRoutes } from 'docs/routes/docRouter';
import AuthLayout from 'layouts/auth-layout';
import DefaultAuthLayout from 'layouts/auth-layout/DefaultAuthLayout';
import EcommerceLayout from 'layouts/ecommerce-layout';
import LandingLayout from 'layouts/landing-layout';
import MainLayout from 'layouts/main-layout';
import Page404 from 'pages/errors/Page404';
// import PageLoader from 'components/loading/PageLoader';
import AllFiles from 'components/sections/file-manager/main/all-files';
import RecentFiles from 'components/sections/file-manager/main/recent-files';
import paths, { rootPaths } from './paths';

const HiringRoot = lazy(() => import('components/sections/hiring'));

const NewOpening = lazy(() => import('pages/apps/hiring/admin/NewOpening'));
const CandidateDetails = lazy(() => import('pages/apps/hiring/admin/CandidateDetails'));
const JobOpening = lazy(() => import('pages/apps/hiring/admin/JobOpening'));
const Pipeline = lazy(() => import('pages/apps/hiring/admin/Pipeline'));

const JobApplication = lazy(() => import('pages/apps/hiring/candidate/JobApplication'));
const JobDetails = lazy(() => import('pages/apps/hiring/candidate/JobDetails'));
const JobList = lazy(() => import('pages/apps/hiring/candidate/JobList'));

const InvoiceLists = lazy(() => import('pages/apps/invoice/InvoiceLists'));
const CreateInvoice = lazy(() => import('pages/apps/invoice/CreateInvoice'));
const InvoicePreview = lazy(() => import('pages/apps/invoice/InvoicePreview'));
// import App from 'App';
const App = lazy(() => import('App'));

// import AuthGurad from 'components/guard/AuthGuard';
// import GuestGurad from 'components/guard/GuestGurad';
// import Splash from 'components/loading/Splash';
const PageLoader = lazy(() => import('components/loading/PageLoader'));
const LoggedOut = lazy(() => import('pages/authentication/default/LoggedOut'));
const ProjectManagement = lazy(() => import('pages/dashboards/ProjectManagement'));
const Account = lazy(() => import('pages/others/Account'));
const Starter = lazy(() => import('pages/others/Starter'));
const Notifications = lazy(() => import('pages/others/Notifications'));
const EventsDetail = lazy(() => import('pages/events/EventDetail'));
const CreateEvent = lazy(() => import('pages/events/CreateEvent'));
const ComingSoon = lazy(() => import('pages/others/ComingSoon'));
const ECommerce = lazy(() => import('pages/dashboards/ECommerce'));
const Hiring = lazy(() => import('pages/dashboards/Hiring'));
const CRM = lazy(() => import('pages/dashboards/CRM'));
const Analytics = lazy(() => import('pages/dashboards/Analytics'));
const HRM = lazy(() => import('pages/dashboards/HRM'));
const TimeTracker = lazy(() => import('pages/dashboards/TimeTracker'));
const Login = lazy(() => import('pages/authentication/default/jwt/Login'));
const Signup = lazy(() => import('pages/authentication/default/jwt/Signup'));
const ForgotPassword = lazy(() => import('pages/authentication/default/jwt/ForgotPassword'));
const TwoFA = lazy(() => import('pages/authentication/default/jwt/TwoFA'));
const SetPassword = lazy(() => import('pages/authentication/default/jwt/SetPassword'));
const FirebaseLogin = lazy(() => import('pages/authentication/default/firebase/Login'));
const FirebaseSignup = lazy(() => import('pages/authentication/default/firebase/Signup'));
const FirebaseForgotPassword = lazy(
  () => import('pages/authentication/default/firebase/ForgotPassword'),
);
const Auth0Login = lazy(() => import('pages/authentication/default/auth0/Login'));

const EcommerceHomepage = lazy(() => import('pages/apps/ecommerce/customer/Homepage'));
const Products = lazy(() => import('pages/apps/ecommerce/customer/Products'));
const ProductDetails = lazy(() => import('pages/apps/ecommerce/customer/ProductDetails'));
const Cart = lazy(() => import('pages/apps/ecommerce/customer/Cart'));
const CustomerAccount = lazy(() => import('pages/apps/ecommerce/customer/CustomerAccount'));
const Checkout = lazy(() => import('pages/apps/ecommerce/customer/Checkout'));
const Payment = lazy(() => import('pages/apps/ecommerce/customer/Payment'));
const OrderConfirmation = lazy(() => import('pages/apps/ecommerce/customer/OrderConfirmation'));
const Wishlist = lazy(() => import('pages/apps/ecommerce/customer/Wishlist'));
const OrderList = lazy(() => import('pages/apps/ecommerce/customer/OrderList'));
const OrderDetails = lazy(() => import('pages/apps/ecommerce/customer/OrderDetails'));
const OrderTrack = lazy(() => import('pages/apps/ecommerce/customer/OrderTrack'));

const Deals = lazy(() => import('pages/apps/crm/deals/Deals'));
const DealDetails = lazy(() => import('pages/apps/crm/DealDetails'));
const LeadDetails = lazy(() => import('pages/apps/crm/LeadDetails'));
const AddContact = lazy(() => import('pages/apps/crm/AddContact'));

const Kanban = lazy(() => import('pages/apps/kanban'));
const KanbanBoard = lazy(() => import('pages/apps/kanban/Kanban'));
const KanbanBoards = lazy(() => import('pages/apps/kanban/Boards'));
const CreateBoard = lazy(() => import('pages/apps/kanban/CreateBoard'));

const AdminProductListing = lazy(() => import('pages/apps/ecommerce/admin/ProductListing'));
const AdminProductList = lazy(() => import('pages/apps/ecommerce/admin/ProductList'));
const AdminOrderList = lazy(() => import('pages/apps/ecommerce/admin/OrderList'));
const AdminOrder = lazy(() => import('pages/apps/ecommerce/admin/Order'));
const AdminRefund = lazy(() => import('pages/apps/ecommerce/admin/Refund'));
const AdminInvoiceList = lazy(() => import('pages/apps/ecommerce/admin/InvoiceList'));
const AdminInvoice = lazy(() => import('pages/apps/ecommerce/admin/Invoice'));
const AdminCreateOrder = lazy(() => import('pages/apps/ecommerce/admin/CreateOrder'));

const EmailLayout = lazy(() => import('layouts/email-layout'));
const Email = lazy(() => import('pages/apps/email/Email'));
const EmailDetails = lazy(() => import('pages/apps/email/EmailDetails'));

const ChatLayout = lazy(() => import('components/sections/chat/ChatLayout'));
const Chat = lazy(() => import('pages/apps/chat'));
const NewChat = lazy(() => import('pages/apps/chat/NewChat'));
const Conversation = lazy(() => import('pages/apps/chat/Conversation'));

const Social = lazy(() => import('pages/apps/Social'));
const FileManager = lazy(() => import('pages/apps/FileManager'));
const Calendar = lazy(() => import('pages/apps/calendar/Calendar'));
const Scheduler = lazy(() => import('pages/apps/calendar/Scheduler'));
const CalendarLayout = lazy(() => import('components/sections/calendar/CalendarLayout'));
const PricingColumn = lazy(() => import('pages/pricing/PricingColumn'));
const PricingTable = lazy(() => import('pages/pricing/PricingTable'));
const FAQ = lazy(() => import('pages/misc/FAQ'));

const LandingHomepage = lazy(() => import('pages/landing/Homepage'));
const AboutUs = lazy(() => import('pages/landing/AboutUs'));
const Contact = lazy(() => import('pages/landing/Contact'));
const LandingFAQ = lazy(() => import('pages/landing/LandingFAQ'));
const Landing404 = lazy(() => import('pages/landing/404'));
const LandingComingSoon = lazy(() => import('pages/landing/ComingSoon'));
const LandingMaintenance = lazy(() => import('pages/landing/Maintenance'));

const Showcase = lazy(() => import('pages/Showcase'));

export const SuspenseOutlet = () => {
  const { pathname } = useLocation();

  const excludedPathPrefixes = [paths.chat, paths.fileManager, paths.email];

  const shouldUseKey = !excludedPathPrefixes.some((prefix) => pathname.startsWith(prefix));

  return (
    <Suspense key={shouldUseKey ? pathname : undefined} fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

const showcaseElement = (
  <Suspense
    fallback={
      <PageLoader sx={{ height: '100vh', bgcolor: ({ vars }) => vars.palette.grey[950] }} />
    }
  >
    <Showcase />
  </Suspense>
);

export const routes = [
  {
    element: (
      // Uncomment the following line to enable the Suspense fallback for initial loading when using AuthGuard

      // <Suspense fallback={<PageLoader />}>
      <App />
      // </Suspense>
    ),
    children: [
      {
        path: '/',
        element: showcaseElement,
      },
      {
        path: paths.showcase,
        element: showcaseElement,
      },
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoader sx={{ height: '100vh' }} />}>
            <LandingLayout>
              <Outlet />
            </LandingLayout>
          </Suspense>
        ),
        children: [
          {
            path: paths.landingHomepage,
            element: <LandingHomepage />,
          },
          {
            path: paths.landingAbout,
            element: <AboutUs />,
          },
          {
            path: paths.landingContact,
            element: <Contact />,
          },
          {
            path: paths.landingFaq,
            element: <LandingFAQ />,
          },
          {
            path: paths.landing404,
            element: <Landing404 />,
          },
          {
            path: paths.landingComingSoon,
            element: <LandingComingSoon />,
          },
          {
            path: paths.landingMaintenance,
            element: <LandingMaintenance />,
          },
        ],
      },
      {
        path: '/',
        element: (
          // Uncomment the following line to activate the AuthGuard for protected routes

          // <AuthGurad>
          <MainLayout>
            <SuspenseOutlet />
          </MainLayout>
          // </AuthGurad>
        ),
        children: [
          {
            path: paths.ecommerce,
            element: <ECommerce />,
          },
          {
            path: paths.project,
            element: <ProjectManagement />,
          },
          {
            path: paths.crm,
            element: <CRM />,
          },
          {
            path: paths.analytics,
            element: <Analytics />,
          },
          {
            path: paths.hrm,
            element: <HRM />,
          },
          {
            path: paths.timeTracker,
            element: <TimeTracker />,
          },
          {
            path: paths.hiring,
            element: <Hiring />,
          },
          {
            path: paths.starter,
            element: <Starter />,
          },
          {
            path: paths.account,
            element: <Account />,
          },
          {
            path: paths.eventsRoot,
            children: [
              {
                path: paths.events,
                element: <EventsDetail />,
              },
              {
                path: paths.createEvent,
                element: <CreateEvent />,
              },
            ],
          },
          {
            path: paths.notifications,
            element: <Notifications />,
          },
          {
            path: paths.pricingColumn,
            element: <PricingColumn />,
          },
          {
            path: paths.pricingTable,
            element: <PricingTable />,
          },
          {
            path: paths.comingSoon,
            element: <ComingSoon />,
          },
          {
            path: paths.faq,
            children: [
              {
                index: true,
                element: <Navigate to="aws" replace />,
              },
              {
                path: ':category',
                element: <FAQ />,
              },
            ],
          },
          {
            path: paths.ecommerceRoot,
            children: [
              {
                path: rootPaths.ecommerceAdminRoot,
                children: [
                  {
                    path: paths.adminProductListing,
                    element: <AdminProductListing />,
                  },
                  {
                    path: paths.adminProductList,
                    element: <AdminProductList />,
                  },
                  {
                    path: paths.adminOrderList,
                    element: <AdminOrderList />,
                  },
                  {
                    path: paths.adminOrder,
                    element: <AdminOrder />,
                  },
                  {
                    path: paths.adminCreateOrder,
                    element: <AdminCreateOrder />,
                  },
                  {
                    path: paths.adminRefund,
                    element: <AdminRefund />,
                  },
                  {
                    path: paths.adminInvoiceList,
                    element: <AdminInvoiceList />,
                  },
                  {
                    path: paths.adminInvoice,
                    element: <AdminInvoice />,
                  },
                ],
              },
            ],
          },
          {
            path: paths.crmRoot,
            element: <Outlet />,
            children: [
              {
                path: paths.deals,
                element: <Deals />,
              },
              {
                path: paths.dealDetails,
                element: <DealDetails />,
              },
              {
                path: paths.leadDetails,
                element: <LeadDetails />,
              },
              {
                path: paths.addContact,
                element: <AddContact />,
              },
            ],
          },
          {
            path: paths.invoice,
            element: <Outlet />,
            children: [
              {
                path: paths.invoiceList,
                element: <InvoiceLists />,
              },
              {
                path: paths.createInvoice,
                element: <CreateInvoice />,
              },
              {
                path: paths.invoicePreview,
                element: <InvoicePreview />,
              },
              {
                path: `${paths.invoicePreview}/:id`,
                element: <InvoicePreview />,
              },
            ],
          },
          {
            path: paths.kanban,
            element: (
              <Kanban>
                <Outlet />
              </Kanban>
            ),
            children: [
              {
                index: true,
                element: <KanbanBoard />,
              },
              {
                path: paths.boards,
                element: <KanbanBoards />,
              },
              {
                path: paths.createBoard,
                element: <CreateBoard />,
              },
            ],
          },
          {
            path: paths.hiringRoot,
            element: <HiringRoot />,
            children: [
              {
                path: paths.hiringAdmin,
                children: [
                  {
                    path: paths.hiringJobOpening,
                    element: <JobOpening />,
                  },
                  {
                    path: paths.hiringPipeline,
                    element: <Pipeline />,
                  },
                  {
                    path: paths.hiringNewOpening,
                    element: <NewOpening />,
                  },
                  {
                    path: paths.hiringCandidateDetails,
                    element: <CandidateDetails />,
                  },
                ],
              },
              {
                path: paths.hiringCandidate,
                children: [
                  { path: paths.hiringJobList, element: <JobList /> },
                  { path: paths.hiringJobDetails(), element: <JobDetails /> },
                  { path: paths.hiringJobDetails(':id'), element: <JobDetails /> },
                  { path: paths.hiringJobApplication, element: <JobApplication /> },
                ],
              },
            ],
          },
          {
            path: paths.email,
            element: <EmailLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={paths.emailLabel('inbox')} />,
              },
              {
                path: paths.emailLabel(':label'),
                element: <Email />,
              },
              {
                path: paths.emailDetails(':label', ':id'),
                element: <EmailDetails />,
              },
            ],
          },
          {
            path: paths.chat,
            element: <ChatLayout />,
            children: [
              {
                index: true,
                element: <Chat />,
              },
              {
                path: ':conversationId',
                element: <Conversation />,
              },
              {
                path: paths.newChat,
                element: <NewChat />,
              },
            ],
          },
          {
            path: paths.social,
            element: <Social />,
          },
          {
            path: paths.fileManager,
            element: <FileManager />,
            children: [
              {
                index: true,
                element: (
                  <>
                    <RecentFiles />
                    <AllFiles />
                  </>
                ),
              },
              { path: paths.fileManagerFolder(':id'), element: <AllFiles /> },
            ],
          },
          {
            path: paths.calendar,
            element: <CalendarLayout />,
            children: [
              {
                index: true,
                element: <Calendar />,
              },
            ],
          },
          {
            path: paths.scheduler,
            element: <CalendarLayout />,
            children: [
              {
                index: true,
                element: <Scheduler />,
              },
            ],
          },

          ...docRoutes,
        ],
      },
      {
        path: paths.ecommerceRoot,
        children: [
          {
            path: rootPaths.ecommerceCustomerRoot,
            element: (
              <EcommerceLayout>
                <SuspenseOutlet />
              </EcommerceLayout>
            ),
            children: [
              {
                path: paths.ecommerceHomepage,
                element: <EcommerceHomepage />,
              },
              {
                path: paths.products,
                element: <Products />,
              },
              {
                path: paths.productDetails(':id'),
                element: <ProductDetails />,
              },
              {
                path: paths.productDetails(),
                element: <ProductDetails />,
              },
              {
                path: paths.cart,
                element: <Cart />,
              },
              {
                path: paths.customerAccount,
                element: <CustomerAccount />,
              },
              {
                path: paths.checkout,
                element: <Checkout />,
              },
              {
                path: paths.payment,
                element: <Payment />,
              },
              {
                path: paths.orderConfirmation,
                element: <OrderConfirmation />,
              },
              {
                path: paths.wishlist,
                element: <Wishlist />,
              },
              {
                path: paths.orderList,
                element: <OrderList />,
              },
              {
                path: paths.orderDetails,
                element: <OrderDetails />,
              },
              {
                path: paths.orderTrack,
                element: <OrderTrack />,
              },
            ],
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          // Uncomment the following line to activate the GuestGurad for guest routes

          // <GuestGurad>
          <AuthLayout />
          // </GuestGurad>
        ),
        children: [
          {
            element: (
              <DefaultAuthLayout>
                <SuspenseOutlet />
              </DefaultAuthLayout>
            ),
            children: [
              {
                path: rootPaths.authDefaultJwtRoot,
                children: [
                  {
                    path: paths.defaultJwtLogin,
                    element: <Login />,
                  },
                  {
                    path: paths.defaultJwtSignup,
                    element: <Signup />,
                  },
                  {
                    path: paths.defaultJwtForgotPassword,
                    element: <ForgotPassword />,
                  },
                  {
                    path: paths.defaultJwt2FA,
                    element: <TwoFA />,
                  },
                  {
                    path: paths.defaultJwtSetPassword,
                    element: <SetPassword />,
                  },
                ],
              },
              {
                path: rootPaths.authDefaultFirebaseRoot,
                children: [
                  {
                    path: paths.defaultFirebaseLogin,
                    element: <FirebaseLogin />,
                  },
                  {
                    path: paths.defaultFirebaseSignup,
                    element: <FirebaseSignup />,
                  },
                  {
                    path: paths.defaultFirebaseForgotPassword,
                    element: <FirebaseForgotPassword />,
                  },
                ],
              },
              {
                path: rootPaths.authDefaultAuth0Root,
                children: [
                  {
                    path: paths.defaultAuth0Login,
                    element: <Auth0Login />,
                  },
                ],
              },
              {
                path: paths.defaultLoggedOut,
                element: <LoggedOut />,
              },
            ],
          },
        ],
      },

      {
        path: '*',
        element: <Page404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_BASENAME || '/',
});

export default router;
