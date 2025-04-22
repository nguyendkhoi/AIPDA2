from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, status, viewsets, permissions
from .permissions import IsAnimateur, IsParticipant, IsAnimateurOwnerOrReadOnly, IsAnimateurOrParticipantReadOnly
from .serializers import UserSerializers, ProgrammeSerializers, RegistrationSerializers, UserProfileSerializers, ProgrammeSpecificSerializer, UserDetailSerializer
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

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
                'nom': user.nom,   
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class ProgrammeView(viewsets.ModelViewSet):
    queryset = Programme.objects.all().select_related('animateur').prefetch_related('participants') 
    serializer_class = ProgrammeSerializers

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsAnimateur]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsAnimateurOwnerOrReadOnly]
        elif self.action in ['add_participant', 'remove_participant']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'get_participant_programmes':
            permission_classes = [IsAuthenticated, IsParticipant]
        elif self.action == 'get_animateur_programmes':
            permission_classes = [IsAuthenticated, IsAnimateur]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated, IsAnimateurOrParticipantReadOnly]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(animateur=self.request.user)


    @action(detail=True, methods=['post'])
    def add_participant(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if programme.participants.count() >= programme.nb_participants_max:
             return Response({'status': 'Programme is full'}, status=status.HTTP_400_BAD_REQUEST)
        if user not in programme.participants.all():
            programme.participants.add(user)
            Registration.objects.get_or_create(participant=user, programme=programme, defaults={'statut': 'inscrit'})
            return Response({'status': 'Participant added'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'User already a participant'}, status=status.HTTP_400_BAD_REQUEST)

        
    @action(detail=True, methods=['post'])
    def remove_participant(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if(user in programme.participants.all()):
            programme.participants.remove(user)
            Registration.objects.filter(participant=user, programme=programme).delete()
            return Response({'status': 'Participant removed'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'User not a participant'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'], url_path='participant-programmes')
    def get_participant_programmes(self, request):
        user = request.user
        programmes = Programme.objects.filter(participants=user).select_related('animateur').prefetch_related('participants')
        
        serializer = ProgrammeSpecificSerializer(programmes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='animateur-programmes')
    def get_animateur_programmes(self, request):
        user = request.user
        programmes = self.get_queryset().filter(animateur=user)

        serializer = ProgrammeSerializers(programmes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'animateur':
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            programme = self.get_object()
            programme.registrations.update(statut='annule')
            self.perform_destroy(programme)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Programme.DoesNotExist:
            return Response({"error": "Programme not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def patch(self, request, pk=None):
        try:
            instance = self.get_object()
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
             return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
             return Response({"detail": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def get(self, request):
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        user = request.user
        serializer = UserProfileSerializers(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserProfileSerializers(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        registrations = Registration.objects.filter(participant=user)\
                                           .select_related('programme')
        serializer = RegistrationSerializers(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

