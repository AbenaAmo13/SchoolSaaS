import uuid
import random
import string
from core.models import School

def generate_license_key(length=16, segments=4):
    """
    Generate a unique license key.

    :param length: Total length of the license key excluding separators.
    :param segments: Number of segments in the license key.
    :return: Formatted license key.
    """
    # Generate a random unique identifier
    base_key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
    # Split the key into segments
    segment_length = length // segments
    license_key = '-'.join(base_key[i:i + segment_length] for i in range(0, length, segment_length))
    
    return license_key 

def add_license_key():
    """Generate a unique key and ensure no duplication in the database."""
    while True:
        key = generate_license_key()
        try:
            exists = School.objects.filter(license_key = key).exist()
            if exists:
                continue
            return key  
        except Exception as e:
            continue


def check_code_exists(school_code, db):
    # Check if the code already exists in the database
    return school_code in db

def generate_unique_school_code(length=8):
    """
    Generates a unique school code using timestamp and random characters.
    """
    timestamp = str(int(time.time()))[-4:]  # Last 4 digits of current timestamp
    random_str = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length - 4))
    return random_str + timestamp
def generate_unique_school_code_with_check():
    """
    Generates a unique school code using timestamp and random characters 
    Checks if it already exists
    """
    unique_code = generate_unique_school_code()
    while True:
        exists = School.objects.filter(unique_school_code=unique_code).exist()
        print(exists)
        if exists:
            continue
        return unique_code


