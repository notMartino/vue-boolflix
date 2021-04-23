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
            slicedWord: 50, // lunghezza stringa overview
            genresList: [], // Lisat generi
            filteredFilms: [],
            filteredSeries: [],
            filter: 0
        },
        mounted: function () {
            // Richiamo la funzione film popolari a pagina montata
            this.getPopular();
            this.getGenres('movie');
            this.getGenres('tv');
        },
        computed:{
            // Generatore lista popular copiata, con stelle in base 5
            popular: function () {
                return this.arrayMap(this.popularFilm);
            },
            // Generatore lista films copiata, con stelle in base 5
            films: function () {
                return this.arrayMap(this.filmList);
            },
            // Generatore lista serie copiata, con stelle in base 5
            series: function () {
                return this.arrayMap(this.serieList);
            }
        },
        methods: {
            // Funzione ricerca film/serie
            searchFilm: function (type) {
                if (this.search != '' && this.search[0] != ' ') {
                    console.log("You've searcehd ("+ type + '): ' + this.search);
                    // API ricerca film/serie per nome
                    axios.get('https://api.themoviedb.org/3/search/' + type,
                    {
                        params:{
                            api_key: this.api_key,
                            query: this.search
                        }
                    }).then(data => {
                        
                        if (type == 'movie') {
                            console.log('Films: ', data.data.results);
                            this.filmList = data.data.results;
                        }else{
                            console.log('Series: ', data.data.results);
                            this.serieList = data.data.results;
                        }
                        
                        this.popularFilm = []; 
                        if (this.filmList.length < 1 && this.serieList.length < 1) {
                            this.getPopular();
                        }

                    }).catch(() => {
                        console.log('Error');
                    });
                }
                    this.searched = true;
            },
            // Funzione genera film popolari
            getPopular: function () {
                axios.get('https://api.themoviedb.org/3/movie/popular',
                    {
                        params:{
                            api_key: this.api_key,
                            language: 'en-US',
                            page: 1
                        }
                    }).then(data => {
                            console.log('Popular: ', data.data.results);
                            this.popularFilm = data.data.results;
                    }).catch(() => {
                        console.log('Error');
                });   
            }
            ,
            // Lista generica copiata, con stelle in base 5
            arrayMap: function (arrayList) {
                return arrayList.map((film) => {
                    let stars = film.vote_average ;
                    let rating = Math.round((5 * stars) / 10);

                    let newItem = {...film};
                    newItem.vote_average = rating;
                    return newItem;
                });
            },
            actorsAndGenres: function (id, type) {
                // API attori e generi per ID
                axios.get('https://api.themoviedb.org/3/' + type + '/' + id, 
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
            // Funzione ricerca generi disponibili
            getGenres: function (type) {
                axios.get('https://api.themoviedb.org/3/genre/'+ type +'/list',
                {
                    params:{
                        api_key: this.api_key,
                        language: 'en-US'
                    }
                }).then(data => {
                    let arrayGenres = data.data.genres;
                    
                    for (let i = 0; i < arrayGenres.length; i++) {
                        let cont = 0;
                        for (let j = 0; j < this.genresList.length; j++) {
                            if (this.genresList[j].id == arrayGenres[i].id) {
                                cont++;
                                break;
                            }
                        }
                        if (cont == 0) {
                            this.genresList.push(arrayGenres[i])
                        }
                    }

                    this.filterByGenre();
                }).catch(() => {
                    console.log('Error');
                });
            },
            filterByGenre: function () {
                this.filteredFilms = this.filmList.filter(film => {
                    if (this.filter == 0) {
                        console.log('oooo');
                        return film;
                    }
                    else{
                        let cont = 0;
                        for (let i = 0; i < film.genre_ids.length; i++) {
                            if (this.filter == film.genre_ids[i]) {
                                console.log('genere', film.genre_ids[i]);
                                cont++;
                                break;
                            }
                        }
                        console.log(cont);
                        if (cont > 0) {
                            console.log(film);
                            return film;
                        }
                    }
                    console.log(this.filter, film.genre_ids);
                });
                console.log(this.filteredFilms);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);