// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Home from "@material-ui/icons/Home";
// core components/views for Admin layout
import AccessibleForward from "@material-ui/icons/AccessibleForward";
// core components/views for RTL layout
import HomeComponent from './views/Home/home.component';
import ArchivedPage from './views/Archive/archieve.page';
import SingleJobPage from './views/SingleJob/SingleJob.page';
import { Archive, NaturePeopleSharp, PeopleAlt } from '@material-ui/icons';
import ClientsComponent from "./views/Clients/client.component";
import UserProfileComponent from "./views/UserProfile/userprofile.component";
import InvoicesPage from "./views/Invoices/invoices.page";
import FilterNoneTwoToneIcon from '@material-ui/icons/FilterNoneTwoTone';
import ModeratorsPage from "./views/Moderators/moderators.page";
import Adminspage from "./views/Admin/admins.component";
import PersonPinCircleSharp from '@material-ui/icons/PersonPinCircleSharp';

const dashboardRoutes = [
  {
    path: '/home',
    name: 'Home',
    rtlName: 'لوحة القيادة',
    icon: Home,
    component: HomeComponent,
    layout: '/admin'
  },
  {
    path: '/archive',
    name: 'Archive',
    rtlName: 'لوحة القيادة',
    icon: Archive,
    component: ArchivedPage,
    layout: '/admin'
  },
  {
    path: '/clients',
    name: 'Clients',
    rtlName: 'لوحة القيادة',
    icon: PeopleAlt,
    component: ClientsComponent,
    layout: '/admin'
  },
  {
    path: '/jobs/:idQueryParam',
    name: 'Single Job',
    rtlName: 'لوحة القيادة',
    icon: AccessibleForward,
    component: SingleJobPage,
    layout: '/admin'
  },
  {
    path: '/user',
    name: 'User Profile',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: Person,
    component: UserProfileComponent,
    layout: '/admin'
  },
  {
    path: '/invoices',
    name: 'Invoices',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: FilterNoneTwoToneIcon,
    component: InvoicesPage,
    layout: '/admin'
  },
  {
    path: '/moderators',
    name: 'Moderators',
    rtlName: 'ملف تعريفي للمستخدم',
    icon: NaturePeopleSharp,
    component: ModeratorsPage,
    layout: '/admin'
  },
  {
    path: '/admins',
    name: 'Admins',
    rtlName: 'قائمة الجدول',
    icon: PersonPinCircleSharp,
    component: Adminspage,
    layout: '/admin'
  },
];

export default dashboardRoutes;
