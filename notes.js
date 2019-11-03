const Notes = function (selector, tuner) {
  this.tuner = tuner
  this.isAutoMode = true
  this.$root = document.querySelector(selector)
  this.$notesList = this.$root.querySelector('.notes-list')
  this.$frequency = this.$root.querySelector('.frequency')
  this.$dot = this.$root.querySelector('.dot')
  this.$notes = []
  this.$notesMap = {}
  this.createNotes()
}

Notes.prototype.createNotes = function () {
  const minOctave = 2
  const maxOctave = 5
  for (var octave = minOctave; octave <= maxOctave; octave += 1) {
    for (var n = 0; n < 12; n += 1) {
      const $note = document.createElement('div')
      $note.className = 'note'
      $note.dataset.name = this.tuner.noteStrings[n]
      $note.dataset.value = 12 * (octave + 1) + n
      $note.dataset.octave = octave.toString()
      $note.dataset.frequency = this.tuner.getStandardFrequency(
        $note.dataset.value
      )
      $note.innerHTML =
        $note.dataset.name[0] +
        '<span class="note-sharp">' +
        ($note.dataset.name[1] || '') +
        '</span>' +
        '<span class="note-octave">' +
        $note.dataset.octave +
        '</span>'
      this.$notesList.appendChild($note)
      this.$notes.push($note)
      this.$notesMap[$note.dataset.value] = $note
    }
  }

  const self = this
  this.$notes.forEach(function ($note) {
    $note.addEventListener('click', function () {
      if (self.isAutoMode) {
        return
      }

      const $active = self.$notesList.querySelector('.active')
      if ($active === this) {
        self.tuner.stop()
        $active.classList.remove('active')
      } else {
        self.tuner.play(this.dataset.frequency)
        self.update($note.dataset)
      }
    })
  })
}

Notes.prototype.active = function ($note) {
  this.clearActive()
  $note.classList.add('active')
  this.$notesList.scrollLeft =
    $note.offsetLeft - (this.$notesList.clientWidth - $note.clientWidth) / 2
}

Notes.prototype.clearActive = function () {
  const $active = this.$notesList.querySelector('.active')
  if ($active) {
    $active.classList.remove('active')
  }
}

Notes.prototype.update = function (note) {
  if (note.value in this.$notesMap) {
    this.active(this.$notesMap[note.value])

    //account for half notes
    const cleftMapping = {
      0: 0,
      1: 0, //c#
      2: 1,
      3: 1, //d#
      4: 2,
      5: 3,
      6: 3, //f#
      7: 4,
      8: 4, //g#
      9: 5,
      10: 5, //a#
      11: 6
    }

    // if bass cleft
    var offset = 34.2
    var updateYPosition = (34.2 - cleftMapping[note.value % 12]).toString() + "%";
    // if trebble cleft
    if (note.value >= 60) {
      offset = 14.1
    }

    // update dot position in cleft in real time
    var updateYPosition = (offset - cleftMapping[note.value % 12]).toString() + "%";

    //append to output array
    this.tuner.notesPlayed.push(this.tuner.noteStrings[note.value % 12])
    document.getElementById("dot").style.marginTop = updateYPosition;
  }
}

Notes.prototype.toggleAutoMode = function () {
  if (this.isAutoMode) {
    this.clearActive()
  }
  this.isAutoMode = !this.isAutoMode
}
