#!home/miroir/MirrorPyEnv/bin/python3

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import time
import json
from selenium.webdriver.chrome.options import Options
import sys

#pour exetuter le code à distance
from pyvirtualdisplay import Display
display = Display(visible=0, size=(800, 800))
display.start()

#pour ne pas afficher la fenêtre du navigateur
chrome_options = Options()
chrome_options.add_argument("--headless")


#pour interagir avec le site web 
#il faut télécharger le chromedriver dispponible pour raspberry pi disponible sur internet au préalable. celui-ci à été stocker hors des fichier du projet
#à l'emplacement : /usr/lib/chromium-browser/chromedriver
service = Service(executable_path = "/usr/lib/chromium-browser/chromedriver")

driver = webdriver.Chrome(service=service)#, options=chrome_options)

driver.get("https://hplanning2023.umons.ac.be/invite")

#on crée un tableau qui va stocker toutes les formations
formation = []


#pour pouvoir choisir le cours voulu => on attend jusqu'à ce que la page soit chargée et on sélectionne
edit_button = WebDriverWait(driver, 5).until(
    EC.presence_of_element_located((By.ID, f"GInterface.Instances[1].Instances[1].bouton_Edit"))
)
edit_button.click()

i = 0
test = 1

while True:
    try:
        # Attendre que l'élément du cours soit présent sur la page
        course_element = WebDriverWait(driver, 0.1).until(
            EC.presence_of_element_located((By.ID, f"GInterface.Instances[1].Instances[1]_{i}"))
        )
        formation.append(course_element.text)
        i += 1

    except Exception:
        # Si l'attente échoue, faire défiler la page jusqu'à un autre élément atteignable
        try:
            element = driver.find_element(By.ID, f"GInterface.Instances[1].Instances[{i+1}]_{10*test}")
            driver.execute_script("arguments[0].scrollIntoView();", element)
            test +=1
        except Exception:
            # Si l'élément n'existe pas, arrêter la boucle
            break

print(formation)
driver.quit()

    

#print(json.dumps([cours.to_dict() for cours in liste_cours]))
print(formation)
#time.sleep(5)
driver.quit()

# display.stop()