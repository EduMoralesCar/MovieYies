from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from core.models import Usuario, Perfil, Pelicula, Suscripcion
from .serializers import UsuarioSerializer, PerfilSerializer, PeliculaSerializer, SuscripcionSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Verificar si es el primer usuario
            is_first_user = not Usuario.objects.exists()
            
            user = serializer.save()
            
            if is_first_user:
                user.is_staff = True
                user.is_superuser = True
                user.rol = 'admin'
                user.save()
            
            # Crear perfil por defecto
            Perfil.objects.create(
                usuario=user,
                nombre=user.username.split('@')[0] if '@' in user.username else user.username,
                avatar="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            )

            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        
        if isinstance(email, str):
            email = email.strip()
        if isinstance(password, str):
            password = password.strip()
        
        print(f"DEBUG LOGIN: email={repr(email)}, password={repr(password)}")
        
        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate espera username, así que pasamos email como username
        user = authenticate(username=email, password=password)
        
        if user:
            print(f"User {email} authenticated successfully.")
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': UsuarioSerializer(user).data})
            
        print(f"Authentication failed for {email}.")
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PeliculaViewSet(viewsets.ModelViewSet):
    queryset = Pelicula.objects.all().order_by('-id')
    serializer_class = PeliculaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Simplificar lógica para depuración
        queryset = Pelicula.objects.all().order_by('-id')
        
        # Si es admin o no es 'list' (ej. retrieve, delete), devolver todo
        if self.request.user.is_staff or self.action != 'list':
            return queryset
            
        # Solo filtrar para usuarios normales en la lista
        return queryset.exclude(poster_url='N/A').exclude(poster_url='')

    def destroy(self, request, *args, **kwargs):
        print(f"DEBUG: destroy called for pk={kwargs.get('pk')}")
        try:
            instance = self.get_object()
            print(f"DEBUG: Found object {instance.id} - {instance.titulo}")
            self.perform_destroy(instance)
            print("DEBUG: Object deleted")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(f"DEBUG: Error in destroy: {e}")
            # Si falla get_object, será 404. Si falla perform_destroy, será otro error.
            # Dejamos que DRF maneje el error pero lo logueamos
            raise e

    def perform_create(self, serializer):
        print("DEBUG: perform_create data:", serializer.validated_data)
        instance = serializer.save()
        print(f"DEBUG: Created movie id={instance.id} title={instance.titulo}")

    def list(self, request, *args, **kwargs):
        print("DEBUG: list action called")
        response = super().list(request, *args, **kwargs)
        print(f"DEBUG: list returning {len(response.data)} items")
        return response



class SuscripcionViewSet(viewsets.ModelViewSet):
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        suscripcion, created = Suscripcion.objects.get_or_create(usuario=request.user, defaults={'plan': 'BASICO'})
        if request.method == 'GET':
            serializer = self.get_serializer(suscripcion)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(suscripcion, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_users = Usuario.objects.count()
        active_subs = Suscripcion.objects.filter(esta_activo=True).count()
        cancelled_subs = Suscripcion.objects.filter(esta_activo=False).count()
        
        # Películas top (lógica simulada por ahora ya que el historial podría estar vacío)
        top_movies = Pelicula.objects.all()[:5]
        top_movies_data = [{'titulo': m.titulo, 'vistas': 100} for m in top_movies]

        return Response({
            'total_users': total_users,
            'active_subscriptions': active_subs,
            'cancelled_subscriptions': cancelled_subs,
            'top_movies': top_movies_data
        })
