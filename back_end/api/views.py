from django.shortcuts import render
from rest_framework import generics, status, viewsets, permissions
from .serializers import UserSerializers, ProgrammeSerializers
from .models import User, Programme
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
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

        if not user_name:
             user_name = user.get_username()
             print(f"Using fallback name '{user_name}' for user {user.pk}")


        response_data = {
            'token': token.key,
            'user': {
                'id': user.pk,
                'email': user.email,
                'user_metadata': {
                    'name': user_name
                }
            }
        }
        print("Response login data:", response_data) 

        return Response(response_data, status=status.HTTP_200_OK)
    
class ProgrammeView(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializers

    def perform_create(self, serializer):
        try:
            id_animateur = self.request.data.get('id_animateur')
            if not id_animateur:
                return Response({"error": "id_animateur is required."}, status=status.HTTP_400_BAD_REQUEST)
            animateur = User.objects.get(pk=id_animateur)
            serializer.save(animateur=animateur)
        except User.DoesNotExist:
            return Response({"error": "Animateur not found."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "id not found"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_participant(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if(user not in programme.participants.all()):
            programme.participants.add(user)
            return Response({'status': 'Participant added'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'User already a participant'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def remove_participant(self, request, pk=None):
        programme = self.get_object()
        user = request.user

        if(user in programme.participants.all()):
            programme.participants.remove(user)
            return Response({'status': 'Participant removed'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'User not a participant'}, status=status.HTTP_400_BAD_REQUEST)
    

