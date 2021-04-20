// Funzione princiapale
function martinosflix() {

    new Vue({
        el: '#vue',
        data: {
            search: '',
            filmList: [],
            serieList: [],
            api_key: '159bee94cc034456f8348926b952865b',
            starClass: '',
            nameList: [],
            genreList: [],
            show: ''
        },
        computed:{
            films: function () {
                return this.filmList.map((film) =>{
                    let stars = film.vote_average ;
                    let rating = Math.round((5 * stars) / 10);

                    let newFilm = {...film};
                    newFilm.vote_average = rating;
                    return newFilm;
                });
            },
            series: function () {
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
            },
            actorsAndGenres: function (id) {
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
                    }).catch(() => {
                        console.log('Error');
                    });
            },
            cleanList: function () {
                this.show = '';
                this.nameList = [];
                this.genreList = [];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', martinosflix);