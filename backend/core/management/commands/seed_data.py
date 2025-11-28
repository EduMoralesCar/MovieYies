from django.core.management.base import BaseCommand
from core.models import Pelicula
import requests
import random
from datetime import datetime

class Command(BaseCommand):
    help = 'Puebla la base de datos con contenido inicial (Películas y Series)'

    def handle(self, *args, **kwargs):
        self.stdout.write('Iniciando población de datos...')

        # 1. Películas Populares (Lista ampliada a ~50 títulos)
        peliculas_data = [
            # Acción / Superhéroes
            {
                "titulo": "The Avengers",
                "descripcion": "Los héroes más poderosos de la Tierra deben unirse y aprender a luchar en equipo si quieren evitar que el travieso Loki y su ejército alienígena esclavicen a la humanidad.",
                "fecha_lanzamiento": "2012-05-04",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/nNmJRkg8wWnRmzQDe2FwKbPIsJV.jpg",
                "imdb_id": "tt0848228",
                "duracion_minutos": 143
            },
            {
                "titulo": "Iron Man",
                "descripcion": "Después de ser retenido cautivo en una cueva afgana, el ingeniero multimillonario Tony Stark crea una armadura única para luchar contra el mal.",
                "fecha_lanzamiento": "2008-05-02",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/cyecB7godJ6kNHGONFjUyVN9OX5.jpg",
                "imdb_id": "tt0371746",
                "duracion_minutos": 126
            },
            {
                "titulo": "Black Panther",
                "descripcion": "T'Challa, heredero del reino oculto pero avanzado de Wakanda, debe dar un paso adelante para guiar a su pueblo hacia un nuevo futuro.",
                "fecha_lanzamiento": "2018-02-16",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg",
                "imdb_id": "tt1825683",
                "duracion_minutos": 134
            },
            {
                "titulo": "Joker",
                "descripcion": "En Gotham City, el comediante con problemas mentales Arthur Fleck es ignorado y maltratado por la sociedad.",
                "fecha_lanzamiento": "2019-10-04",
                "genero": "DRAMA",
                "poster_url": "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
                "imdb_id": "tt7286456",
                "duracion_minutos": 122
            },
            {
                "titulo": "The Batman",
                "descripcion": "Cuando un asesino sádico deja un rastro de pistas crípticas, Batman se aventura en el inframundo de Gotham.",
                "fecha_lanzamiento": "2022-03-04",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50x9T2ZuDJ.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
                "imdb_id": "tt1877830",
                "duracion_minutos": 176
            },
            {
                "titulo": "Logan",
                "descripcion": "En un futuro donde los mutantes están casi extintos, un Logan anciano y cansado lleva una vida tranquila.",
                "fecha_lanzamiento": "2017-03-03",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/fnbjc37n6Z1pZv84NE63TuXIMD1.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/5p3aIXIkOL19t5sQ70YA2s8hY6.jpg",
                "imdb_id": "tt3315342",
                "duracion_minutos": 137
            },
            {
                "titulo": "Deadpool",
                "descripcion": "Un mercenario bocazas con un sentido del humor retorcido persigue al hombre que lo sometió a un experimento que lo dejó con poderes curativos acelerados.",
                "fecha_lanzamiento": "2016-02-12",
                "genero": "COMEDIA",
                "poster_url": "https://image.tmdb.org/t/p/w500/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/en971MEXui9diirXlogOrPKmsEn.jpg",
                "imdb_id": "tt1431045",
                "duracion_minutos": 108
            },
            {
                "titulo": "John Wick",
                "descripcion": "Un ex asesino a sueldo sale de su retiro para localizar a los gánsteres que mataron a su perro y le quitaron todo.",
                "fecha_lanzamiento": "2014-10-24",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/wX1Cr8I43PM5vzY5stYvRPr75F5.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/umC04Cozevu8nn39Tixq3bcf20.jpg",
                "imdb_id": "tt2911666",
                "duracion_minutos": 101
            },
            {
                "titulo": "Mad Max: Fury Road",
                "descripcion": "En un desierto post-apocalíptico, una mujer se rebela contra un gobernante tiránico en busca de su tierra natal.",
                "fecha_lanzamiento": "2015-05-15",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/g65X21J5h7qZ7gq1r5k5x5.jpg",
                "imdb_id": "tt1392190",
                "duracion_minutos": 120
            },
            {
                "titulo": "Top Gun: Maverick",
                "descripcion": "Después de treinta años, Maverick sigue superando los límites como aviador naval de primer nivel.",
                "fecha_lanzamiento": "2022-05-27",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg",
                "imdb_id": "tt1745960",
                "duracion_minutos": 130
            },

            # Ciencia Ficción / Fantasía
            {
                "titulo": "Harry Potter y la Piedra Filosofal",
                "descripcion": "Un niño huérfano se inscribe en una escuela de magia y hechicería, donde aprende la verdad sobre sí mismo.",
                "fecha_lanzamiento": "2001-11-16",
                "genero": "CIENCIA_FICCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/hziiv14OpD73u9gAak4XDDfBKa2.jpg",
                "imdb_id": "tt0241527",
                "duracion_minutos": 152
            },
            {
                "titulo": "El Señor de los Anillos: El Retorno del Rey",
                "descripcion": "Gandalf y Aragorn lideran el Mundo de los Hombres contra el ejército de Sauron para distraer su atención de Frodo.",
                "fecha_lanzamiento": "2003-12-17",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3vpX3hOVDOAH.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/lXhgCODAbBXL5buk9yEmTpOoOgC.jpg",
                "imdb_id": "tt0167260",
                "duracion_minutos": 201
            },
            {
                "titulo": "Star Wars: El Imperio Contraataca",
                "descripcion": "Después de que los rebeldes son dominados por el Imperio, Luke Skywalker comienza su entrenamiento Jedi con Yoda.",
                "fecha_lanzamiento": "1980-05-21",
                "genero": "CIENCIA_FICCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/7BuH8itoDDemLo6Yww4UEACUns.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/aJCtkxLLzVE60gOlWnF5bCd6vIb.jpg",
                "imdb_id": "tt0080684",
                "duracion_minutos": 124
            },
            {
                "titulo": "Blade Runner 2049",
                "descripcion": "El descubrimiento de un secreto enterrado durante mucho tiempo por el joven Blade Runner K lo lleva a buscar al ex Blade Runner Rick Deckard.",
                "fecha_lanzamiento": "2017-10-06",
                "genero": "CIENCIA_FICCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/ilRyASD8Fdt7Y22U6C19iI8z7Jq.jpg",
                "imdb_id": "tt1856101",
                "duracion_minutos": 164
            },
            {
                "titulo": "Arrival",
                "descripcion": "Una lingüista trabaja con el ejército para comunicarse con formas de vida extraterrestres después de que doce naves espaciales aparecen en todo el mundo.",
                "fecha_lanzamiento": "2016-11-11",
                "genero": "CIENCIA_FICCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/pEFRzXtLmxYNjGd0XqJDHPDFKB2.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/yS5UFh75YV5g553e7Xh1f5X5.jpg",
                "imdb_id": "tt2543164",
                "duracion_minutos": 116
            },
            {
                "titulo": "Inception",
                "descripcion": "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños, se le da la tarea inversa de plantar una idea en la mente de un C.E.O.",
                "fecha_lanzamiento": "2010-07-16",
                "genero": "CIENCIA_FICCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/9gk7admal4zl604ZEfOgopLL4U0.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
                "imdb_id": "tt1375666",
                "duracion_minutos": 148
            },
            {
                "titulo": "Interstellar",
                "descripcion": "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de asegurar la supervivencia de la humanidad.",
                "fecha_lanzamiento": "2014-11-07",
                "genero": "CIENCIA_FICCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
                "imdb_id": "tt0816692",
                "duracion_minutos": 169
            },
            {
                "titulo": "The Dark Knight",
                "descripcion": "Cuando la amenaza conocida como el Joker causa estragos y el caos en la gente de Gotham, Batman debe aceptar una de las pruebas psicológicas y físicas más grandes para luchar contra la injusticia.",
                "fecha_lanzamiento": "2008-07-18",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
                "imdb_id": "tt0468569",
                "duracion_minutos": 152
            },
            {
                "titulo": "Avengers: Endgame",
                "descripcion": "Después de los eventos devastadores de Infinity War, el universo está en ruinas. Con la ayuda de los aliados restantes, los Vengadores se reúnen una vez más para revertir las acciones de Thanos y restaurar el equilibrio del universo.",
                "fecha_lanzamiento": "2019-04-26",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
                "imdb_id": "tt4154796",
                "duracion_minutos": 181
            },
            {
                "titulo": "Spider-Man: No Way Home",
                "descripcion": "Con la identidad de Spider-Man ahora revelada, Peter pide ayuda al Doctor Strange. Cuando un hechizo sale mal, enemigos peligrosos de otros mundos comienzan a aparecer.",
                "fecha_lanzamiento": "2021-12-17",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4GY0d.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnro5n0.jpg",
                "imdb_id": "tt10872600",
                "duracion_minutos": 148
            },

            # Terror
            {
                "titulo": "It",
                "descripcion": "En el verano de 1989, un grupo de niños intimidados se unen para destruir un monstruo que cambia de forma.",
                "fecha_lanzamiento": "2017-09-08",
                "genero": "TERROR",
                "poster_url": "https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTJhEhx1o.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/tcheoA2nPATCm2vvXw2hZs4nIyD.jpg",
                "imdb_id": "tt1396484",
                "duracion_minutos": 135
            },
            {
                "titulo": "Get Out",
                "descripcion": "Un joven afroamericano visita la finca de la familia de su novia blanca, donde descubre que muchos de sus residentes han desaparecido.",
                "fecha_lanzamiento": "2017-02-24",
                "genero": "TERROR",
                "poster_url": "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/l4x0pBIfg89k6j8l5vBqB5.jpg",
                "imdb_id": "tt5052448",
                "duracion_minutos": 104
            },
            {
                "titulo": "A Quiet Place",
                "descripcion": "En un mundo post-apocalíptico, una familia se ve obligada a vivir en silencio mientras se esconde de monstruos con un oído ultra sensible.",
                "fecha_lanzamiento": "2018-04-06",
                "genero": "TERROR",
                "poster_url": "https://image.tmdb.org/t/p/w500/nJD720Y9I5a2V1r9.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/roYyPiQDlpMuU4jWWF13K77S.jpg",
                "imdb_id": "tt6644200",
                "duracion_minutos": 90
            },
            {
                "titulo": "The Conjuring",
                "descripcion": "Los investigadores paranormales Ed y Lorraine Warren trabajan para ayudar a una familia aterrorizada por una presencia oscura en su granja.",
                "fecha_lanzamiento": "2013-07-19",
                "genero": "TERROR",
                "poster_url": "https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6vaqS2yCZph8.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/1u1.jpg",
                "imdb_id": "tt1457767",
                "duracion_minutos": 112
            },
            {
                "titulo": "Hereditary",
                "descripcion": "Una familia en duelo es perseguida por sucesos trágicos y perturbadores.",
                "fecha_lanzamiento": "2018-06-08",
                "genero": "TERROR",
                "poster_url": "https://image.tmdb.org/t/p/w500/lRuR9.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/4s2.jpg",
                "imdb_id": "tt7784604",
                "duracion_minutos": 127
            },

            # Comedia / Animación
            {
                "titulo": "Superbad",
                "descripcion": "Dos estudiantes de secundaria codependientes se ven obligados a lidiar con la ansiedad de separación después de que su plan para organizar una fiesta llena de alcohol sale mal.",
                "fecha_lanzamiento": "2007-08-17",
                "genero": "COMEDIA",
                "poster_url": "https://image.tmdb.org/t/p/w500/ek8.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/5.jpg",
                "imdb_id": "tt0829482",
                "duracion_minutos": 113
            },
            {
                "titulo": "The Hangover",
                "descripcion": "Tres amigos se despiertan de una despedida de soltero en Las Vegas, sin recordar la noche anterior y con el novio desaparecido.",
                "fecha_lanzamiento": "2009-06-05",
                "genero": "COMEDIA",
                "poster_url": "https://image.tmdb.org/t/p/w500/ul.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/8.jpg",
                "imdb_id": "tt1119646",
                "duracion_minutos": 100
            },
            {
                "titulo": "Shrek",
                "descripcion": "Un ogro malhumorado hace un trato con Lord Farquaad para recuperar su pantano a cambio de rescatar a la princesa Fiona.",
                "fecha_lanzamiento": "2001-05-18",
                "genero": "COMEDIA",
                "poster_url": "https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/21.jpg",
                "imdb_id": "tt0126029",
                "duracion_minutos": 90
            },
            {
                "titulo": "Ratatouille",
                "descripcion": "Una rata que puede cocinar hace una alianza inusual con un joven trabajador de cocina en un famoso restaurante.",
                "fecha_lanzamiento": "2007-06-29",
                "genero": "COMEDIA",
                "poster_url": "https://image.tmdb.org/t/p/w500/npHNjldbeTHdKKw28bJKs7lzqzj.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/xgD.jpg",
                "imdb_id": "tt0382932",
                "duracion_minutos": 111
            },
            {
                "titulo": "Inside Out",
                "descripcion": "Después de que la joven Riley es desarraigada de su vida en el Medio Oeste y se muda a San Francisco, sus emociones entran en conflicto.",
                "fecha_lanzamiento": "2015-06-19",
                "genero": "COMEDIA",
                "poster_url": "https://image.tmdb.org/t/p/w500/lRHE0vzf3dfxeffKkZZzid9meKo.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/7.jpg",
                "imdb_id": "tt2096673",
                "duracion_minutos": 95
            },

            # Drama
            {
                "titulo": "Titanic",
                "descripcion": "Una aristócrata de diecisiete años se enamora de un artista pobre pero amable a bordo del lujoso y desafortunado R.M.S. Titanic.",
                "fecha_lanzamiento": "1997-12-19",
                "genero": "DRAMA",
                "poster_url": "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/yDI6D5zqew3UZ7IDwvH5i5x3U9.jpg",
                "imdb_id": "tt0120338",
                "duracion_minutos": 194
            },
            {
                "titulo": "La La Land",
                "descripcion": "Mientras navegan por sus carreras en Los Ángeles, un pianista y una actriz se enamoran mientras intentan reconciliar sus aspiraciones para el futuro.",
                "fecha_lanzamiento": "2016-12-09",
                "genero": "DRAMA",
                "poster_url": "https://image.tmdb.org/t/p/w500/uDO8zWDhfWz76VXVsMhRSyFCNMw.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/qJeU7KM4nR2C1TuUta5GQg7Fh1h.jpg",
                "imdb_id": "tt3783958",
                "duracion_minutos": 128
            },
            {
                "titulo": "Whiplash",
                "descripcion": "Un joven baterista prometedor se inscribe en un conservatorio de música despiadado donde sus sueños de grandeza son guiados por un instructor que no se detendrá ante nada.",
                "fecha_lanzamiento": "2014-10-10",
                "genero": "DRAMA",
                "poster_url": "https://image.tmdb.org/t/p/w500/6uSPcdGNA2A6vJmCag5fQjm63NT.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg",
                "imdb_id": "tt2582802",
                "duracion_minutos": 106
            },
            {
                "titulo": "The Social Network",
                "descripcion": "Mientras el estudiante de Harvard Mark Zuckerberg crea el sitio de redes sociales que se convertiría en Facebook, es demandado por los gemelos que afirmaron que les robó su idea.",
                "fecha_lanzamiento": "2010-10-01",
                "genero": "DRAMA",
                "poster_url": "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eA4H2u3o2.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/k1NUAe.jpg",
                "imdb_id": "tt1285016",
                "duracion_minutos": 120
            },
            {
                "titulo": "Gladiator",
                "descripcion": "Un ex general romano se propone vengarse del emperador corrupto que asesinó a su familia y lo envió a la esclavitud.",
                "fecha_lanzamiento": "2000-05-05",
                "genero": "ACCION",
                "poster_url": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
                "backdrop_url": "https://image.tmdb.org/t/p/original/hGGC9gKo7CFE3fW07RA587e5kol.jpg",
                "imdb_id": "tt0172495",
                "duracion_minutos": 155
            }
        ]

        for p in peliculas_data:
            obj, created = Pelicula.objects.get_or_create(
                titulo=p['titulo'],
                defaults={
                    'descripcion': p.get('descripcion', 'Sin descripción'),
                    'fecha_lanzamiento': p['fecha_lanzamiento'],
                    'genero': p['genero'],
                    'tipo': 'movie',
                    'poster_url': p['poster_url'],
                    'backdrop_url': p['backdrop_url'],
                    'video_url': f"https://vidsrc.xyz/embed/movie?imdb={p['imdb_id']}",
                    'imdb_id': p['imdb_id'],
                    'duracion_minutos': p['duracion_minutos']
                }
            )
            if created:
                self.stdout.write(f"Película creada: {p['titulo']}")
            else:
                self.stdout.write(f"Película ya existe: {p['titulo']}")

        # 2. Series desde TVMaze (Bulk)
        self.stdout.write('Obteniendo series de TVMaze...')
        try:
            response = requests.get('https://api.tvmaze.com/shows')
            if response.status_code == 200:
                shows = response.json()
                count = 0
                for show in shows[:1000]: # Intentamos obtener hasta 1000 series
                    imdb_id = show.get('externals', {}).get('imdb')
                    if not imdb_id:
                        continue
                    
                    image_url = show.get('image', {}).get('medium') or show.get('image', {}).get('original')
                    if not image_url:
                        continue

                    # Mapeo de géneros simple
                    generos_tv = show.get('genres', [])
                    genero_db = 'DRAMA' # Default
                    if 'Action' in generos_tv or 'Adventure' in generos_tv:
                        genero_db = 'ACCION'
                    elif 'Comedy' in generos_tv:
                        genero_db = 'COMEDIA'
                    elif 'Science-Fiction' in generos_tv or 'Horror' in generos_tv:
                        genero_db = 'CIENCIA_FICCION'
                    
                    obj, created = Pelicula.objects.get_or_create(
                        titulo=show['name'],
                        defaults={
                            'descripcion': show.get('summary', '').replace('<p>', '').replace('</p>', '').replace('<b>', '').replace('</b>', '')[:500],
                            'fecha_lanzamiento': show.get('premiered') or '2000-01-01',
                            'genero': genero_db,
                            'tipo': 'series',
                            'poster_url': image_url,
                            'backdrop_url': image_url, # TVMaze no siempre da backdrop, usamos poster
                            'video_url': f"https://vidsrc.xyz/embed/tv?imdb={imdb_id}",
                            'imdb_id': imdb_id,
                            'duracion_minutos': show.get('runtime') or 45
                        }
                    )
                    if created:
                        count += 1
                self.stdout.write(self.style.SUCCESS(f'Se agregaron {count} series nuevas.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error obteniendo series: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Proceso de población finalizado correctamente.'))
