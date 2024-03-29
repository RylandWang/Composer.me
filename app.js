
const Application = function () {
  this.tuner = new Tuner()
  this.notes = new Notes('.notes', this.tuner)
  this.meter = new Meter('.meter')
  this.update({ name: 'A', frequency: 440, octave: 4, value: 69, cents: 0 })
}

Application.prototype.start = function () {
  const self = this

  this.tuner.onNoteDetected = function (note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note)
      } else {
        self.lastNote = note.name
      }
    }
  }

  swal('Welcome to Composer.Me! This application automatically generates sheet notes based on music you play in real time. Please ensure you are in a quiet environment with a working microphone.').then(function () {
    self.tuner.init()
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)
  })


  if (!/Android/i.test(navigator.userAgent)) {
    this.updateFrequencyBars()
  }
}

Application.prototype.updateFrequencyBars = function () {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData)
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
}

Application.prototype.update = function (note) {
  this.notes.update(note)
  this.meter.update((note.cents / 50) * 45)
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function () {
  this.notes.toggleAutoMode()
}

const app = new Application()
app.start()
