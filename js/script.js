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
                        console.log('Popular: ', data.data.results);
                        this.popularFilm = data.data.results;
                }).catch(() => {
                    console.log('Error');
            });
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

                        // if (this.filmList.length > 0 && this.serieList.length > 0) {
                            this.popularFilm = []; 
                        // }
                    }).catch(() => {
                        console.log('Error');
                    });
                }
                this.searched = true;
            },
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
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);