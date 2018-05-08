document.addEventListener("DOMContentLoaded", function(){

  const startSong = document.getElementById('start-song')
  const lyricContainer = document.getElementById('lyric-container')
  const song = document.getElementById('audio')
  let gameOver = false

  startSong.addEventListener('click', function(){
    gameOver = false
    startSong.innerText = ''
    song.play()
    setTimeout(displayLyrics, 5600)
    strikeBox()
  })

  function displayLyrics(){
    let n = 0
    let duration = 0

    function displayLine(){
      if(lyricStore[n] && !gameOver){
        const words = document.createElement('p')

        // build the words with span elements around the letters
        for (let i = 0; i < lyricStore[n].content.length; i++) {
          const span = document.createElement("span");
          span.classList.add("span");
          span.innerHTML = lyricStore[n].content[i];
          words.appendChild(span);
        }

        // reset event listener
        document.removeEventListener("keydown", typing, false);
        tallyStrikes()

        lyricContainer.innerHTML = words.innerHTML
        document.addEventListener('keydown', typing, false)
        duration = lyricStore[n].duration * 1000
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
        }
      }
    }
  }

  function strikeBox(){
    strikesDiv = document.createElement("DIV")
    strikesDiv.id = "strikes"
    strikesDiv.innerHTML = `<h3>Ten Strikes and You are Out</h3>
                              <p id= strikesP> 0  </p>`
    document.querySelector("BODY").append(strikesDiv)
  }


  function tallyStrikes(){
    let lyricContainer = document.getElementById('lyric-container')
    let array = lyricContainer.querySelectorAll('span')
    let length = lyricContainer.querySelectorAll('span').length - 1
    let last = array[length]
    if (last){
      if (parseInt(document.getElementById("strikesP").innerText)  === 10){
        document.getElementById("strikesP").innerText = "Strike 10! YOU LOSE!  (You clearly don't know good music...)"
        gameOver = true
        song.pause()
      }
      else if (last.className !== "bg"){
        document.getElementById("strikesP").innerText = parseInt(document.getElementById("strikesP").innerText) + 1
      }
    }
  }


  Song.getSongs()
  Lyric.getLyrics()

})
