from rest_framework import serializers
from core.models import Usuario, Perfil, Pelicula, Suscripcion, Historial, Calificacion

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(read_only=True)

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'password', 'telefono', 'rol')

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = Usuario.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        if 'email' in validated_data:
            instance.email = validated_data['email']
            instance.username = validated_data['email'] # Sync username
        
        if 'telefono' in validated_data:
            instance.telefono = validated_data['telefono']

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            
        instance.save()
        return instance

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['id', 'nombre', 'avatar', 'es_nino']
        read_only_fields = ['usuario']

class PeliculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pelicula
        fields = '__all__'

class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        fields = ['id', 'plan', 'fecha_inicio', 'fecha_fin', 'esta_activo', 'metodo_pago']
