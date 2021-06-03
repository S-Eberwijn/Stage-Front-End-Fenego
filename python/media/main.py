import os
import sys
os.system('python -m pip install {}'.format(sys.argv[1]))
os.system('python -m pip install {}'.format(sys.argv[2]))
os.system('python -m pip install {}'.format(sys.argv[3]))
import mediapipe as mp
import cv2
import win32api, win32con




mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

cap = cv2.VideoCapture(1)
with mp_hands.Hands(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as hands:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            # If loading a video, use 'break' instead of 'continue'.
            continue

        # Flip the image horizontally for a later selfie-view display, and convert
        # the BGR image to RGB.
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        image.flags.writeable = False
        results = hands.process(image)

        # Draw the hand annotations on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        if results.multi_hand_landmarks:
            # if results.multi_hand_landmarks[0]:
            # print(results.multi_hand_landmarks[0][5])

            for hand_landmarks in results.multi_hand_landmarks:
                indexX = int(hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * 2000)
                indexY = int(hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * 1000)

                win32api.SetCursorPos((indexX, indexY))
                mp_drawing.draw_landmarks(
                    image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
        cv2.imshow('MediaPipe Hands', image)
        if cv2.waitKey(5) & 0xFF == 27:
            break
cap.release()
