from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Perfil, Pelicula, Suscripcion, Historial, Calificacion

class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ['email', 'username', 'telefono', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('telefono',)}),
    )

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Perfil)
admin.site.register(Pelicula)
admin.site.register(Suscripcion)
admin.site.register(Historial)
admin.site.register(Calificacion)

admin.site.site_header = "Administración de MovieYies"
admin.site.site_title = "Portal de Administración de MovieYies"
admin.site.index_title = "Bienvenido al Portal de Administración"
