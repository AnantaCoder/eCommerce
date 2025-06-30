from datetime import timedelta
import environ
from decouple import config
from pathlib import Path
import base64,json
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialise environment variables
env = environ.Env(DEBUG=(bool, False))
# Read the .env file
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# SECURITY
DEBUG = env("DEBUG", default=False)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "accounts",
    "store",
    "payments",
    "support",
    "channels",
    
]
# asgi config 
ASGI_APPLICATION = "backend.asgi.application"
CHANNEL_LAYERS={
    'default':{
        "BACKEND":'channels_redis.core.RedisChannelLayer',
        "CONFIG":{
            'hosts': [('127.0.0.1', 6379)] 
            }
        }
    }


# AI MODEL CONFIGURATION 
AI_BASE_URL = env("AI_BASE_URL")
AI_MODEL_API_KEY=env("AI_MODEL_API_KEY")
AI_MODEL_NAME=env("AI_MODEL_NAME")
MAX_TOKENS=env("MAX_TOKENS")
TEMPERATURE=env("TEMPERATURE")   
        

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# Configure CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  
    "http://localhost:5173",
    "http://192.168.1.34:5173",
    "https://e-commerce-taupe-rho.vercel.app"
]

# frontend connection email 
FRONTEND_URL = env("FRONTEND_URL", default="https://e-commerce-taupe-rho.vercel.app/")

# stripe payment 
STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = env('STRIPE_PUBLISHABLE_KEY')
STRIPE_WEBHOOK_SECRET=env('STRIPE_WEBHOOK_SECRET')


# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels.layers.InMemoryChannelLayer"
#     }
# }

# redis based channel layer 
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    },
}
ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {"default": env.db_url("DATABASE_URL")}->LOCALE

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
        
    }
}
try:
    anon_key_parts = env('SUPABASE_ANON_KEY').split('.')
    if len(anon_key_parts) > 1:
        # Pad the base64 string if its length is not a multiple of 4
        padded_payload = anon_key_parts[1] + '=' * (4 - len(anon_key_parts[1]) % 4)
        decoded_payload = base64.urlsafe_b64decode(padded_payload).decode('utf-8')
        anon_key_data = json.loads(decoded_payload)
        supabase_project_ref = anon_key_data.get('ref')
        if supabase_project_ref:
            SUPABASE_URL = f"https://{supabase_project_ref}.supabase.co"
        else:
            SUPABASE_URL = "" # Fallback if ref not found
            print("Warning: Could not extract project reference from SUPABASE_ANON_KEY. Set SUPABASE_URL manually if issues persist.")
    else:
        SUPABASE_URL = "" # Fallback if anon key format is unexpected
        print("Warning: SUPABASE_ANON_KEY format is unexpected. Set SUPABASE_URL manually if issues persist.")
except Exception as e:
    SUPABASE_URL = "" # Fallback on error
    print(f"Error parsing SUPABASE_ANON_KEY for URL: {e}. Set SUPABASE_URL manually if issues persist.")

# Map SUPABASE_KEY to the anon key from your .env
SUPABASE_KEY = env('SUPABASE_ANON_KEY')

# Map SUPABASE_BUCKET_NAME to BUCKET_NAME from your .env
SUPABASE_BUCKET_NAME = env('BUCKET_NAME')

# Note: SUPABASE_SECRET_KEY and SUPABASE_ACCESS_KEY from your .env are not directly
# used by the public Supabase Python client for simple uploads.
# They are typically for service role authentication or S3-compatible access.

# Media settings for handling file uploads (kept this)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')




# # payments 
# STRIPE_PUBLISHABLE_KEY = env('STRIPE_PUBLISHABLE_KEY')
# STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')
# STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET')

# pagination 




# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
AUTH_USER_MODEL = "accounts.User"

# default authentication classes

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",  # This makes all views require authentication by default
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=3),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "UPDATE_LAST_LOGIN": True,
}
# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Email settings (configure based on your email provider)
# Email (SMTP) configuration
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER