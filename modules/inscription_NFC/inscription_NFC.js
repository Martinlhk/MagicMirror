Module.register("inscription_NFC", {
  start: function() {
    //on ne peut mettre qu'une seule variable avec this ici, donc utilisation de l'objet userDetails
    this.userDetails = {
      NFCid: null,
      annee: null,
      formation: null,
      formations: null
      // Ajoutez d'autres propriétés ici si nécessaire
    };
    console.log("Starting module: " + this.name);
  },
  
  socketNotificationReceived: function(notification, payload) {
    let wrapper = document.getElementById('inscription_NFC');
    console.log("inscription_NFC received a socket notification: " + notification);
    
    
    if (notification === 'retour_annee'){
      let redemander = false;
      // on verifie la réponse de l'utilisateur et on agit en fonction
      console.log("[demande_annee] La sortie est :", payload.sortie);
      if (payload.sortie.includes("1") || payload.sortie.includes("un")){
          annee = "BAB1";
      }else if (payload.sortie.includes("2") || payload.sortie.includes("deux")){
          console.log("2 ou deux trouvé");
          annee = "BAB2";
          console.log(annee);
      }else if (payload.sortie.includes("3") || payload.sortie.includes("trois")){
          annee = "BAB3";
      }else if (payload.sortie.includes("4") || payload.sortie.includes("quatre")){
          annee = "MA1";
      }else if (payload.sortie.includes("5") || payload.sortie.includes("cinq")){
          annee = "MA2";
      }else if (payload.sortie.includes("annuler")){
          console.log("annuler trouvé");
          this.hide();
      
      }else{
          console.log("redemander annee send");
          redemander = true;
          this.sendSocketNotification('ecouter', {suivant : 'retour_annee'});
        setTimeout(() => {
          let html = "<h1>Je n'ai pas compris, veuillez répéter.</h1>";
          html += `<h1> Dites "formation" suivie du numéro associé à votre année d'étude ou "annuler" pour arrêter</h1>`;
          html += `<p>(1) BAB1<br>(2) BAB2<br>(3) BAB3<br>(4) MA1<br>(5) MA2</p>`;
          wrapper.innerHTML = html;
        }, 2000);
      }
      if (redemander === false){
        let html = `Vous avez choisi : ${annee}`;
        wrapper.innerHTML = html;
        this.userDetails.annee = annee; 
        this.sendSocketNotification('lecture_fichier_formations', {annee : annee});
      }
    }

    if (notification === 'choix_formations'){
      this.userDetails.formations = payload.formations;
      let html = '';
      html = `<h1> Dites le numéro de votre formation pour l'année ${payload.annee} ou "annuler" pour arrêter</h1>`;
      for (let formation of payload.formations){
          html += `<p>(${formation.id}) ${formation.formation}<br></p>`;
      }
      
      wrapper.innerHTML = html;
      this.sendSocketNotification('ecouter', {suivant : "retour_formation"});

    }

    if (notification === 'retour_formation'){
      let redemander = false;
      console.log("[demande_formation] La sortie est :", payload.sortie);
      let formation = null;
      //min et max index formations de cette année 
      let minIndexValue = this.userDetails.formations[0].id;
      console.log(minIndexValue);
      let maxIndexValue = this.userDetails.formations[this.userDetails.formations.length - 1].id;
      console.log(maxIndexValue);
      for (let i = minIndexValue; i <= maxIndexValue; i++ ){
        console.log("index",i);
        let index = i.toString();
        console.log("payload.sortie",payload.sortie);
          if (payload.sortie.includes(index)){
              formation = i;
              redemander = false;
              break;
          }else{
              redemander = true;
          }
      }
      if (redemander === true){
          console.log("redemander formation send");
          redemander = true;
          this.sendSocketNotification('ecouter', {suivant : 'retour_formation'});
          setTimeout(() => {
            let html = "<h1>Je n'ai pas compris, veuillez répéter.</h1>";
            html += `<h1> Dites le numéro de votre formation pour l'année ${this.userDetails.annee} ou "annuler" pour arrêter</h1>`;
            for (let form of this.userDetails.formations){
                html += `<p>(${form.id}) ${form.formation}<br></p>`;
            }
            wrapper.innerHTML = html;
          }, 2000);
            
      }else{
        let html = `Vous avez choisi : ${formation}`;
        wrapper.innerHTML = html;
        this.userDetails.formation = formation;
        this.sendSocketNotification('lecture_fichier_options', this.userDetails.formation);
      }
    }
    
  
  },
  notificationReceived: function(notification, payload) {
    let wrapper = document.getElementById('inscription_NFC');
    console.log(this.name + ' notification :' + notification);

    function waiting() {
      let points = '';
      wrapper.innerHTML = `<h1>Patientez<br>.</h1>`;
      for (let i = 0; i < 3; i++){
          setTimeout(() => {
              points += '.';
              if (points === '...'){
                  points = '.';
              }
              wrapper.innerHTML = `<h1>Patientez<br>${points}</h1>`;
          },i * 400);
      }
    }
    

    // quand la notification depuis le module MMM-planning est "SETUP_BADGE", on lance l'enregistrement d'un nouvel utilisateur
    if (notification === 'SETUP_BADGE'){
      console.log(payload);

      //quand on a la valeur du nouveau badge à enregistrer
      this.userDetails.NFCid = payload.badge;
      this.show(); //affichage du module donc execution de resume() 

      waiting();

      // on envoie une notification au node_helper pour demander l'année d'étude de l'utilisateur
      this.sendSocketNotification('ecouter', {suivant : 'retour_annee'});
      setTimeout(() => {
        let html = `<h1> Dites "formation" suivie du numéro associé à votre année d'étude ou "annuler" pour arrêter</h1>`;
        html += `<p>(1) BAB1<br>(2) BAB2<br>(3) BAB3<br>(4) MA1<br>(5) MA2</p>`;
        wrapper.innerHTML = html;
      }, 1700);
      
    }
    
  },
  



  resume: function() {
    this.sendNotification("HIDE_VOICE_CONTROL", {});
    console.log("demande arret voice control")

  },
  suspend: function() {
    this.sendNotification("SHOW_VOICE_CONTROL", {});
    console.log("demande relancement voice control")
  },
  getDom: function() {
      let wrapper = document.createElement("div");
      wrapper.id = "inscription_NFC";
      wrapper.innerHTML = "<h1>Inscription nouvel utilisateur</h1>";
      return wrapper;
  }
});