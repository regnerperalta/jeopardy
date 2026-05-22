export const GAME_LABELS = {
  CLUE_PREFIX: "",
  ANSWER_PREFIX: "",
  REVEAL_ANSWER: "Revelar Respuesta",
  RETURN_TO_BOARD: "Volver al Tablero",
  CONSOLE_TITLE: "",
  CORRECT_PREFIX: "Correcto (+$",
  INCORRECT_PREFIX: "Incorrecto (-$",
  CLOSE_PAREN: ")",
} as const;

export const BOARD_LABELS = {
  EXIT_BTN_TITLE: "Leave current board",
  EXIT_BTN_ARIA: "Leave current board",
  POINT_PREFIX: "$",
} as const;

export const SETUP_LABELS = {
  DEFAULT_GAME_TITLE: "Full de Cultura Dominicana",
  DEFAULT_BOARD_ID: "001",
  DEFAULT_PLAYER_NAMES: ["Jugador 1", "Jugador 2", "Jugador 3"],
  FALLBACK_ORCHESTRATOR_TITLE: "JEOPARDY",

  SUBMITTING_MESSAGE: "Consultando el tablero en DynamoDB...",
  DEFAULT_ERROR_MESSAGE: "Ocurrió un problema al consultar este tablero en la base de datos.",

  MAP_ALT_TEXT: "Silueta del mapa de la República Dominicana",

  CONFIG_TITLE: "Configuración del Juego",
  LABEL_GAME_TITLE: "TÍTULO DE LA PANTALLA",
  PLACEHOLDER_GAME_TITLE: "ej., Full de Cultura Dominicana",
  LABEL_BOARD_ID: "NUMERO DEL JUEGO",
  PLACEHOLDER_BOARD_ID: "ej., 001, 002",
  LABEL_PLAYER_PREFIX: "NOMBRE DEL JUGADOR ",
  LABEL_PLAYER_SUFFIX: "",
  PLACEHOLDER_PLAYER_PREFIX: "Concursante ",

  LAUNCH_BTN_TEXT: "INICIAR JUEGO",
} as const;

export const APP_CONFIG = {
  // Configuración del Sistema e Infraestructura
  API_BASE_URL: "https://9qfyhpni04.execute-api.us-east-1.amazonaws.com/prod/",
  
  // Valores por Defecto
  DEFAULT_DISPLAY_TITLE: "Full de Cultura Dominicana",
  FALLBACK_CONTESTANT_NAME: "Concursante 1",

  // Tiempos y Animaciones (en milisegundos)
  TRANSITION_DELAY_MS: 2500,

  // Alertas y Mensajes de Confirmación
  EXIT_CONFIRM_MESSAGE: "¿Estás seguro de que deseas salir? Los puntajes se reiniciarán.",
  
  // Errores de API
  ERROR_BOARD_NOT_FOUND: (boardId: string) => `No se pudo encontrar el Tablero con ID "${boardId}"`,

  // Textos de la Interfaz (Pantalla de Transición / Splash)
  SPLASH_BANNER_TEXT: "¡PREPÁRATE!",
  SPLASH_SUBTEXT_PREFIX: "Cargando Tablero de ",
} as const;

/*
export const APP_CONFIG = {
  // Configuración del Sistema e Infraestructura
  API_BASE_URL: "https://9qfyhpni04.execute-api.us-east-1.amazonaws.com/prod/",
  
  // Valores por Defecto
  DEFAULT_DISPLAY_TITLE: "HERENCIA QUISQUEYANA",
  FALLBACK_CONTESTANT_NAME: "Contestant 1",

  // Tiempos y Animaciones (en milisegundos)
  TRANSITION_DELAY_MS: 2500,

  // Alertas y Mensajes de Confirmación
  EXIT_CONFIRM_MESSAGE: "Are you sure you want to exit? Scores will be reset.",
  
  // Errores de API
  ERROR_BOARD_NOT_FOUND: (boardId: string) => `Could not find Board ID "${boardId}"`,

  // Textos de la Interfaz (Pantalla de Transición / Splash)
  SPLASH_BANNER_TEXT: "¡PREPÁRATE!",
  SPLASH_SUBTEXT_PREFIX: "Cargando Tablero de ",
} as const;

export const SETUP_LABELS = {
  // Valores iniciales por defecto
  DEFAULT_GAME_TITLE: "Herencia Quisqueyana",
  DEFAULT_BOARD_ID: "001",
  DEFAULT_PLAYER_NAMES: ["Player 1", "Player 2", "Player 3"],
  FALLBACK_ORCHESTRATOR_TITLE: "JEOPARDY",

  // Mensajes de estado y error
  SUBMITTING_MESSAGE: "Querying DynamoDB Deck...",
  DEFAULT_ERROR_MESSAGE: "An issue occurred querying this deck from the database.",

  // Accesibilidad e Imágenes
  MAP_ALT_TEXT: "Dominican Republic Map Outline Overlay",

  // Encabezados y Etiquetas del Formulario
  CONFIG_TITLE: "Game Engine Configuration",
  LABEL_GAME_TITLE: "GAME DISPLAY TITLE",
  PLACEHOLDER_GAME_TITLE: "e.g., Herencia Quisqueyana",
  LABEL_BOARD_ID: "DYNAMODB BOARD ID",
  PLACEHOLDER_BOARD_ID: "e.g., 001, 002",
  LABEL_PLAYER_PREFIX: "PLAYER ",
  LABEL_PLAYER_SUFFIX: " NAME",
  PLACEHOLDER_PLAYER_PREFIX: "Contestant ",

  // Botones de acción
  LAUNCH_BTN_TEXT: "LAUNCH GAME BOARD",
} as const;


export const GAME_LABELS = {
  CLUE_PREFIX: "CLUE: ",
  ANSWER_PREFIX: "ANSWER: ",
  REVEAL_ANSWER: "Reveal Answer",
  RETURN_TO_BOARD: "Return to Board",
  CONSOLE_TITLE: "Scorekeeper Console: Adjust Player Points",
  CORRECT_PREFIX: "Correct (+$",
  INCORRECT_PREFIX: "Incorrect (-$",
  CLOSE_PAREN: ")",
} as const; 
*/