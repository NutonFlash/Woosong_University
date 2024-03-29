import MainLayout from 'layouts/MainLayout.vue';
import HomePage from 'pages/HomePage.vue';
import PlacesPage from 'pages/PlacesPage.vue';
import PolicyPage from 'pages/PolicyPage.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'home',  component: HomePage},
      { path: 'places',  component: PlacesPage},
      { path: 'meetings', component: HomePage},
      { path: 'suggestions', component: HomePage}
    ]
  },
  {
    path: '/terms-policies',
    component: PolicyPage
  }
]

export default routes
