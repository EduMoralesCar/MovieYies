from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, PerfilViewSet, PeliculaViewSet, SuscripcionViewSet, AdminDashboardViewSet

router = DefaultRouter()
router.register(r'users', UsuarioViewSet)
router.register(r'profiles', PerfilViewSet)
router.register(r'movies', PeliculaViewSet)
router.register(r'subscriptions', SuscripcionViewSet)
router.register(r'admin-dashboard', AdminDashboardViewSet, basename='admin-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
