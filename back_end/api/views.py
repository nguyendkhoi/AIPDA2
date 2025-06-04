from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, status, viewsets
from .permissions import IsAnimateur, IsParticipant, IsAnimateurOwnerOrReadOnly, IsAdmin
from .serializers import UserSerializers, ProgrammeSerializers, RegistrationSerializers, UserProfileSerializers, UserCommunitySerializers, ProgrammeDetailSerializer
from .models import User, Programme, Registration
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.decorators import action


# Create your views here.
class UserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "Succes"}, status=status.HTTP_201_CREATED)

class LoginView(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        print(f"User {user.email} logged in successfully")
        token, created = Token.objects.get_or_create(user=user)

        response_data = {
            'token': token.key,
            'user': {
                'id': user.pk,
                'email': user.email,
                'role': user.role,
                'name': user.name,   
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class ProgrammeView(viewsets.ModelViewSet):
    queryset = Programme.objects.all().select_related('animateur')
    serializer_class = ProgrammeSerializers

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsAnimateur]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, (IsAdmin | IsAnimateurOwnerOrReadOnly)]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['add_participant', 'remove_participant']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'get_animateur_programmes':
            permission_classes = [IsAuthenticated, IsAnimateur]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(animateur=self.request.user)
        return Response(status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        programmes = Programme.objects.filter(status="confirmed")
        serializer = self.get_serializer(programmes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def register_for_programme(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if programme.current_participant_count >= programme.nb_participants_max:
             return Response({'status': 'Le programme est complet'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Registration.objects.filter(participant=user, programme=programme, status="inscrit"):
                        return Response({'status': 'Utilisateur déjà inscrit'}, status=status.HTTP_400_BAD_REQUEST)

        Registration.objects.get_or_create(participant=user, programme=programme, defaults={'status': 'inscrit'})
        return Response({'status': 'Inscription réussie'}, status=status.HTTP_201_CREATED)

        
    @action(detail=True, methods=['post'])
    def unregister_from_programme(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        try:
            registration = Registration.object.filter(participant=user, programme=programme)
            registration.status = "annule"
            registration.save()

            return Response({'status': 'Annule le programme successemet.'}, status=status.HTTP_200_OK)
        except registration.DoeNotExist:
            return Response({'stauts': "Vous ne vous êtes pas inscrit à ce programme ou vous l'avez déjà annulé."}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='animateur-programmes')
    def get_animateur_programmes(self, request):
        user = request.user
        programmes = self.get_queryset().filter(animateur=user)
        serializer = self.get_serializer(programmes, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        programme = self.get_object()
        programme.status='annule'
        programme.registrations.filter(statut__in=['inscrit', 'en_cours']).update(status='annule')
        return Response({"status": "Le programme a été annulé"}, status=status.HTTP_204_NO_CONTENT)
        
    def patch(self, request, pk=None):
        try:
            instance = self.get_object()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
             return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
             return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DetailedProgramView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    authentication_classes = [TokenAuthentication]
    serializer_class = ProgrammeDetailSerializer
    queryset = Programme.objects.all()

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "Token does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = UserProfileSerializers

    def get_object(self):
        return self.request.user
    
class RegistrationView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = RegistrationSerializers

    def get_queryset(self, request):
        user = self.request.user
        return Registration.objects.filter(participant=user).select_related("programme")

class UserCommunityView(APIView):    
    def get(self, request):
        users = User.objects.all()
        serializer = UserCommunitySerializers(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)