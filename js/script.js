// Funzione princiapale
function martinosflix() {
    new Vue({
        el: '#vue',
        data: {
            search: '', // Stringa ricerca (v-model)
            searched: false, // Ricerca effettuta
            popularFilm: [], // Lista film popolari
            filmList: [], // Lista films cercati
            serieList: [], // Lista serie cercate
            api_key: '159bee94cc034456f8348926b952865b', // API key fisso
            nameList: [], // Lista nomi attori film/serie cliccata
            genreList: [], // Lista generi film/serie cliccata
            show: '', // classe display block
            slicedWord: 50 // lunghezza stringa overview
        },
        // Funzione film random/popolari
        mounted: function () {
            axios.get('https://api.themoviedb.org/3/movie/popular',
                {
                    params:{
                        api_key: this.api_key,
                        language: 'en-EN',
                        page: 1
                    }
                }).then(data => {
                        console.log('DATA: ', data.data.results);
                        this.popularFilm = data.data.results;
                }).catch(() => {
                    console.log('Error');
            });
        },
        computed:{
            // Generatore lista popular copiata, con stelle in base 5
            popular: function () {
                return this.popularFilm.map((film) =>{
                    let stars = film.vote_average ;
                    let rating = Math.round((5 * stars) / 10);

                    let newPopular = {...film};
                    newPopular.vote_average = rating;
                    return newPopular;
                });
            },
            // Generatore lista films copiata, con stelle in base 5
            films: function () {
                this.popularFilm = []; 
                
                return this.filmList.map((film) =>{
                    let stars = film.vote_average ;
                    let rating = Math.round((5 * stars) / 10);
                    
                    let newFilm = {...film};
                    newFilm.vote_average = rating;
                    return newFilm;
                });
            },
            // Generatore lista serie copiata, con stelle in base 5
            series: function () {
                this.popularFilm = [];
                
                return this.serieList.map((serie) =>{
                    let stars = serie.vote_average ;
                    let rating = Math.round((5 * stars) / 10);
                    
                    let newserie = {...serie};
                    newserie.vote_average = rating;
                    return newserie;
                });
            }
        },
        methods: {
            // Funzione ricerca film/serie
            searchFilm: function () {
                if (this.search != '' && this.search[0] != ' ') {
                    console.log('Hai cercato: ' + this.search);
                    
                    // API ricerca film per nome
                    axios.get('https://api.themoviedb.org/3/search/movie',
                    {
                        params:{
                            api_key: this.api_key,
                            query: this.search
                        }
                    }).then(data => {
                        console.log('Films: ', data.data.results);
                        this.filmList = data.data.results;
                        
                    }).catch(() => {
                        console.log('Error');
                    });
                    
                    // API ricerca serie per nome
                    axios.get('https://api.themoviedb.org/3/search/tv',
                    {
                        params:{
                            api_key: this.api_key,
                            query: this.search
                        }
                    }).then(data => {
                        console.log('Serie TV: ', data.data.results);
                        this.serieList = data.data.results;
                        
                    }).catch(() => {
                        console.log('Error');
                    });
                }
                this.searched = true;
            },
            actorsAndGenres: function (id) {
                // API attori e generi per ID (film)
                axios.get('https://api.themoviedb.org/3/movie/' + id, 
                {
                    params:{
                        api_key: this.api_key,
                        append_to_response: 'credits'
                    }
                }).then(data => {
                    if (this.nameList.length == 0) {
                        let axiosActors = data.data.credits.cast.slice(0,5);
                            for (let i = 0; i < axiosActors.length; i++) {
                                const element = axiosActors[i];
                                this.nameList.push(element.original_name);
                            }
                        }

                        if (this.genreList.length == 0) {
                            let axiosGenres = data.data.genres;
                            for (let i = 0; i < axiosGenres.length; i++) {
                                const element = axiosGenres[i];
                                this.genreList.push(element.name);
                            }
                        }
                        
                        this.show = 'show';
                        this.slicedWord = 1000;
                    }).catch(() => {
                        console.log('Error');
                    });
            },
            actorsAndGenresSerie: function (id) {
                // API attori e generi per ID (serie)
                axios.get('https://api.themoviedb.org/3/tv/' + id, 
                    {
                        params:{
                            api_key: this.api_key,
                            append_to_response: 'credits'
                        }
                    }).then(data => {
                        if (this.nameList.length == 0) {
                            let axiosActors = data.data.credits.cast.slice(0,5);
                            for (let i = 0; i < axiosActors.length; i++) {
                                const element = axiosActors[i];
                                this.nameList.push(element.original_name);
                            }
                        }

                        if (this.genreList.length == 0) {
                            let axiosGenres = data.data.genres;
                            for (let i = 0; i < axiosGenres.length; i++) {
                                const element = axiosGenres[i];
                                this.genreList.push(element.name);
                            }
                        }

                        this.show = 'show';
                        this.slicedWord = 1000;
                    }).catch(() => {
                        console.log('Error');
                    });
            },
            // Funzione pulizia attori/generi
            cleanList: function () {
                this.show = '';
                this.nameList = [];
                this.genreList = [];
                this.slicedWord = 50;
            },
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);