from django.shortcuts import render, HttpResponse

recipes = [{
    'author': 'Dom',
    'title': 'meeatball sub',
    'direactions':'combine all ingredients',
    'date_posted':'May 12, 2022'
},
{
    'author': 'Dom',
    'title': 'meeatball sub',
    'direactions':'combine all ingredients',
    'date_posted':'May 12, 2022'
},
{
    'author': 'Dom',
    'title': 'meeatball sub',
    'direactions':'combine all ingredients',
    'date_posted':'May 12, 2022'
}
]
# Create your views here.
def home(request):
    context =  {
        'recipes': recipes
    }
    return render(request,'SmartBytes/home.html',context)
def about(request):
    return render(request,'SmartBytes/about.html',{'title':'About Us page'})
