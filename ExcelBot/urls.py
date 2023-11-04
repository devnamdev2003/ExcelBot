from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.contrib.staticfiles.urls import static
from api import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/postdata/', views.user_input, name='user_input'),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
