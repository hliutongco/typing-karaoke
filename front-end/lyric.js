const lyricStore = []

class Lyric {
  constructor(object){
    this.id = object.id
    this.song_id = object.song_id
    this.start = object.start
    this.duration = object.duration
    this.content = object.content

    lyricStore.push(this)
  }

  static getLyrics(){
    fetch('http://localhost:3000/api/v1/lyrics')
    .then(response => response.json())
    .then(data => {
      data.forEach((object) => {
        new Lyric(object)
      })
    })
  }
}
