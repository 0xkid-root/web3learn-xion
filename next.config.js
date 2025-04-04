module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login', // Redireciona para a página de login
          permanent: true, // Redirecionamento permanente
        },
      ]
    },
  }
  