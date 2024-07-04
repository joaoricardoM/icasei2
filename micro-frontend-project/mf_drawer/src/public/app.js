document.addEventListener('DOMContentLoaded', () => {
  const videosLink = document.getElementById('videos-link')
  const favoritosLink = document.getElementById('favoritos-link')
  const contentDiv = document.getElementById('content')
  const favoritesCountSpan = document.getElementById('favorites-count')

  displayWelcomeScreen()

  // Inicialmente carregar a lista de vídeos
  if (window.location.pathname === '/videos') {
    fetchVideos()
    setActiveLink(videosLink)
  } else if (window.location.pathname === '/favoritos') {
    fetchFavorites()
    setActiveLink(favoritosLink)
  }

  if (videosLink) {
    videosLink.addEventListener('click', (event) => {
      event.preventDefault()
      history.pushState(null, '', '/videos')
      fetchVideos()
      setActiveLink(videosLink)
    })
  }

  if (favoritosLink) {
    favoritosLink.addEventListener('click', (event) => {
      event.preventDefault()
      history.pushState(null, '', '/favoritos')
      fetchFavorites()
      setActiveLink(favoritosLink)
    })
  }

  function fetchVideos() {
    fetch('http://192.168.30.20:3003/index.html') // URL da página de vídeos
      .then((response) => response.text())
      .then((data) => {
        contentDiv.innerHTML = data

        // Carregar o estilo da página de vídeos
        const videoStyles = document.createElement('link')
        videoStyles.rel = 'stylesheet'
        videoStyles.href = 'http://192.168.30.20:3003/styles.css' // URL do CSS da página de vídeos
        document.head.appendChild(videoStyles)

        // Carregar e executar o script da página de vídeos
        const script = document.createElement('script')
        script.src = 'http://192.168.30.20:3003/app.js' // URL do script da página de vídeos
        document.body.appendChild(script)
      })
      .catch((error) =>
        console.error('Erro ao carregar página de vídeos:', error)
      )
  }

  function fetchFavorites() {
    fetch('http://192.168.30.20:3002/favorites')
      .then((response) => response.json())
      .then((data) => {
        contentDiv.innerHTML = ''
        const favoritesContainer = document.createElement('div')
        favoritesContainer.classList.add('favorites-container')
        data.forEach((video) => {
          const videoWrapper = document.createElement('div')
          videoWrapper.classList.add('video-wrapper')
          videoWrapper.innerHTML = `
              <h6>${video.title}</h6>
              <iframe width="250" height="180" src="https://www.youtube.com/embed/${video.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <button data-video-id="${video.videoId}" class="remove-favorite-button">Remover Favorito</button>
            `
          favoritesContainer.appendChild(videoWrapper)
        })

        contentDiv.appendChild(favoritesContainer)

        document
          .querySelectorAll('.remove-favorite-button')
          .forEach((button) => {
            button.addEventListener('click', (event) => {
              const videoId = event.target.getAttribute('data-video-id')
              fetch(`http://192.168.30.20:3002/favorites/${videoId}`, {
                method: 'DELETE'
              })
                .then(() => {
                  // Atualizar lista de favoritos após remoção
                  showToast('Removido com sucesso!', 'success')
                  fetchFavorites() // Recarregar a lista de favoritos
                })
                .catch(
                  (error) => showToast('Erro ao remover!', 'error'),
                  console.error('Erro ao remover favorito:', error)
                )
            })
          })

        // Atualizar contador de favoritos no rodapé
        updateFavoritesCounter()
      })
      .catch((error) =>
        console.error('Erro ao obter lista de favoritos:', error)
      )
  }

  // Função para atualizar o contador de favoritos no rodapé
  function updateFavoritesCounter() {
    fetch('http://192.168.30.20:3002/favorites/count')
      .then((response) => response.json())
      .then((data) => {
        favoritesCountSpan.textContent = `(${data.count})`
      })
      .catch((error) =>
        console.error('Erro ao atualizar contador de favoritos:', error)
      )
  }

  // Função para marcar o link ativo na barra de navegação
  function setActiveLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link')
    navLinks.forEach((link) => link.classList.remove('active'))
    activeLink.classList.add('active')
  }

  // Função para exibir a tela de boas-vindas
  function displayWelcomeScreen() {
    contentDiv.innerHTML = `
    <div class="welcome-screen">
      <h1>Bem-vindo ao MF Videos!</h1>
      <p>Clique para começar</p>
      <button id="start-button">Começar</button>
    </div>
  `

    // Adicionar evento ao botão de começar
    document.getElementById('start-button').addEventListener('click', () => {
      fetchVideos()
      setActiveLink(videosLink)
    })
  }

  // Função para exibir um toast
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

  // Chamar a função de atualização de contador de favoritos ao carregar a página
  updateFavoritesCounter()
})

// Lidando com navegação do histórico do navegador
window.addEventListener('popstate', () => {
  const videosLink = document.getElementById('videos-link')
  const favoritosLink = document.getElementById('favoritos-link')

  if (window.location.pathname === '/videos') {
    fetchVideos()
    setActiveLink(videosLink)
  } else if (window.location.pathname === '/favoritos') {
    fetchFavorites()
    setActiveLink(favoritosLink)
  } else {
    displayWelcomeScreen()
  }
})
