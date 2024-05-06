Module.register("MMM-NFC", {
    start: function() {
        this.NFCid = null;
        this.sendSocketNotification('START_NFC', {});
        console.log("Starting module: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'NFC') {
            console.log("badge connu", payload);
            this.NFCid = payload;
            wrapper.innerHTML = "<h1>En attente des données</h1>";
            this.sendNotification('START_PLANNING', {NFCid : this.NFCid});
        }
        
        if (notification === 'NOT_NFC') {
            console.log("pas de badge connu");
            this.NFCid = payload;
            wrapper.innerHTML = "<h1>pas de badge connu</h1>";
            this.sendNotification('START_NFC', {});
            this.sendNotification('STOP_VOICE_TEXT', {});
            this.sendNotification('SETUP_BADGE', {payload});
        }
    },

    notificationReceived: function(notification, payload) {
        if (notification === 'START_NFC'){
            console.log("start nfc depuis autre module", payload)
            this.sendSocketNotification('START_NFC', {});
        }
    },

    getDom: function() {
        console.log("dom1");
        let wrapper = document.createElement("div");
        wrapper.id = "MMM-NFC";
        wrapper.innerHTML = "<h1>ici test nfc </h1>";
        return wrapper;
    }
});