from django.urls import path
from . import views

urlpatterns= [
    # User related views
    path('inscription/', views.UserView.as_view(), name='inscription'),
    path('login/', views.LoginView.as_view(), name='login'),
    path("user/", views.ProfileView.as_view(), name="user_profile"),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    # User related views
    path('user/community', views.UserCommunityView.as_view(), name='user_community'),
    # Programme related views
    # Path for listing programmes (GET)
    path('programme/', views.ProgrammeView.as_view({'get': 'list'}), name='programme_list'),
    # Path for creating programmes (POST)
    path('programme/create/', views.ProgrammeView.as_view({'post': 'create'}), name='create_programme'),
    # Path for updating and deleting programmes (PUT, PATCH, DELETE)
    path('programme/<int:pk>/', views.ProgrammeView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='programme_detail'),

    # Custom actions for ProgrammeView
    path('programme/<int:pk>/add_participant/', views.ProgrammeView.as_view({'post': 'register_for_programme'}), name='register_for_programme'),
    path('programme/<int:pk>/remove_participant/', views.ProgrammeView.as_view({'post': 'unregister_from_programme'}), name='unregister_from_programme'),
    path('programme/participant_programmes/', views.ProgrammeView.as_view({'get': 'get_participant_programmes'}), name='get_participant_programmes'),
    path('programme/animateur_programmes/', views.ProgrammeView.as_view({'get': 'get_animateur_programmes'}), name='get_animateur_programmes'),

    # Registration view
    path('registrations/', views.RegistrationView.as_view(), name='registration'),
]