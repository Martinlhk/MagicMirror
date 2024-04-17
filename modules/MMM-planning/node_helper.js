var NodeHelper = require("node_helper");
var {PythonShell} = require('python-shell');

module.exports = NodeHelper.create({
  start: function () {
    this.pythonScript();
  },
  pythonScript: function () {
    var options = {
        pythonPath: '/home/miroir/MirrorPyEnv/bin/python3', // le chemin de votre environnement virtuel Python avec selenium installé
        scriptPath: '/home/miroir/MagicMirror/modules/MMM-planning/hyperplanning.py', // le chemin du script Python
        //args: ['argument1', 'argument2'] // Si votre script Python nécessite des arguments, vous pouvez les ajouter ici.
    };
    let pyshell = new PythonShell('hyperplanning.py', options);
    pyshell.on('message', (message) => {
      // message est une ligne de sortie du script Python
      console.log(message)
      let cours = JSON.parse(message);
      this.sendSocketNotification('PYTHON_DATA', cours);
    });
    pyshell.end((err,code,signal) => {
      if (err) throw err;
    });
  }
});
