from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def subject(request, subject):
    return HttpResponse(f'{subject}')