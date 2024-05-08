const NodeHelper = require("node_helper");
const { exec } = require("child_process");


module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    
    socketNotificationReceived: function(notification, payload) {

        if (notification === 'VOICE_TEXT') {

            console.log("lance voicecontrole")
            this.voiceControlProcess = exec(`/home/miroir/MirrorPyEnv/bin/python3 ./modules/MMM-voice_control/voice_control.py `, (error, stdout, stderr) => {

                if (error) {
                    console.error(`Erreur d'exécution du script Python: ${error}`);
                    return;
                }
                
                console.log("La sortie est :", stdout);

                this.sendSocketNotification('DISPLAY_TEXT', stdout);
            });
        }

        if (notification === 'demande_formation'){
            console.log("choix formation", payload)
            console.log("lance voicecontrole pour formation")

            exec(`/home/miroir/MirrorPyEnv/bin/python3 ./modules/MMM-voice_control/choix_formation.py `, (error, stdout, stderr) => {

                if (error) {
                    console.error(`Erreur d'exécution du script Python: ${error}`);
                    return;
                }
                
                console.log("La sortie est :", stdout);

                this.sendSocketNotification('CHOIX_FORMATION', stdout.trim());

            });
        }

        if (notification === 'validation_formation'){
            console.log("verification formation", payload)
            console.log("lance voicecontrole pour validation")

            exec(`/home/miroir/MirrorPyEnv/bin/python3 ./modules/MMM-voice_control/valider.py `, (error, stdout, stderr) => {

                if (error) {
                    console.error(`Erreur d'exécution du script Python: ${error}`);
                    return;
                }
                
                console.log("La sortie est :", stdout);

                this.sendSocketNotification('VALIDATION', stdout.trim());

            });
        }

        if (notification === 'STOP_VOICE_TEXT') {
            console.log("demande d'arret du contole vocal")

            // Définir un intervalle pour vérifier si le processus de contrôle vocal est en cours toutes les secondes
            let intervalId = setInterval(() => {
                if (this.voiceControlProcess) {
                    // Si un processus est en cours, le tuer
                    this.voiceControlProcess.kill('SIGINT');
                    console.log("Arrêt du contrôle vocal");

                    // Arrêter de vérifier
                    clearInterval(intervalId);
                }
            }, 1000); // 1000 millisecondes = 1 seconde

            // Arrêter de vérifier après 7 secondes, même si le processus de contrôle vocal n'a pas été trouvé
            setTimeout(() => {
                clearInterval(intervalId);
            }, 7000); // 7000 millisecondes = 7 secondes
        }
    },

});
