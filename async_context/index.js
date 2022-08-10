const handler = () => {
  setTimeout(() => {
    return {
      data: {
        message: "Retorno do Contexto Asyncrono",
      },
    };
  }, 5000);
};
