from django.urls import path
from . import views

urlpatterns= [
    path('inscription/', views.UserView.as_view()),
    path('login/', views.LoginView.as_view(), name='login'),
    path('create_programme/', views.ProgrammeView.as_view({'post': 'create'}), name='create_programme'),
    path('programme/<int:pk>/add_participant/', views.ProgrammeView.as_view({'post': 'add_participant'}), name='add_participant'),
    path('programme/<int:pk>/remove_participant/', views.ProgrammeView.as_view({'post': 'remove_participant'}), name='remove_participant'),
]