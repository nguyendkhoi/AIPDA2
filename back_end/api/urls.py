from django.urls import path
from . import views

urlpatterns= [
    path('inscription/', views.UserView.as_view()),
    path('login/', views.LoginView.as_view(), name='login'),
    path('create_programme/', views.ProgrammeView.as_view({'post': 'create'}), name='create_programme'),
    path('programme/<int:pk>/add_participant/', views.ProgrammeView.as_view({'post': 'add_participant'}), name='add_participant'),
    path('programme/<int:pk>/remove_participant/', views.ProgrammeView.as_view({'post': 'remove_participant'}), name='remove_participant'),
    path('programme/participant_programmes/', views.ProgrammeView.as_view({'get': 'get_participant_programmes'}), name='get_participant_programmes'),
    path('programme/animateur_programmes/', views.ProgrammeView.as_view({'get': 'get_animateur_programmes'}), name='get_animateur_programmes'),
    path('programme/', views.ProgrammeView.as_view({'get': 'list'}), name='programme_list'),
    path('programme/<int:pk>/', views.ProgrammeView.as_view({'delete': 'destroy'}), name='delete_programme'),
    path('programme/<int:pk>/', views.ProgrammeView.as_view({'patch': 'partial_update'}), name='update_programme'),
    path('registrations/', views.RegistrationView.as_view(), name='registration'),
    path("user/", views.ProfileView.as_view(), name="user"),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]