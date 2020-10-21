window.podcastData = {
    // Put your audio file name below
    audio: "data/my episode.mp3",

    // Customize the meta data of the podcast content. There is a version for each language
    // If the language of the user is not compatible, English (en) will be used
    metadata: {
        author: "Adam Charlesworth",
        description: "Teach on Mars is the finest next-gen learning ecosystem in the (known) universe. We connect people with the learning and communities they need to do their jobs - and live their lives - better.",
        title: "Teach on Mars - Mobile learning Apps",
    },

    // Customize the footer of the podcast content
    footer: "<center><em>Copyright Teach on Mars 2019</em></center>",

    // Put the cover image file name below
    cover: "data/cover.jpg",

    // Determine how many points the learner will earn when reaching the end of the podcast.
    points: 30,

    // Change the colors of the wave form below
    // waveColor: color of the unread part (on the right hand side)
    waveColor: "#ffa3a3",
    // progressColor: color of the read part (on the left hand side)
    progressColor: "#f73636",

    // Change the color of the player controls below
    controlsColor: "#000",

    // These are user interface texts.
    // There is no need to change them, but you can if you want to
    ui: {
        "fr": {
            duration: "Durée :",
            author: "Auteur :",
            loading: "Chargement...",
        },
        "en": {
            duration: "Duration:",
            author: "Author:",
            loading: "Loading...",

        },

    }
}
