loadRandomVideos()

document.getElementById('search-button').addEventListener('click', () => {
  const favoritesCountSpan = document.getElementById('favorites-count')
  const query = document.getElementById('search-input').value
  fetch(`http://192.168.30.20:3001/search?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const videosList = document.getElementById('videos-list')
      videosList.innerHTML = ''
      if (data.videos && data.videos.length > 0) {
        // Verifica se o array de vídeos está definido
        data.videos.forEach((video) => {
          const videoElement = document.createElement('div')
          videoElement.innerHTML = `
          <div class="video-list-container">
            <h6>${video.title}</h6>
            <iframe width="250" height="180" src="https://www.youtube.com/embed/${video.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <button data-video-id="${video.videoId}" data-video-title="${video.title}" class="favorite-button">⭐</button>
          </div>
          `
          videosList.appendChild(videoElement)
        })

        document.querySelectorAll('.favorite-button').forEach((button) => {
          button.addEventListener('click', (e) => {
            const videoId = e.target.getAttribute('data-video-id')
            const title = e.target.getAttribute('data-video-title')
            fetch('http://192.168.30.20:3002/favorites')
              .then((response) => response.json())
              .then((favorites) => {
                const isAlreadyFavorite = favorites.some(
                  (video) => video.videoId === videoId
                )
                if (isAlreadyFavorite) {
                  showToast('Vídeo já está nos favoritos!', 'error')
                } else {
                  fetch(`http://192.168.30.20:3002/favorites`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ videoId, title })
                  }).then(() => {
                    showToast(
                      'Adicionado aos favoritos com sucesso!',
                      'success'
                    )
                    updateFavoritesCounter()
                  })
                }
              })
          })
        })
      } else {
        showToast('Vídeo não encontrado!', 'error')
        videosList.innerHTML = '<p>Vídeo não encontrado</p>'
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar vídeos:', error)
      document.getElementById('videos-list').innerHTML =
        '<p>Erro ao buscar vídeos</p>'
      showToast('Erro ao buscar vídeos', 'error')
    })

  function updateFavoritesCounter() {
    fetch('http://192.168.30.20:3002/favorites/count')
      .then((response) => response.json())
      .then((data) => {
        return (favoritesCountSpan.textContent = `(${data.count})`)
      })
      .catch((error) => {
        console.error('Error updating favorites counter:', error)
      })
  }
})

function updateFavorites() {
  fetch('http://192.168.30.20:3002/favorites/count')
    .then((response) => response.json())
    .then((data) => {
      return (favoritesCountSpan.textContent = `(${data.count})`)
    })
    .catch((error) => {
      console.error('Error updating favorites counter:', error)
    })
}

function loadRandomVideos() {
  fetch('http://192.168.30.20:3001/search')
    .then((response) => response.json())
    .then((data) => {
      console.log(data.videos)
      displayVideos(data.videos)
    })
    .catch((error) => {
      console.error('Erro ao carregar vídeos aleatórios:', error)
      showToast('Erro ao carregar vídeos aleatórios', 'error')
    })
}

function createStarElement(videoId, title) {
  const favoriteButton = document.createElement('button')
  favoriteButton.className = 'favorites-button'
  favoriteButton.dataset.videoId = videoId
  favoriteButton.dataset.videoTitle = title

  const star = document.createElement('span')
  star.className = 'star'
  star.textContent = '★'

  favoriteButton.appendChild(star)

  favoriteButton.addEventListener('click', (e) => {
    const videoId = e.target
      .closest('.favorites-button')
      .getAttribute('data-video-id')
    const title = e.target
      .closest('.favorites-button')
      .getAttribute('data-video-title')
    fetch('http://192.168.30.20:3002/favorites')
      .then((response) => response.json())
      .then((favorites) => {
        const isAlreadyFavorite = favorites.some(
          (video) => video.videoId === videoId
        )
        if (isAlreadyFavorite) {
          showToast('Vídeo já está nos favoritos!', 'error')
        } else {
          fetch('http://192.168.30.20:3002/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoId, title })
          }).then(() => {
            showToast('Adicionado aos favoritos com sucesso!', 'success')
            button.classList.add('favorited')
            updateFavorites()
          })
        }
      })
  })

  return favoriteButton
}

function displayVideos(videos) {
  const container = document.getElementById('videos-random')
  container.innerHTML = '' // Limpa o conteúdo anterior

  videos.forEach((video) => {
    const videoElement = document.createElement('div')
    videoElement.className = 'video'

    const titleElement = document.createElement('h6')
    titleElement.textContent = video.title

    const iframeElement = document.createElement('iframe')
    iframeElement.src = `https://www.youtube.com/embed/${video.videoId}`
    iframeElement.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    iframeElement.allowFullscreen = true

    const favoriteButton = createStarElement(video.videoId, video.title)

    videoElement.appendChild(titleElement)
    videoElement.appendChild(iframeElement)
    videoElement.appendChild(favoriteButton)
    container.appendChild(videoElement)
  })
}

// Função para exibir um toast de erro
function showToast(message, type) {
  const toastContainer = document.getElementById('toast-container')
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.classList.add(type)
  toast.textContent = message

  toastContainer.appendChild(toast)

  // Mostrar o toast
  setTimeout(() => {
    toast.classList.add('show')
  }, 100)

  // Remover o toast após 3 segundos
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => {
      toastContainer.removeChild(toast)
    }, 300)
  }, 3000)
}

// Atualiza o contador de favoritos ao carregar a página
document.addEventListener('DOMContentLoaded', updateFavoritesCounter)
