from django.db import connection
print(connection.settings_dict)

# Try querying:
with connection.cursor() as cursor:
    cursor.execute("SELECT 1;")
    print(cursor.fetchone())
