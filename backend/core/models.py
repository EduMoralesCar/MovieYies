from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    rol = models.CharField(max_length=10, choices=[('admin', 'Administrador'), ('user', 'Usuario')], default='user')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

class Perfil(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='perfiles')
    nombre = models.CharField(max_length=50)
    avatar = models.URLField(default="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png")
    es_nino = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.usuario.email} - {self.nombre}"

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

class Pelicula(models.Model):
    GENRE_CHOICES = [
        ('ACCION', 'Acción'),
        ('COMEDIA', 'Comedia'),
        ('DRAMA', 'Drama'),
        ('TERROR', 'Terror'),
        ('CIENCIA_FICCION', 'Ciencia Ficción'),
        ('DOCUMENTAL', 'Documental'),
        ('NOVELA', 'Novela'),
    ]
    
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_lanzamiento = models.DateField()
    genero = models.CharField(max_length=20, choices=GENRE_CHOICES)
    tipo = models.CharField(max_length=10, choices=[('movie', 'Pelicula'), ('series', 'Serie')], default='movie')
    poster_url = models.URLField()
    backdrop_url = models.URLField(blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    imdb_id = models.CharField(max_length=20, blank=True, null=True)
    duracion_minutos = models.IntegerField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if self.imdb_id and not self.video_url:
            tipo_url = 'movie' if self.tipo == 'movie' else 'tv'
            self.video_url = f"https://vidsrc.xyz/embed/{tipo_url}?imdb={self.imdb_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Película'
        verbose_name_plural = 'Películas'

class Suscripcion(models.Model):
    PLAN_CHOICES = [
        ('BASICO', 'Básico'),
        ('ESTANDAR', 'Estándar'),
        ('PREMIUM', 'Premium'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='suscripcion')
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    fecha_inicio = models.DateField(auto_now_add=True)
    fecha_fin = models.DateField(null=True, blank=True)
    esta_activo = models.BooleanField(default=True)
    metodo_pago = models.CharField(max_length=50, default="Visa terminada en 4242")
    
    def __str__(self):
        return f"{self.usuario.email} - {self.plan}"

    class Meta:
        verbose_name = 'Suscripción'
        verbose_name_plural = 'Suscripciones'

class Historial(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='historial')
    pelicula = models.ForeignKey(Pelicula, on_delete=models.CASCADE)
    visto_en = models.DateTimeField(auto_now=True)
    progreso_segundos = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-visto_en']
        verbose_name = 'Historial'
        verbose_name_plural = 'Historiales'

class Calificacion(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='calificaciones')
    pelicula = models.ForeignKey(Pelicula, on_delete=models.CASCADE)
    puntuacion = models.IntegerField(choices=[(1, 'No me gusta'), (2, 'Me gusta')])
    
    class Meta:
        unique_together = ('perfil', 'pelicula')
        verbose_name = 'Calificación'
        verbose_name_plural = 'Calificaciones'
