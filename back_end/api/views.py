from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status, viewsets, permissions
from .serializers import UserSerializers, ProgrammeSerializers, RegistrationSerializers, UserProfileSerializers, ProgrammeSpecificSerializer
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

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data) 
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  # Log validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        print("Response data:", serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        print("Request login data:", request.data)
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
                'user_metadata': {
                    'name': user.nom,   
                }
            }
        }
        print("Response login data:", response_data) 

        return Response(response_data, status=status.HTTP_200_OK)
    
class ProgrammeView(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializers

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != 'animateur':
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer.save(animateur=user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_participant(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if(user not in programme.participants.all()):
            programme.participants.add(user)
            return Response({'status': 'Participant added'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'User already a participant'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_participant(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if(user in programme.participants.all()):
            programme.participants.remove(user)
            return Response({'status': 'Participant removed'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'User not a participant'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_participant_programmes(self, request):
        user = request.user
        programmes = Programme.objects.none()
        if not user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role == 'participant':
            programmes = Programme.objects.filter(participants=user)
        else:
            return Response({"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProgrammeSpecificSerializer(programmes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_animateur_programmes(self, request):
        # Print authentication information for debugging
        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User: {request.user}")
        
        user = request.user
        programmes = Programme.objects.none()
        
        if not user.is_authenticated:
            print("User not authenticated")
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        print(f"User role: {getattr(user, 'role', 'No role attribute')}")
        
        if getattr(user, 'role', None) == 'animateur':
            programmes = Programme.objects.filter(animateur=user)
            print(f"Found {programmes.count()} programmes for animateur")
        else:
            print(f"Invalid role or no role attribute")
            return Response({"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProgrammeSerializers(programmes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        print("Logout request received")
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
        serializer = UserSerializers(user)
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
        registrations = Registration.objects.filter(participant=user)
        serializer = RegistrationSerializers(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

