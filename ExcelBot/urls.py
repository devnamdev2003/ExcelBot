from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.contrib.staticfiles.urls import static

urlpatterns = [
    path("admin/", admin.site.urls)
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
