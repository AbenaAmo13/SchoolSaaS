# authentication_backend/management/commands/init_data.py
from django.core.management.base import BaseCommand
from core.models import ApplicationModules

class Command(BaseCommand):
    help = 'Initialize default data'

    def handle(self, *args, **kwargs):
        modules= ['Reporting', 'Billing']
        for module in modules:
            if not ApplicationModules.objects.filter(name=module).exists():
                ApplicationModules.objects.create(name=module)
                self.stdout.write(self.style.SUCCESS(f'Module {module} created.'))
            else:
                self.stdout.write('Default Module Exists already exists.')
