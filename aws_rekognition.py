import boto3  #AWS API connection
import os
import json  #to translate output in js

#hard coding path to .env to protect AWS keys
from dotenv import load_dotenv
dotenv_path = '/Users/carole/code/CaroleGendron/data_scapes/.env'
load_dotenv(dotenv_path)

# Now you can access the variables using os.getenv('variable_name')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

client = boto3.client(
    'rekognition',
    region_name='eu-west-2',  # update to your region (EU (london))
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

# Specify the image as bytes
with open('media/test_image3.png', 'rb') as image:
    image_bytes = image.read()

# P
# erform facial analysis
response = client.detect_faces(
    Image={'Bytes': image_bytes},
    Attributes=['ALL']
)
from collections import OrderedDict

# Get face details from the response
face_details = response['FaceDetails']

# Define a list of attributes to keep
attributes_to_keep = ["AgeRange", "Smile", "Gender", "Emotions"]

# Prepare dictionary for face attributes
face_attributes = {}

# Emotion to RGB color mapping
emotion_colors = {
    'ANGRY': (250, 5, 5),
    'HAPPY': (250, 250, 5),
    'SAD': (5, 5, 5),
    'CONFUSED': (5, 5, 250),
    'DISGUSTED': (250, 0, 125),
    'SURPRISED': (250, 125, 0),
    'CALM': (0, 250, 0),
    'FEAR': (125, 0, 250)
}

# Extract attributes of each face
for i, face in enumerate(face_details):
    face_dict = OrderedDict()
    for attribute, value in face.items():

        if attribute == "AgeRange":
            age_median = (value['Low'] + value['High']) / 2
            age_range = value['High'] - value['Low']

            # Define new_min and new_max for scaling
            new_min, new_max = 1, 10

            # Scale the values
            age_median_min, age_median_max = 12, 70
            scaled_age_median = ((age_median - age_median_min) / (age_median_max - age_median_min)) * (new_max - new_min) + new_min

            age_range_min, age_range_max = 0, 15
            scaled_age_range = ((age_range - age_range_min) / (age_range_max - age_range_min)) * (new_max - new_min) + new_min

            face_dict['Age_Median'] = scaled_age_median
            face_dict['Age_Range'] = scaled_age_range
            print(f"Age low: {value['Low'] }, Age high: {value['High']}")

        elif attribute == 'Smile':
            if value['Value'] == True:  # if Smile is True
                face_dict[attribute] = round(value['Confidence'])/10 # /10to fit painting scale
            else:  # if Smile is False
                face_dict[attribute] = round(100 - value['Confidence']) /10 # /10to fit painting scale
            print(f"Smile value: {value['Value']}, Confidence: {value['Confidence']}")

        elif attribute == 'Gender':
            if value['Value'] == 'Female':
                face_dict[attribute] = (100 -value['Confidence'] )/12 #12 to have more shape options
            elif value['Value'] == 'Male':
                face_dict[attribute] = ( value['Confidence'])/12
            print(f"Gender value: {value['Value']}, Confidence: {value['Confidence']},  DifConfidence: {(100 - value['Confidence']) / 100 * 10}")

        elif attribute == 'Emotions':
            # sort the emotions by confidence and get the two most confident
            most_confident_emotions = sorted(value, key=lambda x:x['Confidence'], reverse=True)[:2]
            colors = [emotion_colors[emotion['Type']] for emotion in most_confident_emotions]
            # Average the RGB values of the two most confident emotions
            average_color = tuple(sum(x)/len(x) for x in zip(*colors))
            face_dict['Average_Color'] = average_color

    # Reorder the dictionary as per your preference
    ordered_face_dict = OrderedDict([
        ('Age_Median', face_dict.get('Age_Median')),
        ('Smile', face_dict.get('Smile')),
        ('Gender', face_dict.get('Gender')),
        ('Age_Range', face_dict.get('Age_Range')),
        ('Average_Color', face_dict.get('Average_Color')),
    ])

    face_attributes[f'Face_{i+1}'] = ordered_face_dict

print('Emotions',most_confident_emotions)

#------//Translating output in json for js usage//-----------

# Convert face_attributes to JSON string
face_attributes_json = json.dumps(face_attributes)

# Write JSON string to a file (in file list)
with open('output.json', 'w') as json_file:
    json_file.write(face_attributes_json)


# Print the JSON string
print(face_attributes_json)
