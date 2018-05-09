document.addEventListener("DOMContentLoaded", function(){

  const headerDiv = document.getElementById('header')
  const chooseSongDiv = document.getElementById('choose-song')
  const lyricContainer = document.getElementById('lyric-container')
  const song = document.getElementById('audio')
  const video = document.getElementById('video')
  const strikesDiv = document.getElementById('strikes')
  const scoreDiv = document.getElementById("score-div")
  const pressStart = document.getElementById('press-start')
  const chooseSongH2 = document.getElementById('choose-song-h2')
  const roarH2 = document.getElementById('choose-roar')
  const everlongH2 = document.getElementById('choose-everlong')
  const wonderfulWorldH2 = document.getElementById('choose-wonderful-world')

  let counter = -1
  let gameOver = false
  let videoSrc
  let songSrc
  let lyrics
  let delay

  document.addEventListener('keydown', songMenu)

  function songMenu(event){
    if(event.which === 13){
      document.removeEventListener('keydown', songMenu)
      pressStart.classList.add('hidden')
      chooseSongDiv.classList.remove('hidden')
      document.addEventListener('keydown', menuSelect)
    }
  }

  function menuSelect(event){
    const array = [wonderfulWorldH2, everlongH2, roarH2]
    const mp3Src = ['mp3s/what-a-wonderful-world.mp3', 'mp3s/everlong.mp3', 'mp3s/Roar.mp3']
    const currentTimeArr = [6, 34, 66]

    // if user presses down
    if(event.which === 40){
      if(counter > 1){
        return
      }
      else if(counter === -1){
        counter += 1
        array[counter].classList.add('bg')
        song.src = mp3Src[counter]
        song.currentTime = currentTimeArr[counter];
        song.play()
      }
      else {
        array[counter].classList.remove('bg')
        song.pause()
        counter += 1

        array[counter].classList.add('bg')
        song.src = mp3Src[counter]
        song.currentTime = currentTimeArr[counter];
        song.play()
      }
    }
    // if user presses up
    else if(event.which === 38){
      if(counter < 1){
        return
      }
      else {
      array[counter].classList.remove('bg')
      song.pause()
      counter -= 1

      array[counter].classList.add('bg')
      song.src = mp3Src[counter]
      song.currentTime = currentTimeArr[counter];
      song.play()
      }
    }
    else if(event.which === 13){
      if(!array[counter]){
        return
      }

      song.pause()
      array[counter].classList.remove('bg')
      document.removeEventListener('keydown', menuSelect)
      chooseSong(array[counter].id)
    }
  }

  function chooseSong(id){
    if(id === 'choose-roar'){
      videoSrc = 'video/Roar.mp4'
      songSrc = 'mp3s/Roar.mp3'
      lyrics = lyricStore.filter((object) => object.song_id === 1)
      delay = 19500
    }
    else if(id === 'choose-everlong'){
      videoSrc = 'video/everlong.mp4'
      songSrc = 'mp3s/everlong.mp3'
      lyrics = lyricStore.filter((object) => object.song_id === 4)
      delay = 34000
    }
    else if(id === 'choose-wonderful-world'){
      videoSrc = 'video/what-a-wonderful-world.mp4'
      songSrc = 'mp3s/what-a-wonderful-world.mp3'
      lyrics = lyricStore.filter((object) => object.song_id === 2)
      delay = 6020
    }

    chooseSongDiv.classList.add('hidden')
    pressStart.innerHTML = "<h2>Get Ready! <br/> Press Enter To Play Song</h2>"
    pressStart.classList.remove('hidden')
    document.addEventListener('keydown', startGame)
  }

  function startGame(event){
    if(event.which === 13){
      document.removeEventListener('keydown', startGame)
      strikeBox()
      scoreBox()
      header.classList.add('hidden')
      chooseSongDiv.classList.add('hidden')
      pressStart.classList.add('hidden')
      lyricContainer.innerHTML = ''
      video.src = videoSrc
      song.src = songSrc


      video.classList.remove('hidden')
      document.addEventListener('keydown', typing, false)
      song.currentTime = 0;
      video.currentTime = 0;
      song.play()
      video.play()
      setTimeout(displayLyrics, delay)
    }
  }

  function displayLyrics(){
    let n = 0
    let duration = 0
    gameOver = false

    function displayLine(){
      if(lyrics[n] && !gameOver){
        const words = document.createElement('p')

        // build the words with span elements around the letters
        for (let i = 0; i < lyrics[n].content.length; i++) {
          const span = document.createElement("span");
          span.classList.add("span");
          span.innerHTML = lyrics[n].content[i];
          words.appendChild(span);
        }

        tallyStrikes()
        lyricContainer.innerHTML = words.innerHTML
        duration = lyrics[n].duration * 1000
        n++
        setTimeout(displayLine, duration)

      }
    }

    displayLine()

  }

  function typing(event) {
    const spans = document.querySelectorAll('.span');
    const typed = String.fromCharCode(event.which);

    for (let i = 0; i < spans.length; ++i) {
        if (spans[i].classList.contains("bg")) { // if it already has class with the bg color then check the next one
          continue;
        } else if (!spans[i].classList.contains("bg") && !spans[i-1] || spans[i-1].classList.contains("bg")) {

          if (spans[i].innerHTML.toLowerCase() === typed.toLowerCase()) {
            spans[i].classList.add("bg");
            tallyScore()
        }
      }
    }
  }

  function strikeBox(){
    strikesDiv.innerHTML = `<h3>Ten Strikes and You're Out</h3>
                            <p> Strikes:  </p>
                            <p id= strikesP> 0  </p>`
  }


  function tallyStrikes(){
    let lyricContainer = document.getElementById('lyric-container')
    let array = lyricContainer.querySelectorAll('span')
    let length = lyricContainer.querySelectorAll('span').length - 1
    let last = array[length]
    if (last){
      if (!last.classList.contains("bg")){
        document.getElementById("strikesP").innerText = parseInt(document.getElementById("strikesP").innerText) + 1
        if (parseInt(document.getElementById("strikesP").innerText)  === 10){
          document.removeEventListener('keydown', typing, false)
          gameOver = true
          song.pause()
          video.pause()
          document.getElementById("strikesP").innerText = "Strike 10! YOU LOSE!  (You clearly don't know good music...)"
          chooseSongDiv.classList.remove('hidden')

          // this counter is for the song select menu
          counter = -1
          document.addEventListener('keydown', menuSelect)
        }
      }
    }
  }

   function scoreBox(){
      score = 0
      scoreDiv.innerHTML =`<p> Your score: </p>
      <p id= "score" >  ${score} </p>
      <p> High Score: </p>
      <p id="highScore">  </p>`
   }

   function tallyScore(){
      scoreArea = document.getElementById("score")
      scoreArea.innerText = parseInt(scoreArea.innerText) + 1
      // if (parseInt(`${score}`) > parseInt(`${highScore}`)){
        Song.sendScore()
      }
})

Song.getSongs()
Lyric.getLyrics()
